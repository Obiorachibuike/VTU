// models/Transaction.js
const mongoose = require('mongoose');


// Transaction Schema
const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  network: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now }, // Date of the transaction
  time: { type: String, required: true, default: () => new Date().toLocaleTimeString() }, // Time of the transaction
  type: { type: String, enum: ['credit', 'debit'], required: true },
  description: { type: String },
  mode: { type: String, enum: ['cash', 'credit_card', 'bank_transfer', 'crypto','debit'], required: true }, // Mode of transaction
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true, default: 'pending' } // Transaction status
});

module.exports = mongoose.model('Transaction', transactionSchema);
