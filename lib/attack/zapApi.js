import axios from "axios";
import fs from "fs";
import path from "path";

const ZAP_API_URL = "http://localhost:8080"; // From host to ZAP Docker
const SCAN_DELAY = 5000; // 5 seconds polling
const SITE_POLL_INTERVAL = 5000; // 5 seconds interval for site tree polling

// const waitForZapReady = async (zapUrl, timeout = 50000, interval = 2000) => {
//   const start = Date.now();

//   while (Date.now() - start < timeout) {
//     try {
//       const res = await axios.get(`${zapUrl}/JSON/core/view/version/`);
//       if (res.data && res.data.version) {
//         console.log("✅ ZAP is ready. Version:", res.data.version);
//         return true;
//       }
//     } catch {
//       console.log("⏳ Waiting for ZAP to be ready...");
//     }
//     await new Promise((r) => setTimeout(r, interval));
//   }

//   throw new Error("❌ Timed out waiting for ZAP to be ready.");
// };

// // AJAX Spider scan
// export async function startZapScan(targetUrl, attackPaths) {
//   try {
//     console.log("🔍 Waiting for ZAP to be ready...");
//     await waitForZapReady(ZAP_API_URL);

//     console.log(`⚡ Starting AJAX Spider scan for ${targetUrl}`);
//     await axios.get(
//       `${ZAP_API_URL}/JSON/ajaxSpider/action/scan/?url=${targetUrl}`
//     );

//     let ajaxStatus = "";
//     while (ajaxStatus !== "stopped") {
//       const res = await axios.get(
//         `${ZAP_API_URL}/JSON/ajaxSpider/view/status/`
//       );
//       ajaxStatus = res.data.status;
//       console.log(`🕸 AJAX Spider status: ${ajaxStatus}`);
//       await new Promise((r) => setTimeout(r, 2000));
//     }
//     console.log("✅ AJAX Spidering completed.");

//     // Log discovered URLs (optional but useful for debug)
//     const urlsResponse = await axios.get(`${ZAP_API_URL}/JSON/core/view/urls/`);
//     const urls = urlsResponse.data.urls;
//     console.log("🧭 Discovered URLs:");
//     urls.forEach((url, i) => console.log(`${i + 1}: ${url}`));

//     // Fetching site tree from ZAP after Spidering
//     console.log("🌐 Fetching site tree from ZAP...");
//     let sites = [];
//     let attempts = 0;

//     while (sites.length === 0 && attempts < 10) {
//       const sitesResponse = await axios.get(
//         `${ZAP_API_URL}/JSON/core/view/sites/`
//       );
//       sites = sitesResponse.data.sites;
//       console.log("🌐 Sites ZAP knows:", sites);

//       if (sites.length === 0) {
//         console.log("⏳ Waiting for site tree to populate...");
//         attempts++;
//         await new Promise((r) => setTimeout(r, SITE_POLL_INTERVAL));
//       }
//     }

//     if (sites.length === 0) {
//       throw new Error(`❌ No sites found in ZAP's site tree for ${targetUrl}`);
//     }

//     const matchingSite = sites.find((site) =>
//       site.includes(new URL(targetUrl).host)
//     );

//     if (!matchingSite) {
//       throw new Error(`❌ Site not found in ZAP's site tree for ${targetUrl}`);
//     }

//     console.log(`🎯 Found matching site: ${matchingSite}`);

//     // Active scan on paths
//     for (const path of attackPaths) {
//       console.log(`🚨 Attacking path: ${path}`);

//       const attackUrl = `${matchingSite}${path}`;
//       console.log(`Starting attack on: ${attackUrl}`);

//       const scanResponse = await axios.get(
//         `${ZAP_API_URL}/JSON/ascan/action/scan/?url=${attackUrl}`
//       );
//       const scanId = scanResponse.data.scan;

