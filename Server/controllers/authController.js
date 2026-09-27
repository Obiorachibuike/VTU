
const { body, validationResult } = require('express-validator');
const User = require('../models/UserSchema.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendMail = require('../utils/nodeMailer.js');





// User Signup
const signup = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 12 }).withMessage('Password must be at least 12 characters long'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, password } = req.body; // Public signup never grants privileged roles.
    const referralCode = req.query.referral; // Get referral code from query parameters
    
    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      
      // Create and save new user
      const user = new User({ name, email, password, role: 'user' });
      const verificationToken = user.generateVerificationToken(); // Generate and get the token
      await user.save();

      // Handle referral
      if (referralCode) {
        const referrer = await User.findOne({ referralCode: referralCode });
        if (referrer) {
          await referrer.addReferralReward(); // Add referral reward
        }
      }

      // Send verification email
      await sendMail(email, verificationToken);

      res.status(201).json({ message: 'User created successfully. Please verify your email.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];










const login = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ email });

      // Check if user exists and if the password matches
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'No User found' });
      }

      // Check if the email is verified
      if (!user.isVerified) {
        return res.status(401).json({ error: 'Email not verified' });
      }

      // Generate JWT token
      const token = user.generateToken();

      // Save the new token in the user's record
      user.jwtToken = token;
      await user.save(); // Save the user with the new token

      // Clear existing cookie if it exists
      res.clearCookie('authToken');

      // Set new token as HttpOnly cookie with the new name
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
      });

      // Keep the JWT in an HTTP-only cookie; never return it to browser JavaScript.
      res.json({ message: 'Signed in successfully.' });

    } catch (error) {
      console.error('Error during login:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];









// Verify Email
const verifyEmail = async (req, res) => {
  const { token } = req.query;
  

  try {
    if (typeof token === 'string') {
      // Find user with the provided verification token
      const user = await User.findOne({ verificationToken: token });
      

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired verification token' });
      }

      // Mark user as verified
      user.isVerified = true;
      user.verificationToken = null;
      await user.save();

      res.status(200).json({ message: 'Email verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid token format' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





const fetchUserDetails = async (req, res) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.jwtToken !== token) return res.status(401).json({ error: 'Invalid or expired session.' });
    res.json({ user: {
      name: user.name, email: user.email, role: user.role,
      transactions: user.transactions.slice(-100).reverse(), notifications: user.notifications,
      wallet: { balance: user.wallet.balance, currency: user.wallet.currency },
      referralCode: user.referralCode, referralCount: user.referralCount,
    } });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired session.' });
  }
};









const logout = async (req, res) => {
  try {
    const token = req.cookies?.authToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await User.updateOne({ _id: decoded.id, jwtToken: token }, { $unset: { jwtToken: 1 } });
    }
  } catch (_) {
    // Clear stale/expired cookies too.
  }
  res.clearCookie('authToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' });
  res.json({ message: 'Signed out.' });
};

module.exports = { signup, login, verifyEmail, fetchUserDetails, logout };
