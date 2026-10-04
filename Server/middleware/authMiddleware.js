const jwt = require('jsonwebtoken');
const { getModel } = require('../models');

// Extracts the JWT from the Authorization header (Bearer) or the auth cookie.
const extractToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice(7);
  return req.cookies?.authToken || null;
};

// Middleware to authenticate users
const authenticateUser = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = getModel('User');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    req.userId = String(user._id);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Middleware to authenticate admin users
const authenticateAdmin = async (req, res, next) => {
  await authenticateUser(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  });
};

module.exports = { authenticateUser, authenticateAdmin, extractToken };
