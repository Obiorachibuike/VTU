const crypto = require('crypto');
const PaymentIntent = require('../models/PaymentIntent');
const User = require('../models/UserSchema');

const demoPayments = () => process.env.NODE_ENV !== 'production' && process.env.PAYMENT_MODE === 'demo';

async function initializePaystack(intent, email) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error('Card deposits are not configured. Set PAYSTACK_SECRET_KEY.');
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      amount: intent.amountKobo,
      currency: 'NGN',
      reference: intent.reference,
      callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/wallet?payment=return`,
      metadata: { userId: String(intent.user), purpose: 'wallet_funding' },
    }),
  });
  const result = await response.json();
  if (!response.ok || !result.status || !result.data?.authorization_url) {
    throw new Error(result.message || 'Could not start the card payment.');
  }
  intent.authorizationUrl = result.data.authorization_url;
  await intent.save();
  return intent.authorizationUrl;
}

async function verifyPaystack(reference) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error('Card deposits are not configured.');
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const result = await response.json();
  if (!response.ok || !result.status || result.data?.status !== 'success' || result.data?.reference !== reference) {
    throw new Error('Payment has not been confirmed by the payment provider.');
  }
  return result.data;
}

async function creditWalletOnce(intent, providerPayment) {
  if (providerPayment.amount !== intent.amountKobo || providerPayment.currency !== 'NGN') {
    throw new Error('Payment amount or currency does not match the pending deposit.');
  }

  // One atomic user-document update provides both idempotency and a consistent wallet ledger.
  // If a webhook is delivered more than once, only the first update credits the wallet.
  const result = await User.updateOne(
    { _id: intent.user, 'transactions.reference': { $ne: intent.reference } },
    {
      $inc: { 'wallet.balance': intent.amountKobo / 100 },
      $push: { transactions: {
        amount: intent.amountKobo / 100,
        type: 'credit', mode: 'credit_card', status: 'completed',
        description: 'Wallet deposit', category: 'wallet_deposit', reference: intent.reference,
      } },
    },
  );

  if (result.modifiedCount !== 1) {
    const alreadyCredited = await User.exists({ _id: intent.user, 'transactions.reference': intent.reference });
    if (!alreadyCredited) throw new Error('The wallet deposit could not be credited.');
  }

  intent.status = 'completed';
  intent.completedAt = intent.completedAt || new Date();
  await intent.save();
  return { credited: result.modifiedCount === 1 };
}

async function confirmDeposit(reference, demoConfirmed = false) {
  const intent = await PaymentIntent.findOne({ reference });
  if (!intent) throw new Error('Deposit reference was not found.');
  if (intent.status === 'completed') return { status: 'completed', amount: intent.amountKobo / 100 };

  let payment;
  if (intent.provider === 'demo') {
    if (!demoPayments() || !demoConfirmed) throw new Error('Demo confirmation is only available in local demo mode.');
    payment = { amount: intent.amountKobo, currency: 'NGN' };
  } else {
    payment = await verifyPaystack(reference);
  }
  await creditWalletOnce(intent, payment);
  return { status: 'completed', amount: intent.amountKobo / 100 };
}

function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature || !rawBody) return false;
  const expected = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  const supplied = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  return supplied.length === expectedBuffer.length && crypto.timingSafeEqual(supplied, expectedBuffer);
}

module.exports = { demoPayments, initializePaystack, confirmDeposit, verifyWebhookSignature };
