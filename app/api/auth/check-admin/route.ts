/**
 * API Route: /api/auth/check-admin
 * 
 * Endpoint untuk verifikasi apakah user saat ini adalah admin
 * berdasarkan cookie session
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { adminTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    // Get admin session cookie
    const adminSessionId = req.cookies.get("admin-session")?.value;
    const userRole = req.cookies.get("user-role")?.value;

    // Check if admin session exists
    if (!adminSessionId || userRole !== "admin") {
      return NextResponse.json(
        { isAdmin: false, message: "Tidak ada session admin" },
        { status: 401 }
      );
    }

    // Verify admin token still exists and active in database
    const adminToken = await db.query.adminTokens.findFirst({
      where: eq(adminTokens.id, adminSessionId),
    });

    if (!adminToken || !adminToken.isActive) {
      // Clear invalid cookies
      const response = NextResponse.json(
        { isAdmin: false, message: "Session admin tidak valid atau tidak aktif" },
        { status: 401 }
      );
      
      response.cookies.delete("admin-session");
      response.cookies.delete("user-role");
      
      return response;
    }

    // Admin verified
    return NextResponse.json({
      isAdmin: true,
      name: adminToken.name,
    });
  } catch (error) {
    console.error("Error checking admin auth:", error);
    return NextResponse.json(
      { isAdmin: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
