import { create } from "zustand";
import { User } from "@/types";
import {
  login as loginAction,
  logout as logoutAction,
  verifyOtp as verifyOtpAction,
  signup as signupAction,
} from "@/lib/actions";
import { useTelegramStore } from "./telegram";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean | undefined;
  isTelegramUser: boolean;
  telegramData: any;
  otpRequired: boolean;
  otpUserId: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ otpRequired: boolean; user?: User }>;
  verifyOtp: (userId: string, otp: string) => Promise<void>;
  signup: (userData: FormData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User> | FormData) => Promise<void>;
  setTelegramData: (data: any) => void;
  checkAuth: () => Promise<void>;
  upgradeToBroker: (userData: FormData) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: undefined,
  isTelegramUser: false,
  telegramData: null,
  otpRequired: false,
  otpUserId: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { user, error } = await loginAction(email, password);

      if (error) {
        throw new Error(error.message);
      }

      // Check if the response indicates OTP is required
      if (user && user.mfaEnabled) {
        set({
          otpRequired: true,
          otpUserId: user.id,
          isLoading: false,
          isTelegramUser: user.isTelegramUser || false,
        });
        return { otpRequired: true, user };
      } else {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          otpRequired: false,
          otpUserId: null,
          isTelegramUser: user.isTelegramUser || false,
        });
        return { otpRequired: false, user };
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  verifyOtp: async (userId: string, otp: string) => {
    set({ isLoading: true });
    try {
      const user = await verifyOtpAction(userId, otp);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        otpRequired: false,
        otpUserId: null,
        isTelegramUser: user.isTelegramUser || false,
      });
    } catch (error) {
      // Only reset loading state, keep other states persistent for retry
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (userData: FormData) => {
    set({ isLoading: true });
    try {
      const { user, error } = await signupAction(userData);
      if (error) {
        throw new Error(error.message);
      }
      set({
        user: user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isTelegramUser: false,
      telegramData: null,
      isLoading: false,
    });
    await logoutAction();

    // Optionally call API to clear the cookie
    // fetch("/api/auth/logout", { method: "POST" });
  },

  updateUser: async (userData: Partial<User> | FormData) => {
    console.log(userData, "form auth store");
    try {
      // Try to get token from localStorage (Telegram users)
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("jwt");
      }

      // Determine if it's FormData or JSON data
      const isFormData = userData instanceof FormData;

      const response = await fetch("/api/user/update", {
        method: "POST",
        body: isFormData ? userData : JSON.stringify(userData),
        credentials: "include", // for browser users (cookies)
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
              ...(isFormData ? {} : { "Content-Type": "application/json" }),
            }
          : isFormData
          ? {}
          : { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.log("errrrorrrrr before catch", errorBody);
        throw new Error(errorBody.message || "Failed to update user.");
      }

      const result = await response.json();
      console.log("result", result);
      const { user } = result;
      set({ user });
    } catch (error) {
      console.log(error, "from the store");
      throw error;
    }
  },

  setTelegramData: (data: any) => {
    set({
      telegramData: data,
      isTelegramUser: true,
    });
  },

  checkAuth: async () => {
    // set({ isLoading: true });
    try {
      const isInTelegram = useTelegramStore.getState().isInTelegram;
      if (isInTelegram === false) {
        const response = await fetch("/api/auth/check-auth", {
          credentials: "include", // Ensure cookies are sent
        });

        // check response
        if (response.ok) {
          const data = await response.json();
          set({
            user: data.user,
            isAuthenticated: true,
          });
        } else {
          get().logout();
        }
      } else if (isInTelegram === true) {
        console.log("we are not in telegram");
        const token = localStorage.getItem("jwt");
        const response = await fetch("/api/auth/check-auth", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        // await verifyTelegramUser();
        if (response.ok) {
          const data = await response.json();
          set({
            user: data.user,
            isAuthenticated: true,
            isTelegramUser: true,
          });
          useTelegramStore.setState({
            user: data.user,
          });
          console.log("data.user-cechhkkk auth store", get().user);
        } else {
          await get().logout();
        }
      }
    } catch (error) {
      await get().logout();
    }
  },

  upgradeToBroker: async (userData: FormData) => {
    console.log(userData, "form auth store upgrade to broker");
    try {
      // Try to get token from localStorage (Telegram users)
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("jwt");
      }

      const response = await fetch("/api/user/upgrade-to-broker", {
        method: "POST",
        body: userData,
        credentials: "include", // for browser users (cookies)
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.log("errrrorrrrr before catch", errorBody);
        throw new Error(
          errorBody.message || "Failed to upgrade user to broker."
        );
      }

      const result = await response.json();
      console.log("result", result);
      const { user } = result;
      set({ user });
    } catch (error) {
      console.log(error, "from the store");
      throw error;
    }
  },
  // checkAuth: async () => {
  //   // set({ isLoading: true });
  //   try {
  //     const isInTelegram = useTelegramStore.getState().isInTelegram;
  //     const verifyTelegramUser = useTelegramStore.getState().verifyTelegramUser;
  //     const telegramUser = useTelegramStore.getState().user;
  //     const user = useTelegramStore.getState().user;

  //     if (!isInTelegram) {
  //       const response = await fetch("/api/auth/check-auth", {
  //         credentials: "include", // Ensure cookies are sent
  //       });

  //       // check response
  //       if (response.ok) {
  //         const data = await response.json();
  //         set({
  //           user: data.user,
  //           isAuthenticated: true,
  //         });
  //       } else {
  //         get().logout();
  //       }
  //     } else {
  //       console.log("we are not in telegram");
  //       await verifyTelegramUser();

  //       if (telegramUser) {
  //         set({
  //           isAuthenticated: true,
  //           isTelegramUser: true,
  //         });
  //       } else {
  //         await get().logout();
  //       }
  //     }
  //   } catch (error) {
  //     await get().logout();
  //   }
  // },
}));
