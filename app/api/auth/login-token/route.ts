/**
 * API Route: /api/auth/login-token
 * 
 * Endpoint untuk validasi token dan login:
 * 1. Admin token (untuk akses hasil voting)
 * 2. Voter token (untuk pemilih offline)
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { voterRegistry, adminTokens } from "@/db/schema";
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

    // STEP 1: Check if token is an admin token
    const adminTokensList = await db.query.adminTokens.findMany({
      where: eq(adminTokens.isActive, true),
    });

    for (const adminToken of adminTokensList) {
      const isAdminMatch = await compare(token, adminToken.tokenHash);
      if (isAdminMatch) {
        // Update last used timestamp
        await db
          .update(adminTokens)
          .set({ lastUsedAt: new Date() })
          .where(eq(adminTokens.id, adminToken.id));

        // Create admin session response
        const response = NextResponse.json({
          success: true,
          message: "Login admin berhasil",
          role: "admin",
          name: adminToken.name,
        });

        // Set admin session cookies
        response.cookies.set("admin-session", adminToken.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 8, // 8 hours for admin
          path: "/",
        });

        response.cookies.set("user-role", "admin", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 8,
          path: "/",
        });

        return response;
      }
    }

    // STEP 2: Check if token is a voter token (offline voting)
    const voters = await db.query.voterRegistry.findMany({
      where: eq(voterRegistry.voteMethod, "offline"),
    });

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

    // Create voter session response
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      role: "voter",
      email: matchedVoter.email,
      nim: matchedVoter.nim,
    });

    // Set voter session cookies
    response.cookies.set("voter-session", matchedVoter.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours for voter
      path: "/",
    });

    response.cookies.set("vote-method", "offline", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2,
      path: "/",
    });

    response.cookies.set("user-role", "voter", {
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
