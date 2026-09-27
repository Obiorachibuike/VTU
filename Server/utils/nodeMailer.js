const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (email, verificationToken) => {
  const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verificationLink = `${frontend}/verify-email?token=${encodeURIComponent(verificationToken)}`;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    if (process.env.NODE_ENV === 'production') throw new Error('Email delivery is not configured.');
    console.info(`Development email verification link for ${email}: ${verificationLink}`);
    return;
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your SubHub247 account',
    text: `Verify your email by opening: ${verificationLink}`,
  });
};

module.exports = sendMail;
