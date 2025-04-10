import { NextResponse } from "next/server";

export async function POST(req, res) {
   
      console.log("🔹 Docker Response Received:", req.body);
      NextResponse.status(200).json({ message: "Response received successfully!" });
   
  }