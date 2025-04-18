import puppeteer from "puppeteer";

let browser = null;

/**
 * Launches a Puppeteer browser.
 */
export async function startBrowserWithProxy() {
  console.log("🧭 Launching Puppeteer browser...");

  const zapProxy = "http://localhost:8081"; // ZAP's proxy address

  browser = await puppeteer.launch({
    headless: true,
    args: [
      `--proxy-server=${zapProxy}`, // Route all traffic through ZAP
    ],
  });

  console.log("✅ Puppeteer browser launched.");

  const page = await browser.newPage();
  // Optionally set up some page actions here

  return { browser, page };
}

/**
 * Closes the Puppeteer browser instance.
 */
export async function closeBrowser() {
  if (!browser) {
    console.log("⚠️ Puppeteer browser already closed or never started.");
    return;
  }

  console.log("❌ Closing Puppeteer browser...");
  await browser.close();
  browser = null;
  console.log("✅ Puppeteer browser closed.");
}
