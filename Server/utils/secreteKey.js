const crypto = require('crypto');

// Generate a random 256-bit key (32 bytes)
const secret = crypto.randomBytes(32).toString('hex');
console.log(`Generated secret key: ${secret}`);
