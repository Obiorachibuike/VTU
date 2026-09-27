const mongoose = require('mongoose');

const paymentIntentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  reference: { type: String, required: true, unique: true, index: true },
  amountKobo: { type: Number, required: true, min: 10000 },
  currency: { type: String, enum: ['NGN'], default: 'NGN' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending', index: true },
  provider: { type: String, enum: ['paystack', 'demo'], required: true },
  authorizationUrl: String,
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 14 },
  completedAt: Date,
});

module.exports = mongoose.model('PaymentIntent', paymentIntentSchema);
