const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 }, // whole/decimal NGN, kept for compatibility with existing wallets
  network: { type: mongoose.Schema.Types.Mixed, default: null },
  date: { type: Date, default: Date.now },
  time: { type: String, default: () => new Date().toLocaleTimeString() },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  description: { type: String, default: '' },
  mode: { type: String, enum: ['cash', 'credit_card', 'bank_transfer', 'crypto', 'debit'], default: 'debit' },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  reference: { type: String, default: undefined },
  category: { type: String, default: 'service' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: undefined },
}, { _id: true });

module.exports = mongoose.model('Transaction', transactionSchema);
module.exports.schema = transactionSchema;
