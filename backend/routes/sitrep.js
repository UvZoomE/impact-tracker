import dotenv from "dotenv";
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsPDF } from "jspdf";
import SITREP from "../models/SITREP.js";
import User from "../models/User.js";

// Make sure to include these imports:
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

dotenv.config();

const sitrepRouter = express.Router();

// Route to get user info (protected route)
sitrepRouter.post("/sitrep", verifyToken, async (req, res) => {
  const { specificWARs, dateRange, currentUnit } = req.body;
  const doc = new jsPDF();

  const allUsersInUnit = await User.find({unit: currentUnit});
  console.log(allUsersInUnit);
  let prompt =
    "Give me a SITREP based on all the numbered inputs provided (Act as if you are giving this SITREP to a commander of a military unit): \n\n";
  try {
    specificWARs.map((eachWAR, i) => {
      prompt +=
        i +
        ".\n" +
        "Description: " +
        eachWAR.description +
        "\n" +
        "Impact: " +
        eachWAR.impact +
        "\n\n";
    });

    prompt +=
      "This is the date range: " +
      dateRange +
      " and make sure the SITREP is basically a summary of each numbered point combined";

    const result = await model.generateContent(prompt);

    doc.text(result.response.candidates[0].content.parts[0].text, 10, 10, {
      maxWidth: 180,
    });
    const pdfData = doc.output("blob");
    const formData = new FormData();

    formData.append("file", pdfData); // Append the PDF Blob to the form data
    formData.append("timestamp", new Date().getTime() / 1000); // Current timestamp
    formData.append("upload_preset", "impact-tracker-files");
    formData.append("resource_type", "raw"); // Specify raw resource type (non-image file)

    fetch(
      `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUD_NAME}/raw/upload`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Upload successful:", data);
      })
      .catch((error) => {
        console.error("Upload failed:", error);
      });

    // Create a new WAR document
    const newSITREP = new SITREP({
      text: result.response.candidates[0].content.parts[0].text,
    });

    // Save to MongoDB
    await newSITREP.save();

    res.json(result); // Send user data as JSON
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default sitrepRouter;
