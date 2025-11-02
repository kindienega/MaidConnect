import { NextRequest, NextResponse } from "next/server";
import { requestPropertyEmailTemplate } from "./emailTemplate";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      propertyType,
      propertyPurpose,
      budgetMin,
      budgetMax,
      area,
      location,
      description,
    } = body;

    // Clean budget values by removing commas and converting to numbers
    const cleanBudgetMin = budgetMin
      ? parseInt(budgetMin.replace(/,/g, ""))
      : null;
    const cleanBudgetMax = budgetMax
      ? parseInt(budgetMax.replace(/,/g, ""))
      : null;

    if (
      !name ||
      !email ||
      !phone ||
      !propertyType ||
      !propertyPurpose ||
      !budgetMin ||
      !budgetMax ||
      !area ||
      !location
    ) {
      throw new Error("All fields are required expect desctiption");
    }

    const response = await fetch("https://api.sendinblue.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: "Addis Broker",
          email: process.env.SENDER_EMAIL,
        },
        to: [
          {
            email: process.env.SENDER_EMAIL,
            name: "Addis Broker Admin",
          },
          {
            email: process.env.SENDER_EMAIL2,
            name: "Addis Broker Admin",
          },
        ],
        replyTo: {
          email,
          name,
        },
        subject: `New Property Request: ${name} - ${propertyType}`,
        htmlContent: requestPropertyEmailTemplate({
          name,
          email,
          phone,
          propertyType,
          propertyPurpose,
          budgetMin,
          budgetMax,
          area,
          location,
          description,
        }),
      }),
    });

    const response2 = await fetch(
      `${process.env.BACKEND_URL}/property-requests`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...body,
          budgetMin: cleanBudgetMin,
          budgetMax: cleanBudgetMax,
        }),
      }
    );

    if (!response2.ok) {
      throw new Error("Failed to send property request to backend");
    }

    if (!response.ok) {
      console.log(response, process.env.BREVO_API_KEY);
      throw new Error("Failed to send email");
    }

    const data = await response.json();
    console.log(data, process.env.SENDER_EMAIL);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error sending property request email:", error);
    return NextResponse.json(
      { error: `Failed to send property request: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    const response = await fetch(`${BACKEND_URL}/property-requests`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("calling backend");
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "Something went wrong!");
    }
    const { data } = await response.json();

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
        message: "Failed to fetch properties",
        error: error.message,
        propertyRequests: undefined,
      },
      { status: 500 }
    );
  }
}

