import axiosInstance from "@/lib/axios";

export async function POST(request: Request) {
  try {
    console.log("Received request to reset password");
    const body = await request.json();
    console.log(body);

    const { id, token, password, passwordConfirm } = body;
    if (!id || !token || !password || !passwordConfirm) {
      return Response.json(
        {
          message: "All fields are required",
        },
        { status: 400 }
      );
    }
    const data = await fetch(`${process.env.BACKEND_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log(data);
    const result = await data.json();

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
          message: result.message || "Failed to reset password",
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
