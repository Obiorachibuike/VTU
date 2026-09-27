const express = require('express');
const { authenticateUser, authenticateAdmin } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');
const controller = require('../controllers/walletController');
const router = express.Router();

router.post('/deposits', authenticateUser, asyncHandler(controller.initializeDeposit));
router.post('/deposits/:reference/verify', authenticateUser, asyncHandler(controller.verifyDeposit));
router.post('/withdrawals', authenticateUser, asyncHandler(controller.requestWithdrawal));
router.get('/transactions', authenticateUser, asyncHandler(controller.listTransactions));
router.get('/admin/withdrawals', authenticateAdmin, asyncHandler(controller.listWithdrawals));
router.post('/admin/withdrawals/:userId/:reference', authenticateAdmin, asyncHandler(controller.resolveWithdrawal));

module.exports = router;
