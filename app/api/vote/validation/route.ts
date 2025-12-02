import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { voterRegistry } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let voterNim: string | undefined;
    let voterEmail: string | undefined;
    
    if (session?.user?.email) {
      voterEmail = session.user.email;
    } else {
      const voterSessionCookie = req.cookies.get("voter-session");
      voterNim = voterSessionCookie?.value;
    }
    
    if (!voterEmail && !voterNim) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Anda harus login terlebih dahulu",
        },
        { status: 401 },
      );
    }

    let voter;
    if (voterNim) {
      voter = await db
        .select()
        .from(voterRegistry)
        .where(eq(voterRegistry.nim, voterNim))
        .limit(1);
    } else if (voterEmail) {
      voter = await db
        .select()
        .from(voterRegistry)
        .where(eq(voterRegistry.email, voterEmail))
        .limit(1);
    }

    if (!voter || voter.length === 0) {
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
