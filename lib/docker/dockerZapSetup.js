import { spawn } from "child_process";

export async function runZapContainer() {
  const zapContainerName = "owasp-zap-container";
  const zapPort = 8080; // ZAP API Port

  // Run ZAP as a Docker container
  const dockerCommand = [
    "docker",
    "run",
    "--rm",
    "-d",
    "--name",
    zapContainerName,
    "-p",
    `${zapPort}:${zapPort}`, // Expose ZAP API port
    "owasp/zap2docker-stable", // ZAP Docker image
    "zap-x.sh", // Start ZAP in daemon mode
    "-daemon", // Run ZAP in background mode
    "-port",
    zapPort,
  ];

  console.log(
    "🔹 Running ZAP Docker container with command:",
    dockerCommand.join(" ")
  );

  const childProcess = spawn(dockerCommand[0], dockerCommand.slice(1), {
    shell: false,
    detached: true,
    stdio: "inherit",
  });

  childProcess.unref();

  childProcess.on("error", (err) => {
    console.error("❌ Error starting ZAP container:", err);
  });

  childProcess.on("exit", (code, signal) => {
    if (code) {
      console.error(`❌ ZAP container exited with code ${code}`);
    } else if (signal) {
      console.error(`❌ ZAP container was terminated with signal ${signal}`);
    }
  });

  console.log(`✅ ZAP container started at port ${zapPort}.`);
}
