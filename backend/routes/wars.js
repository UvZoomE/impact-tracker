// routes/war.js
import express from "express";
import WAR from "../models/War.js";
import User from "../models/User.js";
import verifyToken from "../middleware/verifyToken.js";

const warRouter = express.Router();

// POST route to create a new WAR
warRouter.post("/wars", verifyToken, async (req, res) => {
  const { classification, title, description, impact, poc } = req.body;

  try {
    // Validate input (you can add more validation here)
    if (!classification || !title || !description || !impact || !poc) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.find({ email: poc });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const name = user.firstName + " " + user.lastName;

    // Create a new WAR document
    const newWar = new WAR({
      classification,
      title,
      description,
      impact,
      poc,
      name,
    });

    // Save to MongoDB
    await newWar.save();

    // Send a success response
    res.status(201).json({ message: "WAR created successfully", war: newWar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET route to fetch all WARs associated with the current user's email
warRouter.get("/wars", verifyToken, async (req, res) => {
  const email = req.email; // Assuming email is stored in the token
  const { need } = req.query;
  try {
    // Count WAR documents where 'poc' matches the current user's email
    if (need === "warCount") {
      const warCount = await WAR.countDocuments({ poc: email });
      // Send a success response with the fetched WARs
      res.status(200).json({ warCount });
    } else if (need === "eachWAR") {
      const eachWAR = await WAR.find();
      res.status(200).json(eachWAR);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default warRouter;
