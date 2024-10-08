import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Check if the header exists and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ error: "No token provided or invalid format" });
  }

  // Remove 'Bearer ' prefix to extract the actual token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    req.email = decoded.email; // Save user ID from token
    req.token = token;
    next();
  });
};

export default verifyToken;