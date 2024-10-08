import express from "express";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import verifyToken from "../middleware/verifyToken.js";
import generateToken from "../helperFunctions/generateToken.js";

dotenv.config();

const registerRouter = express.Router();

// Nodemailer setup for sending emails
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.USERNAME, // replace with your email
    pass: process.env.PASSWORD, // replace with your email password (or use environment variables)
  },
});

// Register route
registerRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationToken = generateToken(email);

    const user = new User({
      email,
      password,
      verificationToken,
    });

    await user.save();

    // Send verification email
    const verificationLink = `http://localhost:5173/complete-profile?token=${verificationToken}`;

    const mailOptions = {
      from: "test@example.com",
      to: email,
      subject: "Account Verification",
      text: `Click this link to verify your account for the Impact Tracker application: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Email could not be sent" });
      }
      res
        .status(201)
        .json({ message: "Registration successful, please verify your email" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user data for pre-filling the complete profile form
registerRouter.get("/complete-profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      // If the user is already verified, redirect them to the complete profile page
      return res.status(200).send({ userId: user._id });
    }

    // Update user verification status
    user.isVerified = true;
    await user.save();

    // Redirect to complete profile page after verification
    return res.status(200).send({ userId: user._id });
  } catch (err) {
    console.error("Error verifying email:", err);
    res.status(500).json({ error: "Error verifying email or invalid token" });
  }
});

registerRouter.post("/complete-profile", verifyToken, async (req, res) => {
  const { userId, userObj } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Find the user in the database by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's profile with new information
    user.firstName = userObj.firstname;
    user.lastName = userObj.lastname;
    user.rank = userObj.rank;
    user.DoDID = userObj.DoDID;
    user.unit = userObj.unit;
    user.role = userObj.role;
    user.reason = userObj.reason;
    user.verificationToken = generateToken(user.email);

    user.profileCompleted = true;

    // Save the updated user data
    await user.save();

    // Respond with success
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error, could not update profile" });
  }
});

export default registerRouter;
