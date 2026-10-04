/**
 * Paystack integration (deposits + withdrawals).
 *
 * Set PAYSTACK_SECRET_KEY in .env to switch from the built-in demo gateway to
 * real Paystack payments. Without a key the app runs in demo mode: deposits
 * are handled by the local checkout page and withdrawals settle instantly.
 */
const crypto = require('crypto');
const axios = require('axios');

const PAYSTACK_BASE = 'https://api.paystack.co';

const isPaystackEnabled = () => Boolean(process.env.PAYSTACK_SECRET_KEY);

const client = () =>
  axios.create({
    baseURL: PAYSTACK_BASE,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 20000,
  });

/** Create a hosted checkout session. Returns { authorization_url, reference } */
const initializeTransaction = async ({ email, amount, reference, callbackUrl, metadata }) => {
  const { data } = await client().post('/transaction/initialize', {
    email,
    amount: Math.round(amount * 100), // kobo
    reference,
    callback_url: callbackUrl,
    currency: 'NGN',
    metadata,
  });
  if (!data.status) throw new Error(data.message || 'Paystack init failed');
  return data.data;
};

/** Verify a payment. Returns Paystack transaction data. */
const verifyTransaction = async (reference) => {
  const { data } = await client().get(`/transaction/verify/${encodeURIComponent(reference)}`);
  if (!data.status) throw new Error(data.message || 'Paystack verify failed');
  return data.data;
};

/** Resolve a bank account + create a transfer recipient. */
const createTransferRecipient = async ({ name, accountNumber, bankCode }) => {
  const { data } = await client().post('/transferrecipient', {
    type: 'nuban',
    name,
    account_number: accountNumber,
    bank_code: bankCode,
    currency: 'NGN',
  });
  if (!data.status) throw new Error(data.message || 'Recipient creation failed');
  return data.data; // { recipient_code, details: { account_name } }
};

/** Send money to a bank account. */
const initiateTransfer = async ({ recipientCode, amount, reference, reason }) => {
  const { data } = await client().post('/transfer', {
    source: 'balance',
    amount: Math.round(amount * 100),
    recipient: recipientCode,
    reference,
    reason: reason || 'Wallet withdrawal',
    currency: 'NGN',
  });
  if (!data.status) throw new Error(data.message || 'Transfer failed');
  return data.data;
};

/** Validate the x-paystack-signature header of a webhook call. */
const verifyWebhookSignature = (rawBody, signature) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;
  const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  return hash === signature;
};

module.exports = {
  isPaystackEnabled,
  initializeTransaction,
  verifyTransaction,
  createTransferRecipient,
  initiateTransfer,
  verifyWebhookSignature,
};
