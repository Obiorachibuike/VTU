const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware.js');
const wallet = require('../controllers/walletController.js');

const router = express.Router();

router.use(authenticateUser);

router.get('/', wallet.getWallet);
router.post('/deposit/init', wallet.initDeposit);
router.get('/deposit/status', wallet.getDepositStatus);
router.post('/deposit/verify', wallet.verifyDeposit);
router.get('/banks', wallet.getBanks);
router.get('/accounts', wallet.getAccounts);
router.post('/accounts', wallet.addAccount);
router.delete('/accounts/:id', wallet.deleteAccount);
router.post('/withdraw', wallet.withdraw);

module.exports = router;
