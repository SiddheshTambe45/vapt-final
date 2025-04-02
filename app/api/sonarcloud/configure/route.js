import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SonarProject } from "@/models/sonarProject";
import { Repo } from "@/models/repo";
import connectDB from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { repoId, projectKey, organization, apiToken } = await req.json();

    // Check if repo exists and belongs to the user
    const repo = await Repo.findOne({ repoId, user: session.user.githubId });
    if (!repo) {
      return NextResponse.json({ error: "Repo not found" }, { status: 404 });
    }

    // Create or update SonarProject
    const sonarProject = await SonarProject.findOneAndUpdate(
      { repo: repo._id },
      { projectKey, organization, apiToken },
      { upsert: true, new: true }
    );

    // Update repo with SonarProject ID
    repo.sonarProjectId = sonarProject._id;
    await repo.save();

    return NextResponse.json(
      { message: "SonarCloud linked successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving SonarCloud details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
