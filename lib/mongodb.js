// import dotenv from "dotenv";
// dotenv.config();

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI environment variable.");
}

async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("✅ MongoDB already connected.");
      return mongoose.connection;
    }

    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // Exit process if connection fails
  }
}

export default connectDB;