//       let scanStatus = 0;
//       while (scanStatus < 100) {
//         const res = await axios.get(
//           `${ZAP_API_URL}/JSON/ascan/view/status/?scanId=${scanId}`
//         );
//         scanStatus = parseInt(res.data.status);
//         console.log(`📊 Active scan progress on ${path}: ${scanStatus}%`);
//         await new Promise((r) => setTimeout(r, SCAN_DELAY));
//       }

//       console.log(`✅ Active scan completed for path ${path}.`);
//     }

//     // Fetch scan results
//     const alertsRes = await axios.get(`${ZAP_API_URL}/JSON/core/view/alerts/`);
//     const alerts = alertsRes.data.alerts;

//     console.log(`🚨 Found ${alerts.length} alert(s):`);
//     alerts.forEach((alert, idx) => {
//       console.log(`\n[#${idx + 1}] ${alert.alert}`);
//       console.log(`Risk: ${alert.risk}`);
//       console.log(`URL: ${alert.url}`);
//       console.log(`Description: ${alert.description}`);
//       console.log(`Solution: ${alert.solution}`);
//     });

//     console.log("✅ Scan results printed.");
//   } catch (error) {
//     console.error("❌ Error running ZAP scan:", {
//       message: error.message,
//       stack: error.stack,
//       response: error.response?.data,
//     });
//   }
// }

const waitForZapReady = async (zapUrl, timeout = 180000, interval = 2000) => {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      const res = await axios.get(`${zapUrl}/JSON/core/view/version/`);
      if (res.data && res.data.version) {
        console.log("✅ ZAP is ready. Version:", res.data.version);
        return true;
      }
    } catch {
      console.log("⏳ Waiting for ZAP to be ready...");
    }
    await new Promise((r) => setTimeout(r, interval));
  }

  throw new Error("❌ Timed out waiting for ZAP to be ready.");
};

// AJAX Spider scan
// export async function startZapScan(targetUrl) {
//   try {
//     console.log("🔍 Waiting for ZAP to be ready...");
//     await waitForZapReady(ZAP_API_URL);

//     console.log(`⚡ Starting AJAX Spider scan for ${targetUrl}`);
//     await axios.get(
//       `${ZAP_API_URL}/JSON/ajaxSpider/action/scan/?url=${targetUrl}`
//     );

//     let ajaxStatus = "";
//     while (ajaxStatus !== "stopped") {
//       const res = await axios.get(
//         `${ZAP_API_URL}/JSON/ajaxSpider/view/status/`
//       );
//       ajaxStatus = res.data.status;
//       console.log(`🕸 AJAX Spider status: ${ajaxStatus}`);
//       await new Promise((r) => setTimeout(r, 2000));
//     }
//     console.log("✅ AJAX Spidering completed.");

//     // Log discovered URLs (optional but useful for debug)
//     const urlsResponse = await axios.get(`${ZAP_API_URL}/JSON/core/view/urls/`);
//     const urls = urlsResponse.data.urls;
//     console.log("🧭 Discovered URLs:");
//     urls.forEach((url, i) => console.log(`${i + 1}: ${url}`));

//     // Fetching site tree from ZAP after Spidering
//     console.log("🌐 Fetching site tree from ZAP...");
//     let sites = [];
//     let attempts = 0;

//     while (sites.length === 0 && attempts < 10) {
//       const sitesResponse = await axios.get(
//         `${ZAP_API_URL}/JSON/core/view/sites/`
//       );
//       sites = sitesResponse.data.sites;
//       console.log("🌐 Sites ZAP knows:", sites);

//       if (sites.length === 0) {
//         console.log("⏳ Waiting for site tree to populate...");
//         attempts++;
//         await new Promise((r) => setTimeout(r, SITE_POLL_INTERVAL));
//       }
//     }

//     if (sites.length === 0) {
//       throw new Error(`❌ No sites found in ZAP's site tree for ${targetUrl}`);
//     }

//     const matchingSite = sites.find((site) =>
//       site.includes(new URL(targetUrl).host)
//     );

//     if (!matchingSite) {
//       throw new Error(`❌ Site not found in ZAP's site tree for ${targetUrl}`);
//     }

