const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, maxlength: 80 },
  lastName: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true, maxlength: 24 },
}, { _id: false });

const flightBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  reference: { type: String, required: true, unique: true },
  tripType: { type: String, enum: ['one-way', 'round-trip'], required: true },
  origin: { type: String, required: true, uppercase: true, minlength: 3, maxlength: 3 },
  destination: { type: String, required: true, uppercase: true, minlength: 3, maxlength: 3 },
  departureDate: { type: Date, required: true },
  returnDate: Date,
  passengers: { type: [passengerSchema], required: true, validate: value => value.length >= 1 && value.length <= 6 },
  status: { type: String, enum: ['request_received', 'quoted', 'quote_accepted', 'cancelled'], default: 'request_received' },
  quotedAmount: { type: Number, min: 0 },
  quotedCurrency: { type: String, enum: ['NGN'], default: 'NGN' },
  note: { type: String, maxlength: 1000, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('FlightBooking', flightBookingSchema);
