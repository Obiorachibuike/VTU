const express = require('express');
const { login, signup,verifyEmail,fetchUserDetails } = require('../controllers/authController.js');
const { authenticateUser } = require('../middleware/authMiddleware.js');
const treansactions = require('../controllers/transactionControllers.js');

const router = express.Router();

// Define routes
router.post('/login', login);
router.post('/signup', signup);
router.get('/verify-email', verifyEmail); // Change this to GET for email verification
router.get('/user/details' ,fetchUserDetails); // Change this to GET for user details
router.get('/transaction/airtime',authenticateUser ,treansactions); // Change this to GET for user details

module.exports = router;
