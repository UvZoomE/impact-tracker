import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const generateToken = (email) => {
  const secretKey = process.env.SECRET_KEY; // Use a strong secret key
  const token = jwt.sign(
    { email: email }, // Payload (data you want to store in the token)
    secretKey,
    { expiresIn: "24h" },
  );
  return token;
};

export default generateToken;
