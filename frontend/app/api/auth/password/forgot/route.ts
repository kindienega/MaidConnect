import axiosInstance from "@/lib/axios";

export async function POST(request: Request) {
  try {
    console.log("Received request to forgot password");
    const body = await request.json();
    console.log(body);
    const data = await fetch(
      `${process.env.BACKEND_URL}/auth/get-password-reset-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const result = await data.json();
    console.log("Response status:", data.status);
    console.log("Response data:", result);

    if (data.ok)
      return Response.json(
        {
          message: result.message,
        },
        { status: 200 }
      );
    else
      return Response.json(
        {
          message: result.message || "Failed to send password reset email",
        },
        { status: 400 }
      );
  } catch (error) {
    return Response.json(
      {
        message:
          typeof error === "object" && error && "message" in error
            ? (error as any).message
            : "Authentication failed",
      },
      { status: 500 }
    );
  }
}
