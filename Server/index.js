const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const db =  require('./utils/db.js')
const data = require('./cars.json')
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const Car = require('./models/CarSchema.js'); // Ensure this path matches your actual file
const UserSchema = require('./models/UserSchema.js');
const deleteAllUsers = require('./utils/remove.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const secretKey = require('./utils/secreteKey.js')
require('dotenv').config();

// secretKey

const app = express();
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true, // Allows cookies to be sent
};

// Session management
app.use(session({
  secret: process.env.SECRET_KEY, // Change to a secure secret
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true, // Prevent access via JavaScript
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'Strict', // Restrict cookies to first-party context
  }
}));



// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message); // Log error message
  res.status(500).json({ error: err.message || 'An unexpected error occurred' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// Function to import data
const importData = async () => {
  try {
    // Check if data already exists
    const carCount = await Car.countDocuments();
    if (carCount > 0) {
      console.log('Data already exists, skipping import.');
      return;
    }

    // Read and parse the JSON file
    // const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'cars.json'), 'utf-8'));
    

    // Import the data into MongoDB
    await Car.insertMany(data);

    console.log('Data imported successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  }
};

// Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true
// })
//   .then(() => {
  //     console.log('Connected to MongoDB');
  //     // Import data after successful connection
//     importData();
//   })
//   .catch(err => console.error('Error connecting to MongoDB', err));


db.connection()

// deleteAllUsers()

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
