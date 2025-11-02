import { create } from "zustand";
import { TelegramWebApp } from "@/types";
import { useAuthStore } from "./auth";

interface TelegramState {
  isInitialized: boolean;
  isInTelegram: boolean | undefined;
  isVerifying: boolean;
  webApp: TelegramWebApp | null;
  user: any;
  themeParams: any;
  viewportHeight: number;
  showBottomNav: boolean;

  initTelegram: () => void;
  verifyTelegramUser: () => Promise<void>;
  setShowBottomNav: (show: boolean) => void;
  hapticFeedback: (type: "light" | "medium" | "heavy") => void;
}

export const useTelegramStore = create<TelegramState>((set, get) => ({
  isInitialized: false,
  isInTelegram: undefined,
  isVerifying: false,
  webApp: null,
  user: null,
  themeParams: null,
  viewportHeight: 0,
  showBottomNav: false,

  initTelegram: async () => {
    const webApp = (await import("@twa-dev/sdk")).default;

    // Check if we're running in Telegram
    const isInTelegram = !!(webApp.initData && webApp.initDataUnsafe?.user);

    if (!isInTelegram) {
      console.warn("Not running inside Telegram.");
      set({ isInTelegram: false, isInitialized: true });
      return;
    }
    await useAuthStore.getState().logout();

    webApp.ready();
    webApp.expand();

    set({
      isInitialized: true,
      isInTelegram: true,
      webApp,
      user: webApp.initDataUnsafe.user,
      themeParams: webApp.themeParams,
      viewportHeight: webApp.viewportHeight,
      showBottomNav: !!webApp.initDataUnsafe.user,
    });

    await get().verifyTelegramUser();
    if (webApp.themeParams.bg_color) {
      document.documentElement.style.setProperty(
        "--telegram-bg",
        webApp.themeParams.bg_color
      );
    }
    if (webApp.themeParams.text_color) {
      document.documentElement.style.setProperty(
        "--telegram-text",
        webApp.themeParams.text_color
      );
    }
  },

  setShowBottomNav: (show: boolean) => {
    set({ showBottomNav: show });
  },

  verifyTelegramUser: async () => {
    const { webApp, isVerifying } = get();
    console.log(webApp?.initDataUnsafe);
    console.log(webApp?.initDataUnsafe?.start_param);
    console.log(window.location.search, window.location.hash);
    if (!webApp || isVerifying) return;
    set({ isVerifying: true });

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initData: webApp.initData,
        }),
      });
      const data = await response.json();
      set({
        user: data.user,
      });

      if (data.token) {
        localStorage.setItem("jwt", data.token);
        const token1 = localStorage.getItem("jwt");
        console.log(token1, "from clientadflasdfasdfasdf");
      }

      useAuthStore.setState({
        user: data.user,
        isTelegramUser: true,
        isAuthenticated: true,
      });
      console.log("data.user-cechhkkk telegram store", get().user);
    } catch (error) {
      console.error("Error verifying Telegram user:", error);
    } finally {
      set({ isVerifying: false });
    }
  },

  hapticFeedback: (type: "light" | "medium" | "heavy") => {
    const { webApp } = get();
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred(type);
    }
  },
}));
