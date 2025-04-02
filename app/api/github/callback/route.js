import { NextResponse } from "next/server";
import { Repo } from "@/models/repo";
import { User } from "@/models/user";
import connectDB from "@/lib/mongodb";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Add "/route"
import { getServerSession } from "next-auth";

// Function to generate JWT for GitHub App
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

// Function to get installation access token
const getInstallationToken = async (installationId) => {
  const jwt = generateAppJWT();

  console.log(jwt, "\n", installationId);

  const response = await axios.post(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "vapt-automation",
      },
    }
  );

  return response.data.token;
};

export async function GET(req) {
  try {
    await connectDB();

    // ✅ Get authenticated user session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const installationId = searchParams.get("installation_id");

    if (!installationId) {
      return NextResponse.json(
        { error: "No installation ID provided" },
        { status: 400 }
      );
    }

    // ✅ Get GitHub App installation access token
    const accessToken = await getInstallationToken(installationId);

    // ✅ Fetch repositories under this installation
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

    // ✅ Fetch user based on GitHub ID
    const user = await User.findOne({ githubId: session.user.githubId });

    // ✅ Save or update repositories
    for (const repo of repos) {
      await Repo.findOneAndUpdate(
        { repoId: repo.id },
        {
          user: user.githubId, // Reference using GitHub ID instead of ObjectId
          installationId,
          repoId: repo.id,
          name: repo.name,
          owner: repo.owner.login,
          private: repo.private,
          description: repo.description,
        },
        { upsert: true, new: true }
      );
    }

    console.log(session.user.githubId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Add installation ID if it doesn't exist
    if (!user.installations.includes(installationId)) {
      user.installations.push(installationId);
      await user.save();
    }

    // ✅ Redirect user to dashboard
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
      },
    });
  } catch (error) {
    console.error("GitHub Callback Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
