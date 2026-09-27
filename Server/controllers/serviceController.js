const crypto = require('crypto');
const User = require('../models/UserSchema');
const { fulfill } = require('../services/vtuProvider');

const catalog = {
  data: [
    { code: 'mtn_1gb', network: 'MTN', label: '1 GB data', price: 500 },
    { code: 'mtn_2gb', network: 'MTN', label: '2 GB data', price: 1000 },
    { code: 'airtel_1gb', network: 'Airtel', label: '1 GB data', price: 500 },
    { code: 'glo_1gb', network: 'Glo', label: '1 GB data', price: 500 },
    { code: '9mobile_1gb', network: '9mobile', label: '1 GB data', price: 500 },
  ],
  tv: [
    { code: 'dstv_padi', network: 'DStv', label: 'Padi', price: 4400 },
    { code: 'dstv_yanga', network: 'DStv', label: 'Yanga', price: 6000 },
    { code: 'gotv_smallie', network: 'GOtv', label: 'Smallie', price: 1900 },
    { code: 'gotv_jolli', network: 'GOtv', label: 'Jolli', price: 4900 },
    { code: 'startimes_nova', network: 'StarTimes', label: 'Nova', price: 1900 },
    { code: 'startimes_basic', network: 'StarTimes', label: 'Basic', price: 3800 },
  ],
};
const networks = ['MTN', 'Airtel', 'Glo', '9mobile'];
const e164ish = value => /^0\d{10}$/.test(String(value || ''));

function getCatalog(req, res) {
  res.json({
    mode: process.env.NODE_ENV !== 'production' && process.env.SERVICE_MODE === 'demo' ? 'demo' : 'provider',
    airtimeNetworks: networks,
    data: catalog.data,
    tv: catalog.tv,
    electricityProviders: ['AEDC', 'BEDC', 'EKEDC', 'EEDC', 'IBEDC', 'IKEDC', 'KAEDCO', 'KEDCO', 'PHED'],
  });
}

async function refundPendingDebit(userId, reference, errorMessage) {
  const user = await User.findOne({ _id: userId, transactions: { $elemMatch: { reference, category: 'service', status: 'pending' } } }).select('transactions');
  if (!user) return false;
  const tx = user.transactions.find(item => item.reference === reference);
  const result = await User.updateOne(
    { _id: userId, transactions: { $elemMatch: { reference, category: 'service', status: 'pending' } } },
    {
      $inc: { 'wallet.balance': tx.amount },
      $set: { 'transactions.$.status': 'refunded', 'transactions.$.description': errorMessage },
    },
  );
  return result.modifiedCount === 1;
}

