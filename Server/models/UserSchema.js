const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Transaction = require('./Transaction'); // Import the Transaction schema
const Notification = require('./Notification'); // Import the Notification schema

// Function to generate a unique referral code
const generateReferralCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase(); // Generate an 8-character hex string
};

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  date: { type: Date, required: true, default: Date.now },
  time: { type: String, required: true, default: () => new Date().toLocaleTimeString() },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, unique: true },
  jwtToken: { type: String },
  wallet: {
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'NGN' }
  },
  referralCode: { type: String, unique: true }, // Referral code for each user
  referralCount: { type: Number, default: 0 }, // Track number of referrals
  transactions: [Transaction.schema], // Array of transactions
  notifications: [Notification.schema] // Array of notifications
});

// Password Hashing
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  // Generate a referral code only if it's a new user
  if (this.isNew) {
    this.referralCode = generateReferralCode();
  }

  next();
});

// Compare Password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate Token
userSchema.methods.generateToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  this.jwtToken = token;
  return token;
};

// Generate Verification Token
userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = token;
  return token;
};

// Add referral reward
userSchema.methods.addReferralReward = async function () {
  this.wallet.balance += 50; // Add 50 to the wallet balance
  this.referralCount += 1; // Increment referral count

  // Create a new transaction record
  const transaction = new Transaction({
    amount: 50,
    network: 0, // Replace with appropriate network ID or value if needed
    type: 'credit',
    description: 'Referral reward',
    mode: 'cash', // Replace with appropriate mode if needed
    status: 'completed' // Set status to completed for the reward transaction
  });

  this.transactions.push(transaction);
  await transaction.save(); // Save transaction to database

  await this.save(); // Save user updates
};

module.exports = mongoose.model('User', userSchema);
