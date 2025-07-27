import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("DailySAT");
  const collection = db.collection("userProgress");

  const userId = "defaultUser"; // Replace with real user auth later
  const progress = await collection.findOne({ userId }) || {
    userId,
    completedSubtopics: [],
    completedDetails: {},
  };

  return NextResponse.json(progress);
}

export async function POST(req: Request) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("DailySAT");
  const collection = db.collection("userProgress");

  const userId = "defaultUser";
  const { completedSubtopics, completedDetails } = body;

  await collection.updateOne(
    { userId },
    {
      $set: {
        completedSubtopics,
        completedDetails,
      },
    },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}