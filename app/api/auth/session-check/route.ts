import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const voterSession = cookieStore.get("voter-session");
    const voteMethod = cookieStore.get("vote-method");

    if (voterSession && voteMethod?.value === "offline") {
      // Offline user session is considered valid if cookies exist
      return NextResponse.json({
        success: true,
        isAuthenticated: true,
        email: voterSession.value,
        method: "offline",
      });
    }

    // If no relevant cookies, session is not for an offline voter
    return NextResponse.json({ success: true, isAuthenticated: false });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
