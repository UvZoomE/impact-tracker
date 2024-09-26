import express from 'express';
import User from '../models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

// Nodemailer setup for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your preferred email service provider
  auth: {
    user: process.env.EMAIL, // replace with your email
    pass: process.env.PASSWORD, // replace with your email password (or use environment variables)
  },
});

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      username,
      email,
      password,
      verificationToken,
    });

    await user.save();

    // Send verification email
    const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Account Verification',
      text: `Click this link to verify your account for the Impact Tracker application: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Email could not be sent' });
      }
      res.status(201).json({ message: 'Registration successful, please verify your email' });
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
