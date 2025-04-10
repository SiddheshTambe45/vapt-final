import { NextResponse } from "next/server";
import crypto from "crypto";
import { Repo } from "@/models/repo";
import { SonarProject } from "@/models/sonarProject";
import mongoose from "mongoose";
import { triggerDockerAppSetup } from "@/lib/docker/dockerAppSetup"; // Import the function to trigger Docker setup

async function ensureDatabaseConnection() {
  if (mongoose.connection.readyState !== 1) {
    console.log("Database not connected. Reconnecting...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export async function POST(req) {
  try {
    const signature = req.headers.get("x-hub-signature");
    const payload = await req.json();

    // Verify GitHub Webhook Signature
    if (!verifyGithubSignature(signature, payload)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Check if it's a push event
    const event = req.headers.get("x-github-event");
    if (event !== "push") {
      return NextResponse.json(
        { message: "Not a push event" },
        { status: 200 }
      );
    }

    const { repository } = payload;
    const repoId = repository.id.toString(); // GitHub Repo ID as string

    // Check if repo exists in DB
    await ensureDatabaseConnection();
    const repo = await Repo.findOne({ repoId });
    if (!repo) {
      return NextResponse.json(
        { error: "Repository not found in database" },
        { status: 404 }
      );
    }

    // Fetch SonarCloud details for this repo
    const sonarProject = await SonarProject.findOne({ repo: repo._id });
    if (!sonarProject) {
      return NextResponse.json(
        { error: "SonarCloud project not found" },
        { status: 404 }
      );
    }

    // Fetch SonarCloud SAST Report
    const sonarReport = await fetchSonarCloudReport(
      sonarProject.apiToken,
      sonarProject.organization,
      sonarProject.projectKey
    );

    // // Now trigger the background task for Docker container setup and app run
    triggerDockerAppSetup(payload); // Send the data needed for Docker setup

    // triggerKoyebDeployment(payload);

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Function to verify GitHub webhook signature
function verifyGithubSignature(signature, payload) {
  const hmac = crypto.createHmac("sha1", process.env.github_app_webhook_secret);
  hmac.update(JSON.stringify(payload));
  const computedSignature = `sha1=${hmac.digest("hex")}`;

  return signature === computedSignature;
}

// Fetch SonarCloud Report using User's API Token
async function fetchSonarCloudReport(userToken, organization, projectKey) {
  const url = `https://sonarcloud.io/api/measures/component?componentKey=${projectKey}&metricKeys=bugs,vulnerabilities,code_smells`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  // const response = await fetch(
  //   `https://sonarcloud.io/api/measures/component?componentKey=${organization}:${projectKey}&metricKeys=bugs,vulnerabilities,code_smells`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${userToken}`,
  //     },
  //   }
  // );

  if (!response.ok) {
    throw new Error("Failed to fetch SonarCloud report");
  }

  return await response.json();
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type,Authorization,X-Hub-Signature",
    },
  });
}
