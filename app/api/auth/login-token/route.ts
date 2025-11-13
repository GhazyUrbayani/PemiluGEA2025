import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { voterRegistry } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * API Route: POST /api/auth/login-token
 * 
 * Endpoint untuk validasi token offline voter.
 * 
 * Request Body:
 * - token: string (token yang dimasukkan pemilih)
 * 
 * Response:
 * - 200: Token valid, pemilih belum voting
 * - 400: Bad request (token kosong)
 * - 401: Token tidak valid atau sudah digunakan
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { token } = body;

    // Validasi input
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { message: "Token tidak valid" },
        { status: 400 }
      );
    }

    // ========================================
    // DUMMY TOKEN HARDCODE - HAPUS NANTI!
    // ========================================
    const DUMMY_TOKENS = ["TESTTOKEN123", "DUMMYTOKEN456", "DEVTOKEN789"];
    
    if (DUMMY_TOKENS.includes(token.toUpperCase())) {
      // Bypass database check for dummy tokens
      const dummyEmail = `dummy_${token.toLowerCase()}@test.com`;
      
      const response = NextResponse.json(
        {
          message: "Token valid (DUMMY MODE)",
          voter: {
            email: dummyEmail,
            voteMethod: "offline",
          },
        },
        { status: 200 }
      );

      response.cookies.set("voter-session", dummyEmail, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 jam
        path: "/",
      });

      response.cookies.set("vote-method", "offline", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60,
        path: "/",
      });

      return response;
    }
    // ========================================
    // END DUMMY TOKEN
    // ========================================

    // Cari voter dengan token hash yang cocok di database
    // PENTING: Token disimpan dalam bentuk hash di database untuk keamanan
    const voters = await db
      .select()
      .from(voterRegistry)
      .where(eq(voterRegistry.tokenHash, token))
      .limit(1);

    // Jika tidak ada voter dengan token tersebut
    if (voters.length === 0) {
      return NextResponse.json(
        { message: "Token tidak ditemukan atau tidak valid" },
        { status: 401 }
      );
    }

    const voter = voters[0];

    // Cek apakah voter eligible untuk memilih
    if (!voter.isEligible) {
      return NextResponse.json(
        { message: "Anda tidak terdaftar dalam Daftar Pemilih Tetap (DPT)" },
        { status: 401 }
      );
    }

    // Cek apakah voter sudah memilih
    if (voter.hasVoted) {
      return NextResponse.json(
        { message: "Token ini sudah digunakan untuk memilih" },
        { status: 401 }
      );
    }

    // Token valid dan belum digunakan
    // Set session cookie atau JWT untuk tracking di voting page
    const response = NextResponse.json(
      {
        message: "Token valid",
        voter: {
          email: voter.email,
          voteMethod: "offline",
        },
      },
      { status: 200 }
    );

    // Set cookie untuk session management
    // Cookie ini akan digunakan di /vote page untuk verifikasi
    response.cookies.set("voter-session", voter.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 jam
      path: "/",
    });

    response.cookies.set("vote-method", "offline", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error di /api/auth/login-token:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
