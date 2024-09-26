import express, { json } from 'express';
import connectDB from './config/db.js';  // Import the database connection

const app = express();

// Connect to MongoDB
connectDB();

app.use(json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
