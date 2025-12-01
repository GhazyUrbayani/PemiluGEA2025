import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/db/drizzle";
import { ballotBox, voterRegistry } from "@/db/schema";
import { eq } from "drizzle-orm";
import { encryptBallot } from "@/lib/encryption";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let voterEmail: string | undefined;

    if (session?.user?.email) {
      voterEmail = session.user.email;
    } else {
      const voterSessionCookie = req.cookies.get("voter-session");
      voterEmail = voterSessionCookie?.value;
    }

    if (!voterEmail) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    const isDummyMode = voterEmail.includes("dummy_") && voterEmail.includes("@test.com");
    
    if (isDummyMode) {
      const body = await req.json();
      console.log("DUMMY VOTE:", { voterEmail, vote: body });
      
      return NextResponse.json(
        {
          success: true,
          message: "Suara berhasil dicatat (DUMMY MODE)",
        },
        { status: 200 }
      );
    }

    const voter = await db
      .select()
      .from(voterRegistry)
      .where(eq(voterRegistry.email, voterEmail))
      .limit(1);

    if (!voter.length || !voter[0].isEligible) {
      return NextResponse.json(
        { error: "Anda tidak terdaftar dalam DPT" },
        { status: 403 }
      );
    }

    if (voter[0].hasVoted) {
      return NextResponse.json(
        { error: "Anda sudah melakukan voting sebelumnya" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { ketuaUmum, senator } = body;

    if (!ketuaUmum || !senator || !Array.isArray(ketuaUmum) || !Array.isArray(senator)) {
      return NextResponse.json(
        { error: "Data suara tidak valid" },
        { status: 400 }
      );
    }

    const ballotData = {
      ketuaUmum,
      senator,
    };

    const encryptedData = encryptBallot(ballotData);

    await db.transaction(async (tx) => {
      await tx.insert(ballotBox).values({
        id: uuidv4(),
        encryptedBallotData: encryptedData,
        castAt: new Date(),
      });

      await tx
        .update(voterRegistry)
        .set({
          hasVoted: true,
          tokenHash: null, // Invalidate token so it can't be reused
          updatedAt: new Date(),
        })
        .where(eq(voterRegistry.email, voterEmail));
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Suara berhasil dicatat",
      },
      { status: 200 }
    );

    response.cookies.set("voter-session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    response.cookies.set("vote-method", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Vote submission error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan suara" },
      { status: 500 }
    );
  }
}
