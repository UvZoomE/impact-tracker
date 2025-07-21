// models/War.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SITREPSchema = new Schema({
  text: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const SITREP = mongoose.model("SITREP", SITREPSchema);

export default SITREP;