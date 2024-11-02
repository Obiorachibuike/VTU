const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  carName: { type: String, required: true },
  manufacturingYear: { type: Number, required: true },
  price: { type: Number, required: true },
  manufacturer: {
    type: String,
    required: true,
  },
});

const Car = mongoose.model("Car", carSchema);
module.exports = Car;
