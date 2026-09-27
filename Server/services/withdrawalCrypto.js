const crypto = require('crypto');
function key() {
  const source = process.env.WITHDRAWAL_ENCRYPTION_KEY || process.env.SESSION_SECRET || process.env.JWT_SECRET;
  if (!source) throw new Error('Withdrawal encryption is not configured.');
  return crypto.createHash('sha256').update(source).digest();
}
function encrypt(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const ciphertext = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  return `${iv.toString('base64')}.${cipher.getAuthTag().toString('base64')}.${ciphertext.toString('base64')}`;
}
function decrypt(value) {
  const [iv, tag, ciphertext] = String(value || '').split('.').map(part => Buffer.from(part, 'base64'));
  if (!iv || !tag || !ciphertext) throw new Error('Encrypted withdrawal account data is invalid.');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}
module.exports = { encrypt, decrypt };
