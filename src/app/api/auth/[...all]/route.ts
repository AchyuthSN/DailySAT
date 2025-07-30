
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  // Dev bypass for Better Auth
  if (process.env.NODE_ENV === "development" && process.env.BETTER_AUTH_TOKEN) {
    return NextResponse.json({
      user: {
        name: "Better Dev",
        email: process.env.BETTER_AUTH_EMAIL || "dev@example.com",
        image: null,
      },
      cached: false,
    });
  }
  // Fallback to normal auth
  return toNextJsHandler(auth).GET(req);
};

export const POST = toNextJsHandler(auth).POST;