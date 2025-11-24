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
    // 1. Check authentication (NextAuth session OR cookie session)
    const session = await getServerSession(authOptions);
    let voterEmail: string | undefined;

    if (session?.user?.email) {
      // Online voter (SSO)
      voterEmail = session.user.email;
    } else {
      // Offline voter (Token) - check cookie
      const voterSessionCookie = req.cookies.get("voter-session");
      voterEmail = voterSessionCookie?.value;
    }

    if (!voterEmail) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    // ========================================
    // DUMMY MODE - Skip database check for dummy emails
    // ========================================
    const isDummyMode = voterEmail.includes("dummy_") && voterEmail.includes("@test.com");
    
    if (isDummyMode) {
      // Just log the vote data (don't save to DB)
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
    // ========================================
    // END DUMMY MODE
    // ========================================

    // 2. Check if voter exists and eligible
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

    // 3. Check if already voted
    if (voter[0].hasVoted) {
      return NextResponse.json(
        { error: "Anda sudah melakukan voting sebelumnya" },
        { status: 400 }
      );
    }

    // 4. Get ballot data from request
    const body = await req.json();
    const { ketuaUmum, senator } = body;

    if (!ketuaUmum || !senator || !Array.isArray(ketuaUmum) || !Array.isArray(senator)) {
      return NextResponse.json(
        { error: "Data suara tidak valid" },
        { status: 400 }
      );
    }

    // 5. Encrypt ballot data
    const ballotData = {
      ketuaUmum,
      senator,
    };

    const encryptedData = encryptBallot(ballotData);

    // 6. Start transaction: Insert ballot + Update voter
    await db.transaction(async (tx) => {
      // Insert encrypted ballot to ballot box (ANONYMOUS)
      await tx.insert(ballotBox).values({
        id: uuidv4(),
        encryptedBallotData: encryptedData,
        castAt: new Date(),
      });

      // Update voter registry - mark as voted and invalidate token
      await tx
        .update(voterRegistry)
        .set({
          hasVoted: true,
          tokenHash: null, // Invalidate token so it can't be reused
          updatedAt: new Date(),
        })
        .where(eq(voterRegistry.email, voterEmail));
    });

    // Create response with cleared cookies
    const response = NextResponse.json(
      {
        success: true,
        message: "Suara berhasil dicatat",
      },
      { status: 200 }
    );

    // Clear session cookies to invalidate the session
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
