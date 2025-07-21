// routes/war.js
import express from "express";
import WAR from "../models/War.js";
import User from "../models/User.js";
import verifyToken from "../middleware/verifyToken.js";
import cloudinary from "cloudinary";
import EditedWARs from "../models/EditedWars.js";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const warRouter = express.Router();

warRouter.post("/wars", verifyToken, async (req, res) => {
  const { classification, title, description, impact, poc, files } = req.body;

  try {
    // Validate input (you can add more validation here)
    if (!classification || !title || !description || !impact || !poc) {
      return res
        .status(400)
        .json({ message: "All fields are required, files are optional" });
    }

    // Find user by POC email
    const user = await User.findOne({ email: poc });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const name = `${user.firstName} ${user.lastName}`;

    // Create a new WAR document
    const newWar = new WAR({
      classification,
      title,
      description,
      impact,
      poc,
      name,
      files: files.length > 0 ? files : null, // Include file URLs if available
    });

    // Save to MongoDB
    await newWar.save();

    // Send a success response
    res.status(201).json({ message: "WAR created successfully", war: newWar });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error });
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
      res.status(200).json({ eachWAR, email });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

warRouter.post("/edited-wars", verifyToken, async (req, res) => {
  const {
    originalWarID,
    editsMadeBy,
    newDescription,
    newImpact,
    rating,
    comment,
    unclassifiedVersion,
    eprBullet,
    files,
  } = req.body;

  const numberOfRatings = (await WAR.find({_id: originalWarID}))[0].numberOfRatings;
  const existingAverageRating = (await WAR.find({_id: originalWarID}))[0].averageRatings;

  try {
    // Validate input (you can add more validation here)
    if (!originalWarID) {
      return res.status(400).json({ message: "Original ID of WAR required" });
    }

    const newAverage =
      numberOfRatings === 0
        ? rating // If no ratings yet, the first rating becomes the average
        : (existingAverageRating * numberOfRatings + rating) /
          (numberOfRatings + 1);

    await WAR.updateOne(
      { _id: originalWarID },
      {
        $inc: { numberOfRatings: 1 },
        $set: { averageRatings: newAverage },
      }
    );

    // Create a new WAR document
    const newWar = new EditedWARs({
      originalWarID,
      editsMadeBy,
      newDescription,
      newImpact,
      rating,
      comment,
      unclassifiedVersion,
      eprBullet,
      files: files && files.length > 0 ? files : null, // Include file URLs if available
    });

    // Save to MongoDB
    await newWar.save();

    // Send a success response
    res
      .status(201)
      .json({ message: "WAR suggestion saved successfully", war: newWar });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default warRouter;
