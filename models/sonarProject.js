import mongoose from "mongoose";

const SonarProjectSchema = new mongoose.Schema(
  {
    repo: { type: mongoose.Schema.Types.ObjectId, ref: "Repo", required: true },
    projectKey: { type: String, required: true },
    organization: { type: String, required: true },
    apiToken: { type: String, required: true },
  },
  { timestamps: true }
);

export const SonarProject =
  mongoose.models.SonarProject ||
  mongoose.model("SonarProject", SonarProjectSchema);
