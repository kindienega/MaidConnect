import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    let token = cookieStore.get("jwt")?.value;

    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log(
      "calling backend from messages api getting messages, token",
      token
    );

    const response = await fetch(
      `${BACKEND_URL}/messages/chat-with/${params.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("calling backend");
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "Something went wrong!");
    }
    const { data } = await response.json();
    // rebuilding
    return NextResponse.json(
      { data },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        status: "fail",
        message: "Failed to fetch Messages",
        error: error.message,
        messages: undefined,
      },
      { status: 500 }
    );
  }
}
