
const { body, validationResult } = require('express-validator');
const User = require('../models/UserSchema.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendMail = require('../utils/nodeMailer.js');





// User Signup
const signup = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['admin', 'user']).withMessage('Role must be admin or user'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, password, role = 'user' } = req.body; // Default role to 'user'
    const referralCode = req.query.referral; // Get referral code from query parameters
    
    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      
      // Create and save new user
      const user = new User({ name, email, password, role });
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
      sendMail(email, verificationToken);

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
      console.log('Generated token:', token);

      // Save the new token in the user's record
      user.jwtToken = token;
      await user.save(); // Save the user with the new token

      // Clear existing cookie if it exists
      res.clearCookie('authToken');

      // Set new token as HttpOnly cookie with the new name
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });

      // Return the token in the response
      res.json({ jwtToken: token });

    } catch (error) {
      console.error('Error during login:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];









// Verify Email
const verifyEmail = async (req, res) => {
  const { token } = req.query;
  console.log(token);
  

  try {
    if (typeof token === 'string') {
      // Find user with the provided verification token
      const user = await User.findOne({ verificationToken: token });
      console.log(user);
      

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
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get the token from the "Authorization" header
    console.log(req)
// console.log(jwt.verify(token, process.env.JWT_SECRET));


    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
    //  console.log(decoded);
     
    // Find the user by email from token
    const user = await User.findById(decoded.id);

    // console.log(user);
    
    // console.log('Stored token:', user.jwtToken);
    // console.log('Incoming token:', token);
    
    if (!user || user.jwtToken !== token) { // Check if token matches the stored token
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Return the user details
    res.json({
      user: {
        name: user.name,
        email: user.email,
        transactions: user.transactions,
        notifications: user.notifications,
        wallet: {
          balance: user.wallet.balance,
          currency: user.wallet.currency, // Including currency if needed
        },
        referralCode: user.referralCode,
        referralCount: user.referralCount,
      },
    });

  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};










module.exports = { signup, login, verifyEmail,fetchUserDetails };
