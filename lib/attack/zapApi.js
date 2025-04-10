import axios from "axios";

// ZAP API URL (Docker container URL)
const ZAP_API_URL = "http://localhost:8080"; // ZAP is running on port 8080 in the Docker container

// Function to start the scan
export async function startZapScan(targetUrl) {
  try {
    // 1. Access the target URL using ZAP
    console.log(`🔹 Accessing the URL: ${targetUrl} through ZAP...`);
    await axios.get(
      `${ZAP_API_URL}/JSON/core/action/accessUrl/?url=${targetUrl}`
    );

    // 2. Start the active scan
    const response = await axios.get(
      `${ZAP_API_URL}/JSON/ascan/action/scan/?url=${targetUrl}`
    );
    const scanId = response.data.scan;
    console.log(`🚀 Scan started with ID: ${scanId}`);

    // 3. Poll for scan completion
    let status = 0;
    while (status < 100) {
      const scanStatus = await axios.get(
        `${ZAP_API_URL}/JSON/ascan/view/status/?scanId=${scanId}`
      );
      status = parseInt(scanStatus.data.status);
      console.log(`📊 Scan progress: ${status}%`);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
    }

    console.log(`✅ Scan completed for ${targetUrl}`);
  } catch (error) {
    console.error(`❌ Error running ZAP scan: ${error.message}`);
  }
}

// Main function to trigger ZAP scan
export async function run() {
  const targetUrl = "http://localhost:3000"; // Base URL of your main app (replace with your actual URL)

  await startZapScan(targetUrl);
}

// Execute the script
run().catch(console.error);
