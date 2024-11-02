// models/Notification.js
const mongoose = require('mongoose');

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  message: { type: String, required: true }, // Notification message
  type: { type: String, enum: ['info', 'warning', 'error'], required: true }, // Type of notification
  isRead: { type: Boolean, default: false }, // Whether the notification has been read
  date: { type: Date, required: true, default: Date.now }, // Date of notification
  time: { type: String, required: true, default: () => new Date().toLocaleTimeString() } // Time of notification
});

module.exports = mongoose.model('Notification', notificationSchema);
