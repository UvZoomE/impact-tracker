import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: function () {
      return this.profileCompleted;
    },
  },
  lastName: {
    type: String,
    required: function () {
      return this.profileCompleted;
    },
  },
  rank: {
    type: String,
    required: function () {
      return this.profileCompleted;
    },
  },
  DoDID: {
    type: String,
    required: function () {
      return this.profileCompleted;
    },
  },
  unit: {
    type: String,
    required: function () {
      return this.profileCompleted;
    },
  },
  workSection: {
    type: String,
    required: function () {
      return this.profileCompleted;
    },
  },
  role: {
    type: String,
    required: function () {
      return this.profileCompleted;
    },
  },
  reason: {
    type: String,
    required: function () {
      return this.profileCompleted;
    },
  },
  profileCompleted: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  warsSubmitted: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
});

// Hash password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
