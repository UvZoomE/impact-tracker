// models/War.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const EditWARSchema = new Schema({
  originalWarID: {
    type: String,
  },
  newDescription: {
    type: String,
  },
  newImpact: {
    type: String,
  },
  rating: {
    type: String,
  },
  comment: {
    type: String,
  },
  unclassifiedVersion: {
    type: String,
  },
  eprBullet: {
    type: String,
  },
  files: {
    type: [String],
  },
  Edited: {
    type: Date,
    default: Date.now,
  },
});

const EditWAR = mongoose.model("EditWAR", EditWARSchema);

export default EditWAR;
