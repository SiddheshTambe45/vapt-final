"use server";

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { startZapScan } from "../attack/zapApi";
import { runZapContainer } from "./dockerZapSetup";
import {
  startBrowserWithProxy,
  closeBrowser,
} from "../browser/puppeteerBrowser"; // Import puppeteer functions

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runDockerContainer(repoName, branch, fullName) {
  console.log("🔹 Reached here -- 2");

  let repoPath = path.resolve(process.cwd(), repoName);
  console.log(`📂 Original repo path: ${repoPath}`);

  // ✅ Convert Windows path to Docker-compatible format
  repoPath = repoPath.replace(/\\/g, "/").replace(/^([A-Za-z]):/, "/$1");
  console.log(`📂 Converted repo path: ${repoPath}`);

  const dockerCommand = [
    "docker",
    "run",
    "--rm",
    "-d",
    "--name",
    `${repoName}-3`,
    "--network",
    "zap-net", // ✅ Critical for communication
    "-v",
    `${repoPath}:/hh`, // Mount repo to /hh in the container
    "-w",
    "/hh", // Set working directory
    "-e",
    `DATABASE_URL=postgresql://postgres.bowwouiwgksgbieqximw:6M1d59uBZAitGshi@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`,
    "-p",
    "4000:4000",
    "node:18",
    "bash",
    "-c",
    `
      if [ ! -d "/hh/${repoName}/.git" ]; then
        echo "🔄 Cloning repository...";
        git clone https://github.com/${fullName}.git /hh/${repoName};
      else 
        cd /hh/${repoName} && echo "🔄 Resetting repo...";
        git reset --hard HEAD && git pull;
      fi;
  
      cd /hh/${repoName};
      echo "🚀 Checking out branch ${branch}...";
      git checkout ${branch};
  
      echo "📦 Checking for existing build...";
      if [ -d ".next" ] || [ -d "dist" ] || [ -d "build" ]; then
        echo "✅ Build folder exists, skipping build check...";
      else
        echo "⚠ No build found, running npm install and build...";
        npm install --legacy-peer-deps;
        npm run build;
      fi;
  
      echo "✅ Starting application on port 4000...";
      PORT=4000 npm start;
  
      tail -f /dev/null
    `,
  ];

  console.log("🔹 Running Docker command:");
  // console.log(dockerCommand.join(" "));

  const childProcess = spawn(dockerCommand[0], dockerCommand.slice(1), {
    shell: false,
    detached: true,
    stdio: "inherit", // ✅ Ensures logs are visible
  });

  console.log("🔹 Reached here -- 3");

  childProcess.unref();

  childProcess.on("error", (err) => {
    console.error("❌ Error executing Docker command:", err);
  });

  childProcess.on("exit", (code, signal) => {
    if (code) {
      console.error(`❌ Docker process exited with code ${code}`);
    } else if (signal) {
      console.error(`❌ Docker process was terminated with signal ${signal}`);
    }
  });

  console.log(
    `✅ Container '${repoName}' started. Use 'docker ps' to check running containers.`
  );
}

// Function to check if the app is up and running on port 4000
async function checkAppReady(targetUrl) {
  console.log(`🔹 Checking if app is up at ${targetUrl}...`);
  let attempts = 0;
  const maxAttempts = 30; // Set maximum attempts
  const delay = 5000; // Delay in ms (5 seconds)

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(targetUrl); // Try to access the app
      if (response.ok) {
        // If response is 200-299, consider it ready
        console.log(`✅ App is up and running on ${targetUrl}`);
        return true;
      } else {
        console.log(
          `❌ App returned status ${response.status}, retrying in ${
            delay / 1000
          } seconds...`
        );
      }
    } catch (error) {
      console.log(
        `❌ App not ready (error: ${error.message}), retrying in ${
          delay / 1000
        } seconds...`
      );
    }
    attempts++;
    await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
  }

  console.error(`❌ App did not start within ${maxAttempts} attempts.`);
  return false;
}

export const triggerDockerAppSetup = async (payload) => {
  const repoName = payload.repository.name;
  const branch = payload.ref.split("/").pop();
  const fullName = payload.repository.full_name;

  console.log(fullName);

  console.log("🔹 Reached here -- 1");

  await runDockerContainer(repoName, branch, fullName);

  // Determine the target URL based on the app's host and port
  const targetUrl = `http://${repoName}-3:4000`; // Change this to your app's URL if different

  const appReady = await checkAppReady("http://localhost:4000"); // Check if the app is ready

  if (appReady) {
    // Start Puppeteer Browser
    console.log("🔹 Starting Puppeteer browser...");
    const { browser, page } = await startBrowserWithProxy();

    // Step 3: Once app is ready, start the ZAP container
    console.log("🔹 Starting ZAP container...");
    await runZapContainer(payload); // Ensure this starts the ZAP container

    // Step 4: Start ZAP scan after the app is ready and ZAP container is running
    console.log("🔹 Starting ZAP scan...");
    await startZapScan(targetUrl); // This starts the security scan

    console.log("✅ ZAP scan initiated after app setup.");

    // After the scan is complete, close the browser
    await closeBrowser();
  } else {
    console.error("❌ App was not ready in time. Aborting ZAP scan.");
  }

  console.log("✅ ZAP scan initiated after app setup.");
};
