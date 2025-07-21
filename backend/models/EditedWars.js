// models/War.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const EditedWARsSchema = new Schema({
  originalWarID: {
    type: String,
  },
  editsMadeBy: {
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

const EditedWARs = mongoose.model("EditedWARs", EditedWARsSchema);

export default EditedWARs;
