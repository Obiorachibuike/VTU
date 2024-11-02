 const modeHandler  = async (req, res) => {
    if (req.method === 'POST') {
      const { mode } = req.body;

       // Create and save new user
       const theme = new User({mode});
       
       await user.save();
       
  
      // Here you would save the mode to your database
      // Example using a database library (e.g., Prisma, Mongoose)
      // await saveModeToDatabase(mode);
  
      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  
  module.exports = modeHandler