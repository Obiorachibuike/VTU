const crypto = require('crypto');
const PaymentIntent = require('../models/PaymentIntent');
const User = require('../models/UserSchema');
const { demoPayments, initializePaystack, confirmDeposit, verifyWebhookSignature } = require('../services/paymentService');
const { encrypt, decrypt } = require('../services/withdrawalCrypto');

const amountToKobo = value => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount < 100 || amount > 1000000) return null;
  return amount * 100;
};

async function initializeDeposit(req, res) {
  const amountKobo = amountToKobo(req.body.amount);
  if (!amountKobo) return res.status(400).json({ error: 'Enter a whole-number deposit from ₦100 to ₦1,000,000.' });
  const demo = demoPayments();
  if (!demo && !process.env.PAYSTACK_SECRET_KEY) return res.status(503).json({ error: 'Deposits are temporarily unavailable.' });

  const intent = await PaymentIntent.create({
    user: req.user._id,
    reference: `vtu_${crypto.randomUUID().replace(/-/g, '')}`,
    amountKobo,
    provider: demo ? 'demo' : 'paystack',
  });
  try {
    const authorizationUrl = demo ? null : await initializePaystack(intent, req.user.email);
    res.status(201).json({
      reference: intent.reference,
      amount: amountKobo / 100,
      mode: demo ? 'demo' : 'paystack',
      authorizationUrl,
      message: demo ? 'Demo deposit created. It will only add demo funds after you confirm it.' : undefined,
    });
  } catch (error) {
    intent.status = 'failed';
    await intent.save();
    res.status(503).json({ error: error.message });
  }
}

async function verifyDeposit(req, res) {
  try {
    const intent = await PaymentIntent.findOne({ reference: req.params.reference, user: req.user._id });
    if (!intent) return res.status(404).json({ error: 'Deposit reference not found.' });
    const result = await confirmDeposit(intent.reference, req.body?.confirmDemo === true);
    const user = await User.findById(req.user._id).select('wallet transactions');
    res.json({ ...result, wallet: user.wallet, transactions: user.transactions.slice(-10).reverse() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function paystackWebhook(req, res) {
  const signature = req.get('x-paystack-signature');
  if (!verifyWebhookSignature(req.rawBody, signature)) return res.sendStatus(401);
  if (req.body?.event !== 'charge.success' || !req.body?.data?.reference) return res.sendStatus(200);
  try {
    const intent = await PaymentIntent.findOne({ reference: req.body.data.reference, provider: 'paystack' });
    if (!intent) return res.sendStatus(200);
    await confirmDeposit(intent.reference);
    return res.sendStatus(200);
  } catch (error) {
    console.error('Deposit webhook processing failed:', error.message);
    return res.sendStatus(500);
  }
}

async function requestWithdrawal(req, res) {
  const amountKobo = amountToKobo(req.body.amount);
  const accountNumber = String(req.body.accountNumber || '').replace(/\s/g, '');
  const bankName = String(req.body.bankName || '').trim().slice(0, 80);
  const accountName = String(req.body.accountName || '').trim().slice(0, 100);
  if (!amountKobo || !/^\d{10}$/.test(accountNumber) || !bankName || !accountName) {
    return res.status(400).json({ error: 'Provide a whole-number amount (₦100–₦1,000,000), bank, account name, and 10-digit account number.' });
  }
  const reference = `wd_${crypto.randomUUID().replace(/-/g, '')}`;
  let encrypted;
  try { encrypted = encrypt(JSON.stringify({ bankName, accountName, accountNumber })); }
  catch (error) { return res.status(503).json({ error: error.message }); }
  if (process.env.NODE_ENV === 'production' && !process.env.WITHDRAWAL_ENCRYPTION_KEY) return res.status(503).json({ error: 'Withdrawals are not configured.' });
  const result = await User.updateOne(
    { _id: req.user._id, 'wallet.balance': { $gte: amountKobo / 100 }, 'transactions.reference': { $ne: reference } },
    {
      $inc: { 'wallet.balance': -(amountKobo / 100) },
      $push: { transactions: {
        amount: amountKobo / 100, type: 'debit', mode: 'bank_transfer', status: 'pending',
        description: 'Withdrawal request — pending manual review', category: 'withdrawal', reference,
        metadata: { encryptedAccount: encrypted },
      } },
    },
  );
  if (result.modifiedCount !== 1) return res.status(400).json({ error: 'Insufficient wallet balance. Please check your balance and try again.' });
  res.status(201).json({ reference, status: 'pending', message: 'Withdrawal request submitted. It will be reviewed by an administrator.' });
}

async function listTransactions(req, res) {
  const user = await User.findById(req.user._id).select('wallet transactions');
  res.json({ wallet: user.wallet, transactions: [...user.transactions].reverse().slice(0, 100) });
}

async function listWithdrawals(req, res) {
  const users = await User.find({ 'transactions.category': 'withdrawal' }).select('name email transactions');
  const requests = users.flatMap(user => user.transactions
    .filter(tx => tx.category === 'withdrawal' && tx.status === 'pending')
    .map(tx => { let details = {}; try { details = JSON.parse(decrypt(tx.metadata?.encryptedAccount)); } catch (_) {} return { reference: tx.reference, userId: user._id, name: user.name, email: user.email, amount: tx.amount, details, date: tx.date }; }));
  res.json({ withdrawals: requests });
}

async function resolveWithdrawal(req, res) {
  const { decision } = req.body;
  if (!['approve', 'reject'].includes(decision)) return res.status(400).json({ error: 'Decision must be approve or reject.' });
  const reference = String(req.params.reference);
  const filter = { _id: req.params.userId, transactions: { $elemMatch: { reference, category: 'withdrawal', status: 'pending' } } };
  const update = { $set: { 'transactions.$.status': decision === 'approve' ? 'completed' : 'refunded', 'transactions.$.description': decision === 'approve' ? 'Withdrawal approved by administrator; bank payout must be reconciled' : 'Withdrawal rejected and wallet refunded' } };
  if (decision === 'reject') {
    const user = await User.findOne(filter).select('transactions');
    if (!user) return res.status(404).json({ error: 'Pending withdrawal not found.' });
    const amount = user.transactions.find(tx => tx.reference === reference).amount;
    update.$inc = { 'wallet.balance': amount };
  }
  const result = await User.updateOne(filter, update);
  if (!result.modifiedCount) return res.status(404).json({ error: 'Pending withdrawal not found.' });
  res.json({ message: decision === 'approve' ? 'Withdrawal approved.' : 'Withdrawal rejected and wallet refunded.' });
}

module.exports = { initializeDeposit, verifyDeposit, paystackWebhook, requestWithdrawal, listTransactions, listWithdrawals, resolveWithdrawal };
