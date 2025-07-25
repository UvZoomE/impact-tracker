// models/War.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const WarSchema = new Schema({
  classification: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  impact: {
    type: String,
    required: true,
  },
  poc: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  files: {
    type: [{
      secure_url: {
        type: String,
      },
      height: {
        type: String,
      },
      width: {
        type: String,
      },
    }],
  },
  numberOfRatings: {
    type: Number,
    default: 0,
  },
  averageRatings: {
    type: Number,
    default: 0.0,
  }
});

const WAR = mongoose.model("War", WarSchema);

export default WAR;
