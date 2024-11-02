// routes/transaction.js (or similar)
const express = require('express');
const router = express.Router();
const User = require('../models/UserSchema'); // Adjust the path as needed
const Transaction = require('../models/Transaction'); // Import the Transaction model
const jwt = require('jsonwebtoken');


const treansactions = async (req, res) => {
    const { network, amount, phone, mode } = req.body;
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).send('User not found.');
  
      if (amount <= 100) return res.status(400).send('Amount must be greater than 100.');
      if (amount > user.wallet.balance) return res.status(400).send('Insufficient wallet balance.');
  
      // Create transaction
      const transaction = new Transaction({
        amount,
        network,
        type: 'debit',
        mode,
        description: `Airtime purchase for ${phone}`
      });
      await transaction.save();
  
      // Update wallet balance
      user.wallet.balance -= amount;
      user.transactions.push(transaction);
      await user.save();
  
      res.status(200).send({ user, transaction });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error.');
    }
  }
  



module.exports = treansactions;
