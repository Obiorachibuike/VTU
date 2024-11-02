const { body, validationResult } = require('express-validator');
const Car = require('../models/CarSchema.js');

// Get all cars
const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
};

// Create a new car
const createCar = [
  body('name').notEmpty().withMessage('Car name is required'),
  body('manufacturingYear').isInt({ min: 1886 }).withMessage('Manufacturing year must be a valid year'),
  body('price').isNumeric().withMessage('Price must be a number'),

  async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, manufacturingYear, price } = req.body;
      const car = new Car({ name, manufacturingYear, price });
      await car.save();
      res.status(201).json(car);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
];

// Update a car
const updateCar = [
  body('name').optional().notEmpty().withMessage('Car name must not be empty'),
  body('manufacturingYear').optional().isInt({ min: 1886 }).withMessage('Manufacturing year must be a valid year'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),

  async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { name, manufacturingYear, price } = req.body;
      const car = await Car.findByIdAndUpdate(id, { name, manufacturingYear, price }, { new: true });
      if (!car) return res.status(404).json({ error: 'Car not found' });
      res.json(car);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
];

// Delete a car
const deleteCar = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  try {
    const { id } = req.params;
    const car = await Car.findByIdAndDelete(id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getCars, createCar, updateCar, deleteCar };
