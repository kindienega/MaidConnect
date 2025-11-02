"use server";

import { cookies } from "next/headers";
import axiosInstance from "./axios";
import { User } from "@/types";

export async function signup(
  userData: FormData
): Promise<{ user: User | null; status: number; error?: any }> {
  try {
    const response = await axiosInstance.post("/auth/signup", userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const user = response.data.data.document;
    const setCookieHeader = response.headers["set-cookie"];
    const match = setCookieHeader?.[0]?.match(/jwt=([^;]+)/);
    const token = match?.[1];

    console.log(response);
    console.log(token);

    if (token) {
      // ✅ Manually set the cookie in the browser response
      cookies().set("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }
    return { user, status: 201 };
  } catch (error) {
    const errorMessage =
      typeof error === "object" &&
      error &&
      "response" in error &&
      (error as any).response?.data?.message
        ? (error as any).response.data.message
        : "Signup failed! Please try again later.";
    const status =
      typeof error === "object" && error && "response" in error
        ? (error as any).response?.status
        : 500;

    return {
      user: null,
      status,
      error: {
        message: errorMessage,
        status,
      },
    };
  }
}

export async function login(email: string, password: string) {
  // console.log(process.env.BACKEND_URL);

  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    const responseData = response.data;
    const user = responseData.data.document;

    // Add isTelegramUser flag if it exists in the response
    if (responseData.data.isTelegramUser !== undefined) {
      user.isTelegramUser = responseData.data.isTelegramUser;
    }

    console.log(user);

    // ✅ Check if cookies are in the response headers
    const setCookieHeader = response.headers["set-cookie"];
    const match = setCookieHeader?.[0]?.match(/jwt=([^;]+)/);
    const token = match?.[1];

    console.log(token);

    if (token) {
      // ✅ Manually set the cookie in the browser response
      cookies().set("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }
    return { user, status: 200 };
  } catch (error) {
    const errorMessage =
      typeof error === "object" &&
      error &&
      "response" in error &&
      (error as any).response?.data?.message
        ? (error as any).response.data.message
        : "Login failed! Please try again later.";
    const status =
      typeof error === "object" && error && "response" in error
        ? (error as any).response?.status
        : 500;

    return {
      user: null,
      status,
      error: {
        message: errorMessage,
        status,
      },
    };
    // throw customError;
  }
}

export async function logout() {
  console.log(process.env.BACKEND_URL, "from logoutoouuttt");

  const response = await axiosInstance.post("/auth/logout");
  const setCookieHeader = response.headers["set-cookie"];
  const match = setCookieHeader?.[0]?.match(/jwt=([^;]+)/);
  const token = match?.[1];
  if (token) {
    cookies().set("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 5, // 5 seconds
    });
  }
}

export async function verifyOtp(userId: string, otp: string) {
  const response = await axiosInstance.post(
    `/auth/verify-otp?id=${userId}&otp=${otp}`
  );

  const responseData = response.data;
  const user = responseData.data.document;

  // Add isTelegramUser flag if it exists in the response
  if (responseData.data.isTelegramUser !== undefined) {
    user.isTelegramUser = responseData.data.isTelegramUser;
  }

  console.log(user);

  // ✅ Check if cookies are in the response headers
  const setCookieHeader = response.headers["set-cookie"];
  const match = setCookieHeader?.[0]?.match(/jwt=([^;]+)/);
  const token = match?.[1];

  console.log(responseData, token);

  if (token) {
    // ✅ Manually set the cookie in the browser response
    cookies().set("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return user;
}