//     console.log(`🎯 Found matching site: ${matchingSite}`);

//     // Now, collect all paths (URLs) found during spidering
//     const attackPaths = urls
//       .filter((url) => url !== matchingSite) // Avoid the base URL itself
//       .map((url) => new URL(url).pathname); // Get the pathname part of each URL

//     console.log("🚨 Attack paths identified:", attackPaths);

//     // Active scan on paths
//     for (const path of attackPaths) {
//       console.log(`🚨 Attacking path: ${path}`);

//       const attackUrl = `${matchingSite}${path}`;
//       console.log(`Starting attack on: ${attackUrl}`);

//       const scanResponse = await axios.get(
//         `${ZAP_API_URL}/JSON/ascan/action/scan/?url=${attackUrl}`
//       );
//       const scanId = scanResponse.data.scan;

//       let scanStatus = 0;
//       while (scanStatus < 100) {
//         const res = await axios.get(
//           `${ZAP_API_URL}/JSON/ascan/view/status/?scanId=${scanId}`
//         );
//         scanStatus = parseInt(res.data.status);
//         console.log(`📊 Active scan progress on ${path}: ${scanStatus}%`);
//         await new Promise((r) => setTimeout(r, SCAN_DELAY));
//       }

//       console.log(`✅ Active scan completed for path ${path}.`);
//     }

//     // Fetch scan results
//     const alertsRes = await axios.get(`${ZAP_API_URL}/JSON/core/view/alerts/`);
//     const alerts = alertsRes.data.alerts;

//     console.log(`🚨 Found ${alerts.length} alert(s):`);
//     alerts.forEach((alert, idx) => {
//       console.log(`\n[#${idx + 1}] ${alert.alert}`);
//       console.log(`Risk: ${alert.risk}`);
//       console.log(`URL: ${alert.url}`);
//       console.log(`Description: ${alert.description}`);
//       console.log(`Solution: ${alert.solution}`);
//     });

//     console.log("✅ Scan results printed.");
//   } catch (error) {
//     console.error("❌ Error running ZAP scan:", {
//       message: error.message,
//       stack: error.stack,
//       response: error.response?.data,
//     });
//   }
// }

