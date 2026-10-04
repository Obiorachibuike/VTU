const express = require('express');
const { login, signup, verifyEmail, fetchUserDetails } = require('../controllers/authController.js');
const { authenticateUser } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.get('/user/details', authenticateUser, fetchUserDetails);

module.exports = router;
