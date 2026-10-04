const nodemailer = require('nodemailer');
require('dotenv').config();  // Ensure environment variables are loaded

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD  // Use the app password here
  }
});

// Define recipient email and verification link
const email = 'obiorachibuike22@gmail.com'; // Correctly define the email address


const sendMail = async (email , verificationToken) => {
    try {
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        text: `Please verify your email by clicking the following link: ${verificationLink}`
      });
  
      console.log('Verification email sent successfully to:', email);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  };
  


module.exports = sendMail
