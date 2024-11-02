const express = require('express');
const { getCars, createCar, updateCar, deleteCar } = require('../controllers/carController.js');
const { authenticateAdmin, authenticateUser } = require('../middleware/authMiddleware.js');
const router = express.Router();

router.get('/', getCars);
router.post('/', authenticateAdmin, createCar);
router.put('/:id', authenticateAdmin, updateCar);
router.delete('/:id', authenticateAdmin, deleteCar);

module.exports = router;