async function purchase(req, res) {
  const service = String(req.body.service || '');
  const network = String(req.body.network || '');
  const recipient = String(req.body.recipient || '').trim();
  let amount = Number(req.body.amount);
  let productCode = String(req.body.productCode || '');
  let description;

  if (service === 'airtime') {
    if (!networks.includes(network) || !e164ish(recipient) || !Number.isInteger(amount) || amount < 50 || amount > 50000) {
      return res.status(400).json({ error: 'Enter a supported network, valid 11-digit Nigerian mobile number, and airtime amount from ₦50 to ₦50,000.' });
    }
    description = `${network} airtime for ${recipient}`;
  } else if (service === 'data' || service === 'tv') {
    const item = catalog[service].find(plan => plan.code === productCode);
    if (!item || !recipient || recipient.length > 32 || (service === 'data' && !e164ish(recipient))) {
      return res.status(400).json({ error: 'Choose a valid plan and provide the correct recipient number or decoder ID.' });
    }
    if (service === 'tv' && !/^\d{6,20}$/.test(recipient)) return res.status(400).json({ error: 'Enter a valid 6–20 digit decoder number.' });
    amount = item.price;
    productCode = item.code;
    description = `${item.network} ${item.label} for ${recipient}`;
  } else if (service === 'electricity') {
    const meterType = String(req.body.meterType || '');
    if (!['AEDC', 'BEDC', 'EKEDC', 'EEDC', 'IBEDC', 'IKEDC', 'KAEDCO', 'KEDCO', 'PHED'].includes(network) || !['prepaid', 'postpaid'].includes(meterType) || !/^\d{6,20}$/.test(recipient) || !Number.isInteger(amount) || amount < 500 || amount > 100000) {
      return res.status(400).json({ error: 'Enter a supported electricity provider, prepaid/postpaid meter type, 6–20 digit meter number, and amount from ₦500 to ₦100,000.' });
    }
    description = `${network} ${meterType} electricity bill for meter ${recipient}`;
  } else {
    return res.status(400).json({ error: 'Unsupported service.' });
  }

  const reference = `svc_${crypto.randomUUID().replace(/-/g, '')}`;
  let debit;
  try {
    debit = await User.updateOne(
      { _id: req.user._id, 'wallet.balance': { $gte: amount }, 'transactions.reference': { $ne: reference } },
      {
        $inc: { 'wallet.balance': -amount },
        $push: { transactions: { amount, type: 'debit', mode: 'debit', status: 'pending', category: 'service', reference, description, network, metadata: { service, productCode, recipient, meterType: req.body.meterType } } },
      },
    );
  } catch (error) {
    return res.status(503).json({ error: 'Could not safely reserve your wallet balance. No provider order was sent.' });
  }
  if (!debit.modifiedCount) return res.status(400).json({ error: 'Insufficient wallet balance.' });

  let fulfillment;
  try {
    fulfillment = await fulfill({ reference, service, amount, recipient, productCode, network, meterType: req.body.meterType });
  } catch (error) {
    if (error.ambiguous) return res.status(202).json({ reference, status: 'pending', message: error.message });
    const refunded = await refundPendingDebit(req.user._id, reference, 'Service failed; wallet refunded');
    if (!refunded) return res.status(202).json({ reference, status: 'pending', message: 'The provider rejected this order, but the refund is still syncing. Contact support and do not retry this purchase.' });
    return res.status(error.providerFailed ? 502 : 503).json({ error: error.message, refunded: true });
  }

  // Once the provider confirms delivery, never reverse the debit because a later
  // database/read response failed. Keep it pending and reconcile instead.
  try {
    const update = await User.updateOne(
      { _id: req.user._id, transactions: { $elemMatch: { reference, category: 'service', status: 'pending' } } },
      { $set: { 'transactions.$.status': 'completed', 'transactions.$.description': description } },
    );
    if (update.modifiedCount !== 1) return res.status(202).json({ reference, status: 'pending', message: 'The provider completed this order, but the wallet ledger needs reconciliation. Do not retry this purchase.' });
    const user = await User.findById(req.user._id).select('wallet transactions');
    return res.status(201).json({ reference, status: 'completed', simulated: fulfillment.simulated, message: fulfillment.simulated ? 'Demo order completed. No real airtime, data, TV or electricity service was delivered.' : 'Order completed.', wallet: user.wallet, transactions: user.transactions.slice(-10).reverse() });
  } catch (error) {
    console.error('Provider completed an order but wallet ledger confirmation needs reconciliation:', reference, error.message);
    return res.status(202).json({ reference, status: 'pending', message: 'The provider completed this order; confirmation is still syncing. Do not retry this purchase. Support will reconcile it.' });
  }
}

async function listPending(req, res) {
  const users = await User.find({ 'transactions.category': 'service', 'transactions.status': 'pending' }).select('name email transactions');
  const orders = users.flatMap(user => user.transactions
    .filter(tx => tx.category === 'service' && tx.status === 'pending')
    .map(tx => ({ reference: tx.reference, userId: user._id, name: user.name, email: user.email, amount: tx.amount, description: tx.description, metadata: tx.metadata, date: tx.date })));
  res.json({ orders });
}

async function resolvePending(req, res) {
  const { decision } = req.body;
  const reference = String(req.params.reference);
  if (!['complete', 'refund'].includes(decision)) return res.status(400).json({ error: 'Decision must be complete or refund.' });
  const filter = { _id: req.params.userId, transactions: { $elemMatch: { reference, category: 'service', status: 'pending' } } };
  const update = { $set: { 'transactions.$.status': decision === 'complete' ? 'completed' : 'refunded', 'transactions.$.description': decision === 'complete' ? 'Provider order manually confirmed' : 'Provider order failed; wallet refunded' } };
  if (decision === 'refund') {
    const user = await User.findOne(filter).select('transactions');
    if (!user) return res.status(404).json({ error: 'Pending order not found.' });
    const tx = user.transactions.find(item => item.reference === reference);
    update.$inc = { 'wallet.balance': tx.amount };
  }
  const result = await User.updateOne(filter, update);
  if (!result.modifiedCount) return res.status(404).json({ error: 'Pending order not found.' });
  res.json({ message: decision === 'complete' ? 'Order marked completed.' : 'Wallet refunded.' });
}

module.exports = { getCatalog, purchase, listPending, resolvePending };
