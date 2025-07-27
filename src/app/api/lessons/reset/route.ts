import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST() {
  const client = await clientPromise;
  const db = client.db("DailySAT");
  const collection = db.collection("userProgress");

  const userId = "defaultUser";
  await collection.updateOne(
    { userId },
    {
      $set: {
        completedSubtopics: [],
        completedDetails: {},
      },
    },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}