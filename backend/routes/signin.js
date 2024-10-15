import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";
import generateToken from "../helperFunctions/generateToken.js";
import crypto from 'crypto';

dotenv.config();

const authRouter = express.Router();

// Nodemailer setup for sending emails
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  },
});

const resendVerificationEmail = async (verificationLink, email) => {
  const mailOptions = {
    from: "test@example.com",
    to: email,
    subject: "Account Verification",
    text: `Click this link to verify your account for the Impact Tracker application: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
  });
};

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for email:', email); // Add this log

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      console.log('User not found:', email); // Add this log
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password (assuming you're using bcrypt or similar)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials for user:', email); // Add this log
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      console.log('User not verified:', email); // Add this log
      // Resend verification email (call your email sending logic here)
      const verificationToken = generateToken(user.email);
      user.verificationToken = verificationToken;
      await user.save();
      const verificationLink = `${process.env.VITE_FRONTEND_URL}/complete-profile?token=${verificationToken}`;
      await resendVerificationEmail(verificationLink, user.email);
      return res
        .status(403)
        .json({ message: "Email not verified. Verification email resent." });
    }

    // Check if the profile is completed
    if (!user.profileCompleted) {
      console.log('Profile not completed for user:', email); // Add this log
      // Make new token for user with uncompleted profile
      const verificationToken = generateToken(user.email);
      user.verificationToken = verificationToken;
      await user.save();
      return res.status(302).json({ token: verificationToken });
    }

    // Generate JWT or other authentication token if needed
    const token = generateToken(user.email);
    user.verificationToken = token;
    await user.save();

    console.log('Login successful for user:', email); // Add this log
    // Respond with success and redirect to home
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
});

authRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    console.log('Received forgot password request for email:', email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send reset email
    const resetUrl = `${process.env.VITE_FRONTEND_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: "noreply@yourapp.com",
      to: user.email,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    console.log('Attempting to send email to:', user.email);
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
});

// Add this new route for resetting the password
authRouter.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired" });
    }

    // Set the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

export default authRouter;
