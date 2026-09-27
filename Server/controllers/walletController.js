/**
 * Wallet controller — deposits, withdrawals, bank accounts, summary.
 *
 * Deposits
 *   • Paystack configured  -> hosted checkout + server-side verification.
 *   • Demo mode (no key)   -> local /pay/:reference checkout page which calls
 *                             the same verify endpoint. Fully working flow.
 *
 * Withdrawals
 *   • Paystack configured  -> Paystack transfer (pending until settled).
 *   • Demo mode            -> marked completed instantly.
 */
const { getModel } = require('../models');
const { genRef, adjustBalance, notify, recordTransaction, publicTransaction } = require('../utils/helpers');
const paystack = require('../services/paystack');
const { BANKS } = require('../data/catalog');

const MIN_DEPOSIT = Number(process.env.MIN_DEPOSIT || 100);
const MIN_WITHDRAWAL = Number(process.env.MIN_WITHDRAWAL || 500);

const frontendUrl = (req) =>
  process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:3000';

/* ------------------------------------------------------------ wallet home */
const getWallet = async (req, res) => {
  try {
    const Transaction = getModel('Transaction');
    const userId = String(req.user._id);

    const txns = await Transaction.find({ user: userId }).sort({ date: -1 }).limit(500).lean();

    const completed = txns.filter((t) => t.status === 'completed');
    const sum = (list) => list.reduce((acc, t) => acc + Number(t.amount || 0), 0);

    res.json({
      balance: req.user.wallet.balance,
      currency: req.user.wallet.currency,
      stats: {
        totalDeposited: sum(completed.filter((t) => t.category === 'deposit')),
        totalWithdrawn: sum(completed.filter((t) => t.category === 'withdrawal')),
        totalSpent: sum(
          completed.filter((t) => ['airtime', 'data', 'tv', 'electricity', 'flight'].includes(t.category))
        ),
        transactionCount: txns.length,
      },
      recent: txns.slice(0, 8).map(publicTransaction),
    });
  } catch (error) {
    console.error('getWallet:', error);
    res.status(500).json({ error: 'Could not load wallet' });
  }
};

/* --------------------------------------------------------------- deposits */
const initDeposit = async (req, res) => {
  try {
    const { amount, method = 'card' } = req.body;
    const value = Number(amount);

    if (!value || Number.isNaN(value) || value < MIN_DEPOSIT) {
      return res.status(400).json({ error: `Minimum deposit is ₦${MIN_DEPOSIT.toLocaleString()}` });
    }
    if (value > 5000000) {
      return res.status(400).json({ error: 'Maximum single deposit is ₦5,000,000' });
    }

    const reference = genRef('DEP');
    const usePaystack = paystack.isPaystackEnabled();

    await recordTransaction({
      userId: req.user._id,
      reference,
      category: 'deposit',
      type: 'credit',
      amount: value,
      status: 'pending',
      description: `Wallet deposit (${method})`,
      mode: method,
      metadata: { gateway: usePaystack ? 'paystack' : 'demo', method },
      silentNotify: true,
    });

    let paymentUrl;
    if (usePaystack) {
      const init = await paystack.initializeTransaction({
        email: req.user.email,
        amount: value,
        reference,
        callbackUrl: `${frontendUrl(req)}/pay/${reference}?verify=1`,
        metadata: { userId: String(req.user._id), reference },
      });
      paymentUrl = init.authorization_url;
    } else {
      paymentUrl = `/pay/${reference}`; // local demo checkout
    }

    res.status(201).json({ reference, amount: value, gateway: usePaystack ? 'paystack' : 'demo', paymentUrl });
  } catch (error) {
    console.error('initDeposit:', error);
    res.status(500).json({ error: error.message || 'Could not start deposit' });
  }
};

/** Credit the wallet for a pending deposit. Idempotent. */
const creditDeposit = async (userId, reference, gatewayResult) => {
  const Transaction = getModel('Transaction');
  const User = getModel('User');

  const txn = await Transaction.findOne({ reference });
  if (!txn) return { error: 'Unknown reference', code: 404 };
  if (String(txn.user) !== String(userId)) return { error: 'Not your transaction', code: 403 };
  if (txn.status === 'completed') {
    const user = await User.findById(userId);
    return { txn, balance: user.wallet.balance };
  }
  if (txn.status !== 'pending') return { error: `Deposit is ${txn.status}`, code: 400 };

  const balance = await adjustBalance(userId, Number(txn.amount));
  txn.status = 'completed';
  txn.balanceBefore = balance - Number(txn.amount);
  txn.balanceAfter = balance;
  await txn.save();

  const user = await User.findById(userId);
  // flip the existing mirror entry to completed instead of duplicating it
  let found = false;
  const mirrors = (user.transactions || []).map((t) => {
    if (t.reference === reference) { found = true; return { ...t, status: 'completed' }; }
    return t;
  });
  if (!found) {
    mirrors.unshift({
      reference: txn.reference,
      category: txn.category,
      amount: txn.amount,
      network: 0,
      type: 'credit',
      description: txn.description,
      mode: txn.mode,
      status: 'completed',
      date: txn.date instanceof Date ? txn.date.toISOString() : new Date().toISOString(),
      time: txn.time,
    });
  }
  user.transactions = mirrors.slice(0, 40);
  await user.save();
  await notify(userId, `Deposit of ₦${Number(txn.amount).toLocaleString()} was successful`, 'success');

  return { txn, balance };
};

