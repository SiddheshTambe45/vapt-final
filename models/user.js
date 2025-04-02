import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    name: { type: String }, // Full name from GitHub profile
    avatarUrl: { type: String },
    accessToken: { type: String, select: false }, // Don't return in queries
    installations: [{ type: String, unique: true }], // Multiple installations per user
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