/*
export async function startZapScan(targetUrl) {
  try {
    console.log("🔍 Waiting for ZAP to be ready...");
    await waitForZapReady(ZAP_API_URL);

    console.log(`⚡ Starting AJAX Spider scan for ${targetUrl}`);
    await axios.get(
      `${ZAP_API_URL}/JSON/ajaxSpider/action/scan/?url=${targetUrl}`
    );

    let ajaxStatus = "";
    while (ajaxStatus !== "stopped") {
      const res = await axios.get(
        `${ZAP_API_URL}/JSON/ajaxSpider/view/status/`
      );
      ajaxStatus = res.data.status;
      console.log(`🕸 AJAX Spider status: ${ajaxStatus}`);
      await new Promise((r) => setTimeout(r, 2000));
    }
    console.log("✅ AJAX Spidering completed.");

    // Log discovered URLs
    const urlsResponse = await axios.get(`${ZAP_API_URL}/JSON/core/view/urls/`);
    const urls = urlsResponse.data.urls;
    console.log("🧭 Discovered URLs:");
    urls.forEach((url, i) => console.log(`${i + 1}: ${url}`));

    // Fetch site tree
    console.log("🌐 Fetching site tree from ZAP...");
    let sites = [];
    let attempts = 0;
    while (sites.length === 0 && attempts < 10) {
      const sitesResponse = await axios.get(
        `${ZAP_API_URL}/JSON/core/view/sites/`
      );
      sites = sitesResponse.data.sites;
      console.log("🌐 Sites ZAP knows:", sites);

      if (sites.length === 0) {
        console.log("⏳ Waiting for site tree to populate...");
        attempts++;
        await new Promise((r) => setTimeout(r, SITE_POLL_INTERVAL));
      }
    }

    if (sites.length === 0) {
      throw new Error(`❌ No sites found in ZAP's site tree for ${targetUrl}`);
    }

    const matchingSite = sites.find((site) =>
      site.includes(new URL(targetUrl).host)
    );

    if (!matchingSite) {
      throw new Error(`❌ Site not found in ZAP's site tree for ${targetUrl}`);
    }

    console.log(`🎯 Found matching site: ${matchingSite}`);

    // Identify attack paths
    const attackPaths = urls
      .filter((url) => url !== matchingSite)
      .map((url) => new URL(url).pathname);

    console.log("🚨 Attack paths identified:", attackPaths);

    const scanSessions = [];

    for (const path of attackPaths) {
      const attackUrl = `${matchingSite}${path}`;
      console.log(`🚨 Attacking path: ${path}`);
      console.log(`Starting attack on: ${attackUrl}`);

      try {
        const scanResponse = await axios.get(
          `${ZAP_API_URL}/JSON/ascan/action/scan/?url=${attackUrl}`
        );
        const scanId = scanResponse.data.scan;

        scanSessions.push({ path, scanId, url: attackUrl });

        let scanStatus = 0;
        while (scanStatus < 100) {
          const res = await axios.get(
            `${ZAP_API_URL}/JSON/ascan/view/status/?scanId=${scanId}`
          );
          scanStatus = parseInt(res.data.status);
          console.log(`📊 Active scan progress on ${path}: ${scanStatus}%`);
          await new Promise((r) => setTimeout(r, SCAN_DELAY));
        }

        console.log(`✅ Active scan completed for path ${path}.`);
      } catch (err) {
        console.error(`❌ Error scanning path ${path}:`, {
          message: err.message,
          response: err.response?.data,
        });
      }
    }

    // Fetch and print alerts per session
    for (const session of scanSessions) {
      const res = await axios.get(
        `${ZAP_API_URL}/JSON/core/view/alerts/?baseurl=${session.url}`
      );
      const alerts = res.data.alerts;

      console.log(`\n🔎 Alerts for [${session.path}] (${session.url}):`);
      if (alerts.length === 0) {
        console.log("✅ No alerts found.");
      }

      alerts.forEach((alert, idx) => {
        console.log(`[#${idx + 1}] ${alert.alert}`);
        console.log(`Risk: ${alert.risk}`);
        console.log(`URL: ${alert.url}`);
        console.log(`Description: ${alert.description}`);
        console.log(`Solution: ${alert.solution}`);
      });

      session.alerts = alerts;
    }

    console.log("✅ All scan sessions complete.");
    console.log("🧾 Full scan session log:");
    console.log(JSON.stringify(scanSessions, null, 2));
  } catch (error) {
    console.error("❌ Error running ZAP scan:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
  }
}
*/

