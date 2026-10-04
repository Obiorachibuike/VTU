/**
 * Auth controller — signup, login, email verification, user details.
 *
 * Email verification: with AUTO_VERIFY_EMAIL=true (default in .env) new users
 * are verified immediately so the app is usable out of the box. Set it to
 * false to require clicking the verification link we email to the user.
 */
const { body, validationResult } = require('express-validator');
const { getModel } = require('../models');
const sendMail = require('../utils/nodeMailer.js');

const publicUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  role: user.role,
  wallet: { balance: user.wallet?.balance ?? 0, currency: user.wallet?.currency || 'NGN' },
  referralCode: user.referralCode,
  referralCount: user.referralCount || 0,
  isVerified: user.isVerified,
  date: user.date instanceof Date ? user.date.toISOString() : user.date,
});

// User Signup
const signup = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;
    const referralCode = req.query.referral;

    try {
      const User = getModel('User');
      const existingUser = await User.findOne({ email: String(email).toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const autoVerify = process.env.AUTO_VERIFY_EMAIL !== 'false';
      const user = new User({
        name,
        email: String(email).toLowerCase(),
        password,
        phone: phone || '',
        isVerified: autoVerify,
      });
      if (!autoVerify) user.generateVerificationToken();
      await user.save();

      // Handle referral bonus
      if (referralCode) {
        const referrer = await User.findOne({ referralCode });
        if (referrer) {
          const Transaction = getModel('Transaction');
          await User.updateOne(
            { _id: referrer._id },
            { $inc: { 'wallet.balance': 50, referralCount: 1 } }
          );
          await Transaction.create({
            user: String(referrer._id),
            reference: `REF-${Date.now().toString(36).toUpperCase()}`,
            category: 'referral',
            type: 'credit',
            amount: 50,
            status: 'completed',
            description: `Referral bonus — ${name} joined`,
            mode: 'wallet',
          });
        }
      }

      let verifyLink = null;
      if (!autoVerify && user.verificationToken) {
        verifyLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${user.verificationToken}`;
        try {
          await sendMail(email, user.verificationToken);
        } catch (mailError) {
          console.error('Verification email failed:', mailError.message);
        }
      }

      const token = user.generateToken();
      await user.save();

      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        message: autoVerify
          ? 'Account created successfully'
          : 'Account created. Please verify your email.',
        jwtToken: token,
        user: publicUser(user),
        verifyLink: autoVerify ? null : verifyLink,
      });
    } catch (error) {
      console.error('signup:', error.message);
      res.status(500).json({ error: error.message || 'Signup failed' });
    }
  },
];

// Login
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
      const User = getModel('User');
      const user = await User.findOne({ email: String(email).toLowerCase() });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (!user.isVerified) {
        return res.status(401).json({ error: 'Email not verified. Check your inbox for the verification link.' });
      }

      const token = user.generateToken();
      await user.save();

      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({ jwtToken: token, user: publicUser(user) });
    } catch (error) {
      console.error('login:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
];

// Verify Email
const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    if (typeof token !== 'string' || !token) {
      return res.status(400).json({ error: 'Invalid token format' });
    }
    const User = getModel('User');
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// User details (used by the dashboard)
const fetchUserDetails = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        isVerified: user.isVerified,
        transactions: (user.transactions || []).map((t) => ({
          ...t,
          date: t.date instanceof Date ? t.date.toISOString() : t.date,
        })),
        notifications: (user.notifications || []).map((n) => ({
          ...n,
          date: n.date instanceof Date ? n.date.toISOString() : n.date,
        })),
        wallet: {
          balance: user.wallet?.balance ?? 0,
          currency: user.wallet?.currency || 'NGN',
        },
        referralCode: user.referralCode,
        referralCount: user.referralCount || 0,
      },
    });
  } catch (error) {
    console.error('fetchUserDetails:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { signup, login, verifyEmail, fetchUserDetails };
