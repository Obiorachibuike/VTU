require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/UserSchema');

async function main() {
  const [email, password, name = 'SubHub Administrator'] = process.argv.slice(2);
  if (!email || !password || password.length < 12) {
    throw new Error('Usage: node scripts/createAdmin.js <email> <password-12-chars-min> [name]');
  }
  await mongoose.connect(process.env.MONGO_URI);
  let user = await User.findOne({ email: email.toLowerCase() });
  if (!user) user = new User({ email: email.toLowerCase(), name, password, isVerified: true });
  else user.password = password;
  user.role = 'admin';
  user.isVerified = true;
  await user.save();
  console.log(`Administrator account ready for ${user.email}`);
  await mongoose.disconnect();
}
main().catch(error => { console.error(error.message); process.exit(1); });
