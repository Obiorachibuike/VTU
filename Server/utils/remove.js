const mongoose = require('mongoose');
const User = require('../models/UserSchema');  // Adjust the path to where your User model is defined
const { connection } = require('./db');

// Function to remove the 'username' index
async function removeUsernameIndex() {
  try {
    // Connect to MongoDB
   connection()

    // Drop the index on 'username'
    await User.collection.dropIndex('username_1');
    console.log('Username index removed successfully');
  } catch (error) {
    console.error('Error removing index:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}



 const  deleteAllUsers = async () => {
  try {
    // Connect to the database
    

    // Delete all users
    const result = await User.deleteMany({});
    console.log(`${result.deletedCount} users deleted`);

    // Close the database connection
    // await mongoose.disconnect();
  } catch (error) {
    console.error('Error deleting users:', error.message);
  }
}

// Call the function to delete all users
// deleteAllUsers();

module.exports = deleteAllUsers

// Run the function
// removeUsernameIndex();
