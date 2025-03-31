import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    name: { type: String }, // Full name from GitHub profile
    avatarUrl: { type: String },
    accessToken: { type: String, select: false }, // Don't return in queries
    installations: [{ type: String, unique: true }], // Multiple installations per user
    // repos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Repo" }], // Relationship with Repo
  },
  { timestamps: true }
);

// const User = mongoose.model("User", UserSchema);
// export default User;

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
