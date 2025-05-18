const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.CONNECT_URL_MONGODB;

async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB with Mongoose");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };
