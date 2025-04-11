// import { spawn } from "child_process";

// export async function runZapContainer() {
//   const zapContainerName = "owasp-zap-container";
//   const zapPort = 8080; // ZAP API Port

//   // Run ZAP as a Docker container
//   const dockerCommand = [
//     "docker",
//     "run",
//     "--rm",
//     "-d",
//     "--name",
//     zapContainerName,
//     "-p",
//     `${zapPort}:${zapPort}`, // Expose ZAP API port
//     "owasp/zap2docker-stable", // ZAP Docker image
//     "zap-x.sh", // Start ZAP in daemon mode
//     "-daemon", // Run ZAP in background mode
//     "-port",
//     zapPort,
//   ];

//   console.log(
//     "🔹 Running ZAP Docker container with command:",
//     dockerCommand.join(" ")
//   );

//   const childProcess = spawn(dockerCommand[0], dockerCommand.slice(1), {
//     shell: false,
//     detached: true,
//     stdio: "inherit",
//   });

//   childProcess.unref();

//   childProcess.on("error", (err) => {
//     console.error("❌ Error starting ZAP container:", err);
//   });

//   childProcess.on("exit", (code, signal) => {
//     if (code) {
//       console.error(`❌ ZAP container exited with code ${code}`);
//     } else if (signal) {
//       console.error(`❌ ZAP container was terminated with signal ${signal}`);
//     }
//   });

//   console.log(`✅ ZAP container started at port ${zapPort}.`);
// }


import { spawn } from "child_process";

export async function runZapContainer() {
  const zapContainerName = "owasp-zap-container-1";
  const zapPort = 8080; // ZAP API port

  // Build the Docker command to run OWASP ZAP
  const dockerCommand = [
    "docker",
    "run",
    "--rm",
    "-d",
    "--name",
    zapContainerName,
    "-p",
    `${zapPort}:${zapPort}`, // Expose ZAP API port
    "ghcr.io/zaproxy/zaproxy", // ZAP Docker image
    "zap.sh", // Start ZAP normally (or use zap-x.sh for GUI, not needed in daemon)
    "-daemon", // Daemon mode
    "-port",
    `${zapPort}`, // Port for API access
    "-host",
    "0.0.0.0", // Make sure it binds to all interfaces
    "-config",
    "api.disablekey=true", // Optional: disable API key (for local testing only!)
    "-config api.allowRemote=true",
    "-config api.addrs.addr.name=.*",
    "-config api.addrs.addr.regex=true",
  ];

  console.log(
    "🔹 Running ZAP Docker container with command:",
    dockerCommand.join(" ")
  );

  const childProcess = spawn(dockerCommand[0], dockerCommand.slice(1), {
    shell: true,
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

  console.log(`✅ ZAP container started on port ${zapPort}.`);
}