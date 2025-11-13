import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { candidates } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position"); // 'kahim' or 'senator'

    let query = db.select().from(candidates);

    if (position) {
      query = query.where(eq(candidates.position, position)) as any;
    }

    const data = await query;

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
