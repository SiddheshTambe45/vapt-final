// import { NextResponse } from "next/server";
// import { User } from "@/models/user";
// import { Repo } from "@/models/repo";
// import connectDB from "@/lib/mongodb";
// import axios from "axios";
// import jwt from "jsonwebtoken";

// // Generate GitHub App JWT
// const generateAppJWT = () => {
//   const payload = {
//     iat: Math.floor(Date.now() / 1000),
//     exp: Math.floor(Date.now() / 1000) + 600,
//     iss: process.env.GITHUB_APP_ID,
//   };

//   return jwt.sign(
//     payload,
//     process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n"),
//     { algorithm: "RS256" }
//   );
// };

// // Get installation token
// const getInstallationToken = async (installationId) => {
//   const jwt = generateAppJWT();

//   const response = await axios.post(
//     `https://api.github.com/app/installations/${installationId}/access_tokens`,
//     {},
//     {
//       headers: {
//         Authorization: `Bearer ${jwt}`,
//         Accept: "application/vnd.github+json",
//         "User-Agent": "vapt-automation",
//       },
//     }
//   );

//   return response.data.token;
// };

// export async function GET(req) {
//   try {
//     await connectDB();

//     // Get user (assuming authentication is handled)
//     const user = await User.findOne(); // Replace with actual user query

//     if (!user || !user.installations.length) {
//       return NextResponse.json(
//         { error: "No installations found for user" },
//         { status: 400 }
//       );
//     }

//     const installationId = user.installations[0]; // Get the first installation ID

//     // Get GitHub App access token
//     const accessToken = await getInstallationToken(installationId);

//     // Fetch repositories
//     const { data: reposData } = await axios.get(
//       "https://api.github.com/installation/repositories",
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           Accept: "application/vnd.github+json",
//         },
//       }
//     );

//     if (!reposData.repositories.length) {
//       return NextResponse.json(
//         { error: "No repositories found" },
//         { status: 404 }
//       );
//     }

//     const repo = reposData.repositories[0]; // Fetch the first repo

//     // Fetch package.json or README.md
//     const filePath = "package.json"; // Change to "README.md" if needed
//     const { data: fileData } = await axios.get(
//       `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/${filePath}`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           Accept: "application/vnd.github.raw+json",
//         },
//       }
//     );

//     const fileContent = Buffer.from(fileData.content, "base64").toString(
//       "utf-8"
//     );

//     return NextResponse.json({ content: fileContent });
//   } catch (error) {
//     console.error("Error fetching repo file:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// ---------------------------------------

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Add "/route"
import { User } from "@/models/user";
import { Repo } from "@/models/repo";
import connectDB from "@/lib/mongodb";
import axios from "axios";
import jwt from "jsonwebtoken";

const generateAppJWT = () => {
  const payload = {
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 600,
    iss: process.env.GITHUB_APP_ID,
  };

  return jwt.sign(
    payload,
    process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n"),
    { algorithm: "RS256" }
  );
};

const getInstallationToken = async (installationId) => {
  const jwt = generateAppJWT();

  const response = await axios.post(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  return response.data.token;
};

export async function GET(req) {
  try {
    await connectDB(); // Connect to MongoDB

    // ✅ Get authenticated user session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Find user in MongoDB
    const user = await User.findOne({ githubId: session.user.githubId });

    if (!user || !user.installations.length) {
      return NextResponse.json(
        { error: "No installations found for user" },
        { status: 400 }
      );
    }

    // ✅ Get installation ID
    const installationId = user.installations[0];

    // ✅ Get installation access token
    const accessToken = await getInstallationToken(installationId);

    // ✅ Get user's repositories
    const reposResponse = await axios.get(
      "https://api.github.com/installation/repositories",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const repos = reposResponse.data.repositories;
    if (!repos.length) {
      return NextResponse.json(
        { error: "No repositories found" },
        { status: 404 }
      );
    }

    // ✅ Fetch the first repo (Modify as needed)
    const repo = repos[0];
    const repoOwner = repo.owner.login;
    const repoName = repo.name;

    // ✅ Try to fetch package.json or README.md
    let fileResponse;
    const possibleFiles = ["package.json", "README.md"];

    for (const file of possibleFiles) {
      try {
        fileResponse = await axios.get(
          `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${file}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/vnd.github+json",
            },
          }
        );
        if (fileResponse.data) break; // Stop if file is found
      } catch (error) {
        console.log(`File ${file} not found in ${repoName}`);
      }
    }

    if (!fileResponse || !fileResponse.data.content) {
      return NextResponse.json(
        { error: "No package.json or README.md found" },
        { status: 404 }
      );
    }

    // ✅ Decode base64 content
    const fileContent = Buffer.from(
      fileResponse.data.content,
      "base64"
    ).toString("utf-8");

    // ✅ Send file content to frontend
    return NextResponse.json({ content: fileContent }, { status: 200 });
  } catch (error) {
    console.error("Error fetching repo file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
