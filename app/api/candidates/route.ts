import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { candidates } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position"); // 'kahim' or 'senator'

    let data;

    if (position) {
      data = await db.select().from(candidates).where(eq(candidates.position, position));
    } else {
      data = await db.select().from(candidates);
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}
