import express from "express";
import cors from "cors";
import registerRouter from "./routes/register.js";
import mongoose from "mongoose";
import authRouter from "./routes/signin.js";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors());

app.use(registerRouter, authRouter);

// Connect to MongoDB and start server
mongoose
  .connect(`${process.env.MONGO_URI}/authDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log("Server running on port 5000"),
    );
  })
  .catch((err) => console.log(err));
