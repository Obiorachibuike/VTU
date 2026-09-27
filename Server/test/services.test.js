const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { fulfill } = require('../services/vtuProvider');
const { encrypt, decrypt } = require('../services/withdrawalCrypto');
const { verifyWebhookSignature } = require('../services/paymentService');

test('demo VTU mode is visibly simulated', async () => {
  const oldMode = process.env.SERVICE_MODE;
  const oldNode = process.env.NODE_ENV;
  const oldUrl = process.env.VTU_API_URL;
  const oldKey = process.env.VTU_API_KEY;
  process.env.NODE_ENV = 'development'; process.env.SERVICE_MODE = 'demo';
  delete process.env.VTU_API_URL; delete process.env.VTU_API_KEY;
  try { assert.deepEqual(await fulfill({ reference: 'test-ref', service: 'airtime', amount: 500 }), { simulated: true }); }
  finally {
    if (oldMode === undefined) delete process.env.SERVICE_MODE; else process.env.SERVICE_MODE = oldMode;
    if (oldNode === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = oldNode;
    if (oldUrl === undefined) delete process.env.VTU_API_URL; else process.env.VTU_API_URL = oldUrl;
    if (oldKey === undefined) delete process.env.VTU_API_KEY; else process.env.VTU_API_KEY = oldKey;
  }
});

test('bank-account payload encryption round trips and is randomized', () => {
  process.env.SESSION_SECRET = 'test-only-secret';
  const payload = JSON.stringify({ accountNumber: '0123456789', accountName: 'Test User' });
  const encrypted = encrypt(payload);
  assert.notEqual(encrypted, encrypt(payload));
  assert.equal(decrypt(encrypted), payload);
});

test('Paystack webhook signature validation uses HMAC-SHA512', () => {
  process.env.PAYSTACK_SECRET_KEY = 'test-secret';
  const body = Buffer.from('{"event":"charge.success"}');
  const signature = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(body).digest('hex');
  assert.equal(verifyWebhookSignature(body, signature), true);
  assert.equal(verifyWebhookSignature(body, '00'.repeat(64)), false);
  delete process.env.PAYSTACK_SECRET_KEY;
});
