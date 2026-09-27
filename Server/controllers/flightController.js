const crypto = require('crypto');
const FlightBooking = require('../models/FlightBooking');

async function createBookingRequest(req, res) {
  const { tripType, origin, destination, departureDate, returnDate, passengers } = req.body;
  const from = String(origin || '').trim().toUpperCase();
  const to = String(destination || '').trim().toUpperCase();
  const depart = new Date(departureDate);
  const back = returnDate ? new Date(returnDate) : null;
  if (!['one-way', 'round-trip'].includes(tripType) || !/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to) || from === to || Number.isNaN(depart.getTime()) || depart <= new Date() || (tripType === 'round-trip' && (!back || back <= depart))) {
    return res.status(400).json({ error: 'Enter valid airport codes and future travel dates. Return date must be after departure.' });
  }
  if (!Array.isArray(passengers) || passengers.length < 1 || passengers.length > 6) return res.status(400).json({ error: 'Add between 1 and 6 passengers.' });
  const cleaned = passengers.map(passenger => ({
    firstName: String(passenger.firstName || '').trim(),
    lastName: String(passenger.lastName || '').trim(),
    email: String(passenger.email || '').trim().toLowerCase(),
    phone: String(passenger.phone || '').trim(),
  }));
  if (cleaned.some(p => p.firstName.length < 2 || p.lastName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email) || p.phone.length < 7)) {
    return res.status(400).json({ error: 'Please enter each passenger’s full name, valid email, and phone number.' });
  }

  const booking = await FlightBooking.create({
    user: req.user._id,
    reference: `flt_${crypto.randomUUID().replace(/-/g, '')}`,
    tripType, origin: from, destination: to, departureDate: depart, returnDate: back || undefined, passengers: cleaned,
  });
  res.status(201).json({ booking, notice: 'This is a booking request, not a ticket. An agent must confirm availability, fare, and ticket issuance.' });
}

async function listBookingRequests(req, res) {
  const bookings = await FlightBooking.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50).select('-passengers.email -passengers.phone');
  res.json({ bookings });
}

async function listAdminBookingRequests(req, res) {
  const bookings = await FlightBooking.find({ status: { $in: ['request_received', 'quoted', 'quote_accepted'] } }).sort({ createdAt: 1 }).limit(200).populate('user', 'name email');
  res.json({ bookings });
}

async function updateBookingRequest(req, res) {
  const { decision, quotedAmount, note } = req.body;
  const booking = await FlightBooking.findOne({ reference: req.params.reference });
  if (!booking) return res.status(404).json({ error: 'Flight request not found.' });
  if (decision === 'quote') {
    const price = Number(quotedAmount);
    if (!Number.isInteger(price) || price < 1 || price > 100000000) return res.status(400).json({ error: 'Enter a valid quoted fare in NGN.' });
    booking.quotedAmount = price;
    booking.status = 'quoted';
  } else if (decision === 'cancel') {
    booking.status = 'cancelled';
  } else {
    return res.status(400).json({ error: 'Decision must be quote or cancel.' });
  }
  booking.note = String(note || '').slice(0, 1000);
  await booking.save();
  res.json({ booking, warning: 'A fare quote or accepted quote is not an airline ticket. Complete ticket issuance with the airline or travel provider.' });
}

async function acceptQuote(req, res) {
  const booking = await FlightBooking.findOneAndUpdate(
    { reference: req.params.reference, user: req.user._id, status: 'quoted' },
    { $set: { status: 'quote_accepted' } },
    { new: true },
  );
  if (!booking) return res.status(404).json({ error: 'No open fare quote was found.' });
  res.json({ booking, warning: 'Quote accepted. This is not an airline ticket; a travel agent must complete and deliver ticket issuance.' });
}

module.exports = { createBookingRequest, listBookingRequests, listAdminBookingRequests, updateBookingRequest, acceptQuote };
