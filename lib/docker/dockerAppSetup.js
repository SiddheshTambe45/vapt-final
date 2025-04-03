"use server";

// import { spawn } from "child_process"; // For running shell commands (Docker commands)

// export const triggerDockerAppSetup = async (payload) => {
//   const repoName = payload.repository.name;
//   const branch = payload.ref.split("/").pop(); // Get the branch name from the ref

//   // Prepare the Docker run script
//   const script = `
//     #!/bin/bash
//     git clone https://github.com/${payload.repository.full_name}.git
//     cd ${repoName}
//     git checkout ${branch}
//     npm install
//     # Start the app
//     npm start
//   `;

//   // Write script to a file or run directly using Docker
//   runDockerContainer(script, repoName);
// };

// // Run Docker container to execute the script
// function runDockerContainer(script, repoName) {
//   // Save the script to a temporary file
//   const tmpFile = `/tmp/run_${repoName}.sh`;
//   const fs = require("fs");
//   fs.writeFileSync(tmpFile, script);

//   // Run the Docker container in the background
//   const dockerCommand = `docker run --rm -v ${tmpFile}:/script.sh node:16 /bin/bash /script.sh`;

//   const process = spawn(dockerCommand, {
//     shell: true,
//     detached: true,
//     stdio: "ignore", // Ignore input/output to avoid blocking
//   });

//   process.unref(); // Ensure it runs in the background
// }

// ---------------------------------------

// import { spawn } from "child_process"; // For running shell commands (Docker commands)
// import fs from "fs";
// import path from "path";

// // Update the tmpFile path to be in the root of the project
// export const triggerDockerAppSetup = async (payload) => {
//   const repoName = payload.repository.name;
//   const branch = payload.ref.split("/").pop(); // Get the branch name from the ref

//   // Prepare the Docker run script
//   const script = `
//     #!/bin/bash
//     git clone https://github.com/${payload.repository.full_name}.git
//     cd ${repoName}
//     git checkout ${branch}
//     npm install
//     # Start the app
//     npm start
//   `;

//   console.log("reached here -- 1");

//   // Get the current working directory of the project (root of your project)
//   const projectRoot = process.cwd();
//   const tmpFile = path.join(projectRoot, `run_${repoName}.sh`); // Create the script in project root

//   fs.writeFileSync(tmpFile, script);

//   console.log("reached here -- 2");

//   // Run the Docker container in the background
//   runDockerContainer(tmpFile, repoName);
// };

// // Run Docker container to execute the script
// async function runDockerContainer(script, repoName) {
//   console.log("reached here -- 3");

//   // Ensure that the path is correct for Windows
//   const dockerCommand = `docker run --rm -v ${script}:/script.sh node:16 /bin/bash /script.sh`;

//   console.log("reached here -- 4");

//   const process = spawn(dockerCommand, {
//     shell: true,
//     detached: true,
//     stdio: "ignore", // Ignore input/output to avoid blocking
//   });

//   console.log("reached here -- 5");

//   process.unref(); // Ensure it runs in the background

//   // Handle errors or output from the process
//   process.on("error", (err) => {
//     console.error("Error executing Docker command:", err);
//   });

//   process.on("exit", (code, signal) => {
//     if (code) {
//       console.error(`Docker process exited with code ${code}`);
//     } else if (signal) {
//       console.error(`Docker process was terminated with signal ${signal}`);
//     }
//   });
// }

