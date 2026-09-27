const express = require('express');
const { login, signup, verifyEmail, fetchUserDetails, logout } = require('../controllers/authController.js');
const router = express.Router();
router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get('/verify-email', verifyEmail);
router.get('/user/details', fetchUserDetails);
module.exports = router;
