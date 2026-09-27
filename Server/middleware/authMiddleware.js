const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema.js');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) return res.status(401).json({ message: 'Authentication required.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.jwtToken !== token) return res.status(401).json({ message: 'Session expired. Please sign in again.' });
    req.user = user;
    req.userId = String(user._id);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed.' });
  }
};

const authenticateAdmin = async (req, res, next) => {
  await authenticateUser(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Administrator access required.' });
    next();
  });
};

module.exports = { authenticateUser, authenticateAdmin };
