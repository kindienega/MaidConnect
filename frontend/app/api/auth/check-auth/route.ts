import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// Utility to wait for a given ms

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    let token;
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "");
    }

    if (!token) token = cookieStore.get("jwt")?.value;

    const response = await axiosInstance.get("/auth/check-auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = response.data.data.document;
    return Response.json({ user }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return Response.json(
      {
        status: "fail",
        message: "Authentication check failed",
        error: error.message,
        user: undefined,
      },
      { status: 500 }
    );
  }
}