const verifyDeposit = async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ error: 'Reference is required' });

    const Transaction = getModel('Transaction');
    const txn = await Transaction.findOne({ reference });
    if (!txn || String(txn.user) !== String(req.user._id)) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (txn.status === 'pending' && txn.metadata?.gateway === 'paystack') {
      const psTxn = await paystack.verifyTransaction(reference);
      if (psTxn.status !== 'success') {
        txn.status = 'failed';
        await txn.save();
        await notify(req.user._id, `Deposit ${reference} failed`, 'error');
        return res.status(400).json({ error: 'Payment was not successful', status: 'failed' });
      }
    }

    const result = await creditDeposit(req.user._id, reference);
    if (result.error) return res.status(result.code).json({ error: result.error });

    res.json({ status: 'completed', transaction: publicTransaction(result.txn), balance: result.balance });
  } catch (error) {
    console.error('verifyDeposit:', error);
    res.status(500).json({ error: error.message || 'Verification failed' });
  }
};

/** Public-facing deposit summary for the checkout page (owner only). */
const getDepositStatus = async (req, res) => {
  try {
    const Transaction = getModel('Transaction');
    const txn = await Transaction.findOne({ reference: req.query.reference, user: String(req.user._id) });
    if (!txn || txn.category !== 'deposit') return res.status(404).json({ error: 'Payment not found' });
    res.json({
      reference: txn.reference,
      amount: txn.amount,
      status: txn.status,
      description: txn.description,
      gateway: txn.metadata?.gateway || 'demo',
      merchant: 'SubHub247 Wallet',
      customer: { name: req.user.name, email: req.user.email },
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not load payment' });
  }
};

/** Paystack webhook — keeps deposits in sync when users close the tab. */
const paystackWebhook = (req, res) => {
  const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  const signature = req.headers['x-paystack-signature'];
  if (!paystack.verifyWebhookSignature(raw, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  const event = typeof req.body === 'string' ? JSON.parse(raw) : req.body;

  (async () => {
    if (event.event === 'charge.success' && event.data?.reference) {
      await creditDeposit(event.data.metadata?.userId, event.data.reference);
    }
  })().catch((e) => console.error('webhook:', e.message));

  res.sendStatus(200);
};

/* ------------------------------------------------------------- bank books */
const getBanks = async (req, res) => res.json({ banks: BANKS });

const getAccounts = async (req, res) => {
  try {
    const BankAccount = getModel('BankAccount');
    const accounts = await BankAccount.find({ user: String(req.user._id) }).sort({ date: -1 }).lean();
    res.json({
      accounts: accounts.map((a) => ({
        id: String(a._id),
        bankName: a.bankName,
        bankCode: a.bankCode,
        accountNumber: a.accountNumber,
        accountName: a.accountName,
        isDefault: a.isDefault,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not load saved accounts' });
  }
};

const addAccount = async (req, res) => {
  try {
    const { bankName, bankCode, accountNumber } = req.body;
    if (!bankName || !bankCode) return res.status(400).json({ error: 'Select a bank' });
    if (!/^\d{10}$/.test(String(accountNumber || ''))) {
      return res.status(400).json({ error: 'Account number must be 10 digits' });
    }

    const BankAccount = getModel('BankAccount');
    const existing = await BankAccount.findOne({
      user: String(req.user._id),
      accountNumber: String(accountNumber),
      bankCode: String(bankCode),
    });
    if (existing) return res.status(400).json({ error: 'Account already saved' });

    let accountName = req.user.name;
    let recipientCode = null;
    if (paystack.isPaystackEnabled()) {
      try {
        const recipient = await paystack.createTransferRecipient({
          name: req.user.name,
          accountNumber,
          bankCode,
        });
        recipientCode = recipient.recipient_code;
        accountName = recipient.details?.account_name || accountName;
      } catch (e) {
        return res.status(400).json({ error: 'Could not verify account: ' + e.message });
      }
    } else {
      accountName = `${req.user.name} (demo)`;
    }

    const count = await BankAccount.countDocuments({ user: String(req.user._id) });
    const account = await BankAccount.create({
      user: String(req.user._id),
      bankName,
      bankCode,
      accountNumber: String(accountNumber),
      accountName,
      recipientCode,
      isDefault: count === 0,
    });

    res.status(201).json({
      account: {
        id: String(account._id),
        bankName: account.bankName,
        bankCode: account.bankCode,
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        isDefault: account.isDefault,
      },
    });
  } catch (error) {
    console.error('addAccount:', error);
    res.status(500).json({ error: 'Could not save account' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const BankAccount = getModel('BankAccount');
    const result = await BankAccount.deleteOne({ _id: req.params.id, user: String(req.user._id) });
    if (!result.deletedCount) return res.status(404).json({ error: 'Account not found' });
    res.json({ message: 'Account removed' });
  } catch (error) {
    res.status(500).json({ error: 'Could not remove account' });
  }
};

/* ------------------------------------------------------------ withdrawals */
const withdraw = async (req, res) => {
  try {
    const { amount, accountId, bankName, bankCode, accountNumber, saveAccount } = req.body;
    const value = Number(amount);

    if (!value || Number.isNaN(value) || value < MIN_WITHDRAWAL) {
      return res.status(400).json({ error: `Minimum withdrawal is ₦${MIN_WITHDRAWAL.toLocaleString()}` });
    }
    if (value > req.user.wallet.balance) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    const BankAccount = getModel('BankAccount');
    let account = null;
    if (accountId) {
      account = await BankAccount.findOne({ _id: accountId, user: String(req.user._id) });
      if (!account) return res.status(404).json({ error: 'Saved account not found' });
    } else {
      if (!bankName || !bankCode || !/^\d{10}$/.test(String(accountNumber || ''))) {
        return res.status(400).json({ error: 'Provide a valid bank and 10-digit account number' });
      }
      account = { bankName, bankCode, accountNumber: String(accountNumber), accountName: req.user.name, recipientCode: null };
      if (saveAccount) {
        const dup = await BankAccount.findOne({ user: String(req.user._id), accountNumber: String(accountNumber), bankCode: String(bankCode) });
        if (!dup) {
          const created = await BankAccount.create({
            user: String(req.user._id),
            bankName,
            bankCode,
            accountNumber: String(accountNumber),
            accountName: paystack.isPaystackEnabled() ? req.user.name : `${req.user.name} (demo)`,
            isDefault: (await BankAccount.countDocuments({ user: String(req.user._id) })) === 0,
          });
          account = created;
        }
      }
    }

    const reference = genRef('WTH');
    const usePaystack = paystack.isPaystackEnabled();

    // atomic debit
    const balance = await adjustBalance(req.user._id, -value);
    if (balance === null) return res.status(400).json({ error: 'Insufficient wallet balance' });

    let status = 'completed';
    let transferNote = 'Settled instantly (demo mode)';
    if (usePaystack && account.recipientCode) {
      try {
        await paystack.initiateTransfer({
          recipientCode: account.recipientCode,
          amount: value,
          reference,
          reason: 'Wallet withdrawal',
        });
        status = 'pending';
        transferNote = 'Transfer submitted to bank — settle within minutes';
      } catch (e) {
        // refund on failure
        await adjustBalance(req.user._id, value);
        await recordTransaction({
          userId: req.user._id,
          reference: genRef('WTH'),
          category: 'withdrawal',
          type: 'debit',
          amount: value,
          status: 'failed',
          description: `Withdrawal to ${account.bankName} •${String(account.accountNumber).slice(-4)} failed`,
          mode: 'bank_transfer',
          balanceBefore: balance + value,
          balanceAfter: balance + value,
          metadata: { bank: account.bankName, accountNumber: account.accountNumber, reason: e.message },
        });
        return res.status(502).json({ error: `Transfer failed: ${e.message}` });
      }
    }

    const txn = await recordTransaction({
      userId: req.user._id,
      reference,
      category: 'withdrawal',
      type: 'debit',
      amount: value,
      status,
      description: `Withdrawal to ${account.bankName} •${String(account.accountNumber).slice(-4)}`,
      mode: 'bank_transfer',
      balanceBefore: balance + value,
      balanceAfter: balance,
      metadata: {
        bank: account.bankName,
        bankCode: account.bankCode,
        accountNumber: account.accountNumber,
        accountName: account.accountName,
      },
    });

    res.status(201).json({ transaction: publicTransaction(txn), balance, note: transferNote });
  } catch (error) {
    console.error('withdraw:', error);
    res.status(500).json({ error: error.message || 'Withdrawal failed' });
  }
};

module.exports = {
  getWallet,
  initDeposit,
  verifyDeposit,
  getDepositStatus,
  paystackWebhook,
  getBanks,
  getAccounts,
  addAccount,
  deleteAccount,
  withdraw,
};
