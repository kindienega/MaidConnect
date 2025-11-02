import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Check if the request is FormData (file upload) or JSON
    const contentType = request.headers.get("content-type");
    let body;

    if (contentType && contentType.includes("multipart/form-data")) {
      // Handle FormData for file uploads
      body = await request.formData();
    } else {
      // Handle JSON data
      body = await request.json();
    }

    // Get token from cookies
    const cookieStore = cookies();
    let token = cookieStore.get("jwt")?.value;

    // If not in cookies, try to get from Authorization header (Telegram users)
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
      }
    }

    const response = await axiosInstance.post("/users/update-me", body, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(contentType &&
          contentType.includes("multipart/form-data") && {
            "Content-Type": "multipart/form-data",
          }),
      },
    });
    const updatedUser = response.data.data.document;
    return Response.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.log(error);
    const errorMessage =
      typeof error === "object" &&
      error &&
      "response" in error &&
      (error as any).response?.data?.message
        ? (error as any).response.data.message
        : "Failed to update profile data.! try again!.";
    const status =
      typeof error === "object" && error && "response" in error
        ? (error as any).response?.status
        : 500;

    return Response.json({ status: "fail", message: errorMessage }, { status });
  }
}
