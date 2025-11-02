import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("calling backend from property detail page api");
    const { id } = params;

    // Get token from cookies or Authorization header (same as check-auth)
    const cookieStore = cookies();
    let token;
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "");
    }

    if (!token) token = cookieStore.get("jwt")?.value;

    // Prepare headers for the backend request
    const headers: HeadersInit = {};

    // Add Authorization header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}/properties/${id}`, {
      headers,
      next: { revalidate: 0 }, // No cache - always fetch fresh data
    });
    console.log("calling backend");
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "Something went wrong!");
    }
    const { data } = await response.json();
    console.log(data);

    revalidatePath("/properties");
    revalidatePath("/");

    return Response.json(
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
    return Response.json(
      {
        status: "fail",
        message: "Failed to fetch property",
        error: error.message,
        property: null,
      },
      { status: 500 }
    );
  }
}
