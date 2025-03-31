// import mongoose from "mongoose";

// const SonarProjectSchema = new mongoose.Schema({
//   repo: { type: mongoose.Schema.Types.ObjectId, ref: "Repo", required: true }, // Links to Repo
//   projectKey: { type: String, required: true }, // SonarCloud Project Key
//   organization: { type: String, required: true }, // SonarCloud Organization
//   webhookSet: { type: Boolean, default: false }, // If Webhooks are configured
// });

// const SonarProject = mongoose.model("SonarProject", SonarProjectSchema);
// export default SonarProject;

import mongoose from "mongoose";

const SonarProjectSchema = new mongoose.Schema(
  {
    repo: { type: mongoose.Schema.Types.ObjectId, ref: "Repo", required: true },
    projectKey: { type: String, required: true },
    organization: { type: String, required: true },
  },
  { timestamps: true }
);

export const SonarProject =
  mongoose.models.SonarProject ||
  mongoose.model("SonarProject", SonarProjectSchema);
