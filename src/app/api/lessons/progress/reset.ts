import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { handleGetSession } from "@/lib/auth/authActions";
import { handleGetUser } from "@/lib/auth/getUser";

export async function POST() {
  const session = await handleGetSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const user = await handleGetUser(session);
  const client = await clientPromise;
  const db = client.db("DailySAT");
  const collection = db.collection("userProgress");


  await collection.updateOne(
    { userId: user?.email ?? "unknown" },
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
