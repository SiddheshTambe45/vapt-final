import fs from "fs";
import path from "path";

export async function GET(request) {
  // Log the full URL to see if the request URL is coming through correctly
  console.log("Request URL:", request.url);

  // Access the dynamic params directly from the request
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // Extract the ID from the URL path

  console.log("Extracted ID:", id);

  if (!id) {
    return new Response(JSON.stringify({ error: "Result ID is required" }), {
      status: 400,
    });
  }

  try {
    const resultsDir = path.join(process.cwd(), "results");
    const filePath = path.join(resultsDir, `${id}.json`);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8");
      return new Response(fileData, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: "Result not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error reading result file:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch result" }), {
      status: 500,
    });
  }
}
