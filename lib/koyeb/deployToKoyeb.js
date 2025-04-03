"use server";

import axios from "axios";

const KOYEB_API_TOKEN = process.env.KOYEB_API_TOKEN; // Store API token securely
const KOYEB_ORG_ID = process.env.KOYEB_ORG_ID; // Replace with your Koyeb organization ID

export async function deployToKoyeb(repoName, branch, fullName) {
  console.log(`🚀 Deploying ${repoName} to Koyeb...`);

  const serviceName = `user-repo-${repoName}-${Date.now()}`;
  const repoUrl = `https://github.com/${fullName}.git`;

  const payload = {
    name: serviceName,
    organization_id: KOYEB_ORG_ID,
    region: "fra", // Change region if needed
    definition: {
      type: "docker",
      name: serviceName,
      docker: {
        image: "node:18", // Use Node.js base image
        command: [
          "sh",
          "-c",
          `
          git clone ${repoUrl} /app &&
          cd /app &&
          git checkout ${branch} &&
          npm install --legacy-peer-deps &&
          npm start
          `,
        ],
        env: [{ name: "NODE_ENV", value: "production" }],
        ports: [{ port: 3000, protocol: "http" }], // Ensure it runs on port 3000
      },
      scaling: {
        min_instances: 1,
        max_instances: 1,
      },
    },
  };

  try {
    // Step 1: Create a service on Koyeb
    const response = await axios.post(
      "https://app.koyeb.com/v1/services",
      payload,
      {
        headers: {
          Authorization: `Bearer ${KOYEB_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const deployedUrl = response.data.routes?.[0]?.url || "URL_NOT_FOUND";
    console.log(`✅ Deployed at: ${deployedUrl}`);
    return deployedUrl;
  } catch (error) {
    console.error("❌ Deployment failed:", error.response?.data || error);
  }
}

export async function triggerKoyebDeployment(payload) {
  const repoName = payload.repository.name;
  const branch = payload.ref.split("/").pop();
  const fullName = payload.repository.full_name;

  console.log("🔹 Triggering Koyeb deployment...");
  const appUrl = await deployToKoyeb(repoName, branch, fullName);

  if (appUrl) {
    console.log(`🌐 App deployed at: ${appUrl}`);
    return appUrl;
  }
}
