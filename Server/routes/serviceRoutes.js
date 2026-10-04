const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware.js');
const services = require('../controllers/serviceController.js');

const router = express.Router();

// catalogue (public)
router.get('/catalog', services.getCatalog);
router.get('/airports', services.getAirports);
router.get('/flights/search', services.searchFlights);

// purchases (authenticated)
router.post('/airtime', authenticateUser, services.buyAirtime);
router.post('/data', authenticateUser, services.buyData);
router.post('/tv', authenticateUser, services.buyTv);
router.post('/electricity', authenticateUser, services.buyElectricity);
router.post('/flights/book', authenticateUser, services.bookFlight);
router.get('/flights/bookings', authenticateUser, services.myBookings);

// transactions & notifications (authenticated)
router.get('/transactions', authenticateUser, services.listTransactions);
router.get('/transactions/:reference', authenticateUser, services.getTransaction);
router.get('/notifications', authenticateUser, services.getNotifications);
router.post('/notifications/read-all', authenticateUser, services.markNotificationsRead);

module.exports = router;
