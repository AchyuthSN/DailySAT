
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { handleGetSession } from "@/lib/auth/authActions";
import { handleGetUser } from "@/lib/auth/getUser";


export async function GET() {
  const session = await handleGetSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const user = await handleGetUser(session);
  const client = await clientPromise;
  const db = client.db("DailySAT");
  const collection = db.collection("userProgress");

  const userId = user?.email;
  const progress = await collection.findOne({ userId }) || {
    userId,
    completedSubtopics: [],
    completedDetails: {},
  };

  return NextResponse.json(progress);
}


export async function POST(req: Request) {
  const session = await handleGetSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const user = await handleGetUser(session);
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("DailySAT");
  const collection = db.collection("userProgress");

  const userId = user?.email;
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