/**
 * API Route: /api/auth/login-token
 * 
 * Endpoint untuk validasi token dan login pemilih offline
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { voterRegistry } from "@/db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    // Validate input
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, message: "Token tidak valid" },
        { status: 400 }
      );
    }

    // Find voters with tokens in database
    const voters = await db.query.voterRegistry.findMany({
      where: eq(voterRegistry.voteMethod, "offline"),
    });

    // Check token against all voters using bcrypt compare
    let matchedVoter = null;
    for (const voter of voters) {
      if (voter.tokenHash) {
        const isMatch = await compare(token, voter.tokenHash);
        if (isMatch) {
          matchedVoter = voter;
          break;
        }
      }
    }

    if (!matchedVoter) {
      return NextResponse.json(
        { success: false, message: "Token tidak valid atau tidak ditemukan" },
        { status: 401 }
      );
    }

    // Check eligibility
    if (!matchedVoter.isEligible) {
      return NextResponse.json(
        { success: false, message: "Anda tidak memiliki hak untuk memilih" },
        { status: 403 }
      );
    }

    // Check if already voted
    if (matchedVoter.hasVoted) {
      return NextResponse.json(
        { success: false, message: "Token sudah digunakan untuk voting" },
        { status: 403 }
      );
    }

    // Create response with success
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      email: matchedVoter.email,
      nim: matchedVoter.nim,
    });

    // Set cookies for session
    response.cookies.set("voter-session", matchedVoter.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours
      path: "/",
    });

    response.cookies.set("vote-method", "offline", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Token login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
