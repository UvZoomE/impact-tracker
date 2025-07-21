import User from "../models/User.js";
import dotenv from "dotenv";
import express from "express";
import verifyToken from "../middleware/verifyToken.js";

dotenv.config();

const userRouter = express.Router();

// Route to get user info (protected route)
userRouter.get("/api/user", verifyToken, async (req, res) => {
  const email = req.email;
  try {
    const user = await User.findOne({ email }); // Get user from MongoDB using the user ID from the token
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (req.token !== user.verificationToken) {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    res.json(user); // Send user data as JSON
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default userRouter;
