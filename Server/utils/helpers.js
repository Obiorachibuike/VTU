/**
 * Shared server helpers: reference codes, atomic wallet operations,
 * transaction recording and notifications.
 */
const crypto = require('crypto');
const { getModel } = require('../models');

const genRef = (prefix = 'TXN') =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

/** NG phone validation: 11 digits starting with 0, or +234… */
const isValidPhone = (phone) => /^(0|\+?234)?[789][01]\d{8}$/.test(String(phone || '').replace(/[\s-]/g, ''));

const normalisePhone = (phone) => {
  const p = String(phone || '').replace(/[\s-]/g, '');
  if (p.startsWith('+234')) return `0${p.slice(4)}`;
  if (p.startsWith('234') && p.length === 13) return `0${p.slice(3)}`;
  return p;
};

/**
 * Atomically move money in a wallet.
 * Debits only succeed when the balance is sufficient (guard in the filter).
 * Returns the new balance or null when the guard failed (insufficient funds).
 */
const adjustBalance = async (userId, delta) => {
  const User = getModel('User');
  if (delta < 0) {
    const result = await User.updateOne(
      { _id: userId, 'wallet.balance': { $gte: Math.abs(delta) } },
      { $inc: { 'wallet.balance': delta } }
    );
    if (!result.modifiedCount) return null;
  } else {
    await User.updateOne({ _id: userId }, { $inc: { 'wallet.balance': delta } });
  }
  const fresh = await User.findById(userId);
  return fresh.wallet.balance;
};

/** Record an in-app notification on the user document (newest first, capped). */
const notify = async (userId, message, type = 'info') => {
  const User = getModel('User');
  const user = await User.findById(userId);
  if (!user) return;
  const entry = {
    message,
    type, // info | warning | error | success
    isRead: false,
    date: new Date(),
    time: new Date().toLocaleTimeString('en-NG', { hour12: false }),
  };
  user.notifications = [entry, ...(user.notifications || [])].slice(0, 50);
  await user.save();
};

/**
 * Create the standalone ledger entry, mirror a copy on the user document
 * (legacy shape the existing UI reads) and raise a notification.
 */
const recordTransaction = async ({
  userId,
  reference,
  category,
  type,
  amount,
  status = 'pending',
  description = '',
  mode = 'wallet',
  balanceBefore = 0,
  balanceAfter = 0,
  metadata = {},
  silentNotify = false,
}) => {
  const Transaction = getModel('Transaction');
  const User = getModel('User');

  const txn = await Transaction.create({
    user: String(userId),
    reference,
    category,
    type,
    amount,
    status,
    description,
    mode,
    balanceBefore,
    balanceAfter,
    metadata,
  });

  // legacy embedded mirror (old client components read user.transactions)
  const user = await User.findById(userId);
  if (user) {
    user.transactions = [
      {
        reference,
        category,
        amount,
        network: 0,
        type,
        description,
        mode,
        status,
        date: txn.date instanceof Date ? txn.date.toISOString() : new Date().toISOString(),
        time: txn.time,
      },
      ...(user.transactions || []),
    ].slice(0, 40);
    await user.save();

    if (!silentNotify) {
      const icon = type === 'credit' ? 'Wallet credited' : 'Wallet debited';
      await notify(userId, `${icon}: ${description} (₦${Number(amount).toLocaleString()}) — ${status}`, status === 'failed' ? 'error' : 'success');
    }
  }

  return txn;
};

const publicTransaction = (txn) => ({
  _id: String(txn._id),
  reference: txn.reference,
  category: txn.category,
  type: txn.type,
  amount: txn.amount,
  fee: txn.fee,
  status: txn.status,
  description: txn.description,
  mode: txn.mode,
  balanceBefore: txn.balanceBefore,
  balanceAfter: txn.balanceAfter,
  metadata: txn.metadata || {},
  date: txn.date instanceof Date ? txn.date.toISOString() : txn.date,
  time: txn.time,
});

module.exports = { genRef, isValidPhone, normalisePhone, adjustBalance, notify, recordTransaction, publicTransaction };
