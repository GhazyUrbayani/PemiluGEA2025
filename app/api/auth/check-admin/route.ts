import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { adminTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const adminSessionId = req.cookies.get("admin-session")?.value;
    const userRole = req.cookies.get("user-role")?.value;

    if (!adminSessionId || userRole !== "admin") {
      return NextResponse.json(
        { isAdmin: false, message: "Tidak ada session admin" },
        { status: 401 }
      );
    }

    const adminToken = await db.query.adminTokens.findFirst({
      where: eq(adminTokens.id, adminSessionId),
    });

    if (!adminToken || !adminToken.isActive) {
      const response = NextResponse.json(
        { isAdmin: false, message: "Session admin tidak valid atau tidak aktif" },
        { status: 401 }
      );
      
      response.cookies.delete("admin-session");
      response.cookies.delete("user-role");
      
      return response;
    }

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
