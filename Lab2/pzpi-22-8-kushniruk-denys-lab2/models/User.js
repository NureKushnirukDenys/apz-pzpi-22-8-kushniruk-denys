const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profileImage: { type: String },
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
