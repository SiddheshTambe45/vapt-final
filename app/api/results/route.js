import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const resultsDir = path.join(process.cwd(), "results");
    const files = fs.readdirSync(resultsDir);

    // Filter files starting with zap-scan- and ending with .json
    const resultFiles = files.filter(
      (file) => file.startsWith("zap-scan-") && file.endsWith(".json")
    );

    // Create an array of result objects with the ID being the file name (without extension)
    const results = resultFiles.map((file) => ({
      id: file.replace(".json", ""),
      filePath: path.join(resultsDir, file),
    }));

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error reading results folder:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch results" }), {
      status: 500,
    });
  }
}
