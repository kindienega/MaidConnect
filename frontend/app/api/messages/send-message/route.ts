import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    let body;

    if (contentType && contentType.includes("multipart/form-data")) {
      // Handle FormData for file uploads
      body = await request.formData();
    } else {
      // Handle JSON data
      body = await request.json();
    }

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
      "calling backend from messages api sending messages, token",
      token
    );

    const response = await fetch(`${BACKEND_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

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
        message: "Failed to send Messages",
        error: error.message,
        messages: undefined,
      },
      { status: 500 }
    );
  }
}
