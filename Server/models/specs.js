/**
 * Model specs shared by both persistence backends.
 *
 * - On Mongoose: fields are compiled into real schemas (indexes + validation).
 * - On the file store: fields provide defaults, methods and pre-save hooks.
 *
 * This keeps controllers written once against a single API.
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const nowISO = () => new Date();
const timeNow = () => new Date().toLocaleTimeString('en-NG', { hour12: false });

/* ------------------------------------------------------------------ User */
const userSpec = {
  name: 'User',
  fields: {
    name: { type: String, trim: true },
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: { type: String },
    phone: { type: String, default: '' },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    date: { type: Date, default: nowISO },
    time: { type: String, default: timeNow },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    jwtToken: { type: String, default: null },
    wallet: {
      type: 'Object',
      default: () => ({ balance: 0, currency: 'NGN' }),
    },
    referralCode: { type: String, unique: true },
    referralCount: { type: Number, default: 0 },
    transactions: { type: 'Array', default: () => [] }, // legacy embedded copies (capped)
    notifications: { type: 'Array', default: () => [] }, // embedded notifications
  },
  preSave: async function () {
    // Hash plain-text passwords only (bcrypt hashes always start with "$2").
    if (this.password && !String(this.password).startsWith('$2')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    if (!this.referralCode) {
      this.referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    }
  },
  methods: {
    async comparePassword(password) {
      return bcrypt.compare(String(password || ''), String(this.password || ''));
    },
    generateToken() {
      const token = jwt.sign({ id: String(this._id) }, process.env.JWT_SECRET, { expiresIn: '30d' });
      this.jwtToken = token;
      return token;
    },
    generateVerificationToken() {
      const token = crypto.randomBytes(32).toString('hex');
      this.verificationToken = token;
      return token;
    },
  },
};

/* ----------------------------------------------------------- Transaction */
const transactionSpec = {
  name: 'Transaction',
  fields: {
    user: { type: String }, // owner id (string id works on both backends)
    reference: { type: String, unique: true },
    category: {
      type: String,
      enum: ['deposit', 'withdrawal', 'airtime', 'data', 'tv', 'electricity', 'flight', 'referral', 'refund', 'transfer'],
      default: 'transfer',
    },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    description: { type: String, default: '' },
    mode: { type: String, default: 'wallet' }, // wallet | card | bank_transfer
    balanceBefore: { type: Number, default: 0 },
    balanceAfter: { type: Number, default: 0 },
    metadata: { type: 'Object', default: () => ({}) },
    date: { type: Date, default: nowISO },
    time: { type: String, default: timeNow },
  },
  methods: {},
  statics: {},
};

/* ----------------------------------------------------------- BankAccount */
const bankAccountSpec = {
  name: 'BankAccount',
  fields: {
    user: { type: String },
    bankName: { type: String },
    bankCode: { type: String },
    accountNumber: { type: String },
    accountName: { type: String },
    recipientCode: { type: String, default: null }, // paystack transfer recipient
    isDefault: { type: Boolean, default: false },
    date: { type: Date, default: nowISO },
    time: { type: String, default: timeNow },
  },
  methods: {},
  statics: {},
};

/* ------------------------------------------------------------------- Car */
const carSpec = {
  name: 'Car',
  fields: {
    name: { type: String },
    model: { type: String },
    year: { type: Number },
    manufacturer: { type: String },
    price: { type: Number, default: 0 },
  },
  methods: {},
  statics: {},
};

module.exports = { userSpec, transactionSpec, bankAccountSpec, carSpec };
