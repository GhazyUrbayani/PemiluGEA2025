import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { voters } from "@/db/schema";
import { eq } from "drizzle-orm";
import { tokenValidationSchema } from "@/zod/vote";
import { isInvalidOfflineDate, isInvalidOnlineDate } from "@/lib/special-date";

export async function POST(request: NextRequest) {
  const reqFormData = await request.formData();
  const data = Object.fromEntries(reqFormData.entries());

  // Validate form data
  const zodParseResult = tokenValidationSchema.safeParse(data);
  if (!zodParseResult.success) {
    return NextResponse.json(
      {
        error: "Bad Request",
        message: zodParseResult.error.issues,
      },
      { status: 400 },
    );
  }

  // Desctructure form data
  const { token } = zodParseResult.data;

  // Check if token exists
  try {
    const result = await db
      .select()
      .from(voters)
      .where(eq(voters.token, token));

    if (result.length === 0) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Token tidak ditemukan",
        },
        { status: 404 },
      );
    }

    if (result[0].voteType === "unregistered") {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "Anda belum terdaftar untuk melakukan voting",
        },
        { status: 403 },
      );
    }

    if (result[0].voteStatus === "inactive") {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "Anda belum diizinkan untuk melakukan voting",
        },
        { status: 403 },
      );
    }

    if (result[0].voteStatus === "used") {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "Token sudah digunakan",
        },
        { status: 403 },
      );
    }

    // Validate Date For Voting
    const currentTime = Date.now();

    if (result[0].voteType === "online") {
      if (isInvalidOnlineDate(currentTime)) {
        return NextResponse.json(
          {
            error: "Forbidden",
            message: "Waktu voting invalid",
          },
          { status: 403 },
        );
      }

      return NextResponse.json(
        {
          message: "Token found",
        },
        { status: 201 },
      );
    }

    if (isInvalidOfflineDate(currentTime)) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "Waktu voting invalid",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        message: "Token found",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch token",
      },
      { status: 500 },
    );
  }
}
