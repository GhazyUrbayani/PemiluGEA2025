import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { voterRegistry } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Anda harus login terlebih dahulu",
        },
        { status: 401 },
      );
    }

    const email = session.user.email;

    const voter = await db
      .select()
      .from(voterRegistry)
      .where(eq(voterRegistry.email, email))
      .limit(1);

    if (voter.length === 0) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Email tidak terdaftar di DPT",
        },
        { status: 404 },
      );
    }

    const voterData = voter[0];

    if (!voterData.isEligible) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "Anda tidak memenuhi syarat untuk voting",
        },
        { status: 403 },
      );
    }

    if (voterData.hasVoted) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "Anda sudah melakukan voting sebelumnya",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Validasi berhasil, silakan lanjutkan voting",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Vote validation error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Terjadi kesalahan saat validasi",
      },
      { status: 500 },
    );
  }
}
