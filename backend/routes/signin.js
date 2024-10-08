import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";
import generateToken from "../helperFunctions/generateToken.js";

dotenv.config();

const authRouter = express.Router();

// Nodemailer setup for sending emails
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.USERNAME, // replace with your email
    pass: process.env.PASSWORD, // replace with your email password (or use environment variables)
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
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password (assuming you're using bcrypt or similar)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
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

    // Respond with success and redirect to home
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default authRouter;
