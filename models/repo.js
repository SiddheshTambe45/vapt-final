import mongoose from "mongoose";

const RepoSchema = new mongoose.Schema(
  {
    user: { type: String, ref: "User", required: true }, // Reference User by githubId
    installationId: { type: String, required: true }, // The installation this repo belongs to
    repoId: { type: String, required: true, unique: true }, // GitHub Repository ID
    name: { type: String, required: true }, // Repository Name
    owner: { type: String, required: true }, // Repository Owner (user or org)
    private: { type: Boolean, default: false }, // If repo is private
    description: { type: String }, // Repository Description
    webhookSet: { type: Boolean, default: false }, // If Webhooks are configured
    sonarProjectId: { type: String }, // SonarQube Project ID (if integrated)
  },
  { timestamps: true }
);

export const Repo = mongoose.models.Repo || mongoose.model("Repo", RepoSchema);
