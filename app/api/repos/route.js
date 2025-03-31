import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Repo } from "@/models/repo";
import connectDB from "@/lib/mongodb";

export async function GET(req) {
  try {
    await connectDB();

    // Get the logged-in user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(session.user);

    // Fetch repos for this user
    const repos = await Repo.find({ user: session.user.githubId });

    return NextResponse.json({ repos }, { status: 200 });
  } catch (error) {
    console.error("Error fetching repos:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
