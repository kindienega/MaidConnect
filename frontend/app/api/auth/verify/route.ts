// export const dynamic = "force-dynamic";

import axiosInstance from "@/lib/axios";

export async function POST(request: Request) {
  try {
    console.log("Received request to verify Telegram user");
    const body = await request.json();
    console.log(body);
    const result = await axiosInstance.post("/auth/verify-telegram-user", body);
    console.log(result);

    if (result.status === 200)
      return Response.json(
        {
          user: result.data.data.document,
          token: result.data.token,
          message: "Successfully authoriazed",
        },
        { status: 200 }
      );
    else
      return Response.json(
        {
          user: undefined,
          token: null,
          message: "Authentication failed",
        },
        { status: 400 }
      );
  } catch (error) {
    return Response.json(
      {
        user: null,
        token: null,
        message:
          typeof error === "object" && error && "message" in error
            ? (error as any).message
            : "Authentication failed",
      },
      { status: 500 }
    );
  }
}