// ----------------------------------------------------

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runDockerContainer(repoName, branch, fullName) {
  console.log("🔹 Reached here -- 2");

  let repoPath = path.resolve(process.cwd(), repoName);
  console.log(`📂 Original repo path: ${repoPath}`);

  // ✅ Convert Windows path to Docker-compatible format
  repoPath = repoPath.replace(/\\/g, "/").replace(/^([A-Za-z]):/, "/$1");
  console.log(`📂 Converted repo path: ${repoPath}`);

  /*
  const dockerCommand = [
    "docker",
    "run",
    "--rm",
    "-d",
    "--name",
    repoName,
    "-v",
    `${repoPath}:/app`,
    "-w",
    "/app",
    "node:18",
    "bash",
    "-c",
    "if [ ! -d '/app/.git' ]; then git clone https://github.com/" +
      fullName +
      ".git /app; fi; cd /app; git fetch origin; git checkout " +
      branch +
      "; npm install --legacy-peer-deps; npm start; tail -f /dev/null",
  ];
  */

  const dockerCommand = [
    "docker",
    "run",
    "--rm",
    "-d",
    "--name",
    repoName,
    "-v",
    `${repoPath}:/app`,
    "-w",
    "/app",
    "node:18",
    "bash",
    "-c",
    `
      if [ ! -d "/app/.git" ]; then 
        echo "🔄 Cloning repository..."; 
        git clone https://github.com/${fullName}.git /app; 
      else 
        cd /app && echo "🔄 Resetting repo..."; 
        git reset --hard HEAD && git pull; 
      fi;
      
      cd /app;
      echo "🚀 Checking out branch ${branch}";
      git checkout ${branch};
  
      echo "📦 Running npm install...";
      npm install --legacy-peer-deps;
  
      echo "✅ Starting application...";
      npm run build;
      npm start;
  
      tail -f /dev/null
    `,
  ];

  console.log("🔹 Running Docker command:");
  console.log(dockerCommand.join(" "));

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

export const triggerDockerAppSetup = async (payload) => {
  const repoName = payload.repository.name;
  const branch = payload.ref.split("/").pop();
  const fullName = payload.repository.full_name;

  console.log("🔹 Reached here -- 1");

  await runDockerContainer(repoName, branch, fullName);
};


// --------------------------

// import { spawn } from "child_process";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// async function sendErrorToAPI(repoName, branch, errorMsg) {
//   try {
//     await fetch("https://infinite-overly-bug.ngrok-free.app/api/docker/response", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ repo: repoName, branch, error: errorMsg }),
//     });
//     console.log("📤 Sent error report to API.");
//   } catch (err) {
//     console.error("❌ Failed to send error report:", err);
//   }
// }

// export async function runDockerContainer(repoName, branch, fullName) {
//   console.log("🔹 Reached here -- 2");

//   let repoPath = path.resolve(process.cwd(), repoName);
//   console.log(`📂 Original repo path: ${repoPath}`);

//   // ✅ Convert Windows path to Docker-compatible format
//   repoPath = repoPath.replace(/\\/g, "/").replace(/^([A-Za-z]):/, "/$1");
//   console.log(`📂 Converted repo path: ${repoPath}`);

//   const dockerCommand = [
//     "docker",
//     "run",
//     "--rm",
//     "-d",
//     "--name",
//     repoName,
//     "-v",
//     `${repoPath}:/app`,
//     "-w",
//     "/app",
//     "node:18",
//     "bash",
//     "-c",
//     `
//       if [ ! -d "/app/.git" ]; then 
//         echo "🔄 Cloning repository..."; 
//         git clone https://github.com/${fullName}.git /app || {
//           echo "❌ Failed to clone repository.";
//           curl -X POST -H "Content-Type: application/json" -d '{"repo": "${repoName}", "branch": "${branch}", "error": "Failed to clone repository"}' http://host.docker.internal:3000/api/docker/response;
//           exit 1;
//         }
//       else 
//         cd /app && echo "🔄 Resetting repo..."; 
//         git reset --hard HEAD && git pull; 
//       fi;
      
//       cd /app;
//       echo "🚀 Checking out branch ${branch}";
//       git checkout ${branch} || {
//         echo "❌ Branch ${branch} not found.";
//         curl -X POST -H "Content-Type: application/json" -d '{"repo": "${repoName}", "branch": "${branch}", "error": "Branch not found"}' http://host.docker.internal:3000/api/docker/response;
//         exit 1;
//       }

//       echo "📦 Running npm install...";
//       npm install --legacy-peer-deps || {
//         echo "❌ npm install failed.";
//         curl -X POST -H "Content-Type: application/json" -d '{"repo": "${repoName}", "branch": "${branch}", "error": "npm install failed"}' http://host.docker.internal:3000/api/docker/response;
//         exit 1;
//       }

//       echo "🛠 Checking for syntax errors...";
//       node -c index.js || {
//         echo "❌ Syntax error detected.";
//         curl -X POST -H "Content-Type: application/json" -d '{"repo": "${repoName}", "branch": "${branch}", "error": "Syntax error detected"}' http://host.docker.internal:3000/api/docker/response;
//         exit 1;
//       }

//       echo "✅ Starting application...";
//       npm start || {
//         echo "❌ Application failed to start.";
//         curl -X POST -H "Content-Type: application/json" -d '{"repo": "${repoName}", "branch": "${branch}", "error": "Application failed to start"}' http://host.docker.internal:3000/api/docker/response;
//         exit 1;
//       }

//       tail -f /dev/null
//     `,
//   ];

//   console.log("🔹 Running Docker command:");
//   console.log(dockerCommand.join(" "));

//   const childProcess = spawn(dockerCommand[0], dockerCommand.slice(1), {
//     shell: false,
//     detached: true,
//     stdio: "inherit", // ✅ Ensures logs are visible
//   });

//   console.log("🔹 Reached here -- 3");

//   childProcess.unref();

//   childProcess.on("error", async (err) => {
//     console.error("❌ Error executing Docker command:", err);
//     await sendErrorToAPI(repoName, branch, err.message);
//   });

//   childProcess.on("exit", async (code, signal) => {
//     if (code) {
//       console.error(`❌ Docker process exited with code ${code}`);
//       await sendErrorToAPI(`repoName, branch, Exited with code ${code}`);
//     } else if (signal) {
//       console.error(`❌ Docker process was terminated with signal ${signal}`);
//       await sendErrorToAPI(repoName, branch,` Terminated with signal ${signal}`);
//     }
//   });

//   console.log(`
//     ✅ Container '${repoName}' started. Use 'docker ps' to check running containers.
//  ` );
// }

// export const triggerDockerAppSetup = async (payload) => {
//   const repoName = payload.repository.name;
//   const branch = payload.ref.split("/").pop();
//   const fullName = payload.repository.full_name;

//   console.log("🔹 Reached here -- 1");

//   await runDockerContainer(repoName, branch, fullName);
// };