export async function startZapScan(targetUrl) {
  try {
    console.log("🔍 Waiting for ZAP to be ready...");
    await waitForZapReady(ZAP_API_URL);

    console.log(`⚡ Starting AJAX Spider scan for ${targetUrl}`);
    await axios.get(
      `${ZAP_API_URL}/JSON/ajaxSpider/action/scan/?url=${targetUrl}`
    );

    let ajaxStatus = "";
    while (ajaxStatus !== "stopped") {
      const res = await axios.get(
        `${ZAP_API_URL}/JSON/ajaxSpider/view/status/`
      );
      ajaxStatus = res.data.status;
      console.log(`🕸 AJAX Spider status: ${ajaxStatus}`);
      await new Promise((r) => setTimeout(r, 2000));
    }
    console.log("✅ AJAX Spidering completed.");

    // Log discovered URLs
    const urlsResponse = await axios.get(`${ZAP_API_URL}/JSON/core/view/urls/`);
    const urls = urlsResponse.data.urls;
    console.log("🧭 Discovered URLs:");
    urls.forEach((url, i) => console.log(`${i + 1}: ${url}`));

    // Fetch site tree
    console.log("🌐 Fetching site tree from ZAP...");
    let sites = [];
    let attempts = 0;
    while (sites.length === 0 && attempts < 10) {
      const sitesResponse = await axios.get(
        `${ZAP_API_URL}/JSON/core/view/sites/`
      );
      sites = sitesResponse.data.sites;
      console.log("🌐 Sites ZAP knows:", sites);

      if (sites.length === 0) {
        console.log("⏳ Waiting for site tree to populate...");
        attempts++;
        await new Promise((r) => setTimeout(r, SITE_POLL_INTERVAL));
      }
    }

    if (sites.length === 0) {
      throw new Error(`❌ No sites found in ZAP's site tree for ${targetUrl}`);
    }

    const matchingSite = sites.find((site) =>
      site.includes(new URL(targetUrl).host)
    );

    if (!matchingSite) {
      throw new Error(`❌ Site not found in ZAP's site tree for ${targetUrl}`);
    }

    console.log(`🎯 Found matching site: ${matchingSite}`);

    // Identify and filter attack paths
    const attackPaths = urls
      .filter((url) => url !== matchingSite)
      .map((url) => new URL(url).pathname)
      .filter(
        (path, index, self) =>
          !path.startsWith("/_next") &&
          !path.startsWith("/static") &&
          !path.includes(".ico") &&
          self.indexOf(path) === index // remove duplicates
      );

    console.log("🚨 Filtered attack paths:", attackPaths);

    const scanSessions = [];

    for (const path of attackPaths) {
      const attackUrl = `${matchingSite}${path}`;
      console.log(`🚨 Attacking path: ${path}`);
      console.log(`Starting attack on: ${attackUrl}`);

      try {
        const scanResponse = await axios.get(
          `${ZAP_API_URL}/JSON/ascan/action/scan/?url=${attackUrl}`
        );
        const scanId = scanResponse.data.scan;

        scanSessions.push({ path, scanId, url: attackUrl });

        let scanStatus = 0;
        while (scanStatus < 100) {
          const res = await axios.get(
            `${ZAP_API_URL}/JSON/ascan/view/status/?scanId=${scanId}`
          );
          scanStatus = parseInt(res.data.status);
          console.log(`📊 Active scan progress on ${path}: ${scanStatus}%`);
          await new Promise((r) => setTimeout(r, SCAN_DELAY));
        }

        console.log(`✅ Active scan completed for path ${path}.`);
      } catch (err) {
        console.error(`❌ Error scanning path ${path}:`, {
          message: err.message,
          response: err.response?.data,
        });
      }
    }

    // Fetch and print alerts per session
    for (const session of scanSessions) {
      const res = await axios.get(
        `${ZAP_API_URL}/JSON/core/view/alerts/?baseurl=${session.url}`
      );
      const alerts = res.data.alerts;

      console.log(`\n🔎 Alerts for [${session.path}] (${session.url}):`);
      if (alerts.length === 0) {
        console.log("✅ No alerts found.");
      }

      alerts.forEach((alert, idx) => {
        console.log(`[#${idx + 1}] ${alert.alert}`);
        console.log(`Risk: ${alert.risk}`);
        console.log(`URL: ${alert.url}`);
        console.log(`Description: ${alert.description}`);
        console.log(`Solution: ${alert.solution}`);
      });

      session.alerts = alerts;
    }

    console.log("✅ All scan sessions complete.");
    console.log("🧾 Full scan session log:");
    console.log(JSON.stringify(scanSessions, null, 2));

    // Store result in results folder
    const resultsDir = path.join(process.cwd(), "results");
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const resultFilePath = path.join(resultsDir, `zap-scan-${timestamp}.json`);
    fs.writeFileSync(
      resultFilePath,
      JSON.stringify(scanSessions, null, 2),
      "utf-8"
    );

    console.log(`📝 Scan results saved to: ${resultFilePath}`);
  } catch (error) {
    console.error("❌ Error running ZAP scan:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
  }
}
