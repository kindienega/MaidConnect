// app/components/ClientInit.tsx
"use client";

import { useEffect, useState } from "react";
import { useTelegramStore } from "@/store/telegram";
import { useAuthStore } from "@/store/auth"; // Import auth store
import { TelegramLoader } from "@/components/ui/telegram-loader";

export function ClientInit() {
  const { isInitialized, isInTelegram, initTelegram } = useTelegramStore();
  const { checkAuth } = useAuthStore(); // Get checkAuth
  const [showLoader, setShowLoader] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (isInTelegram === undefined && !isInitialized) {
      initTelegram();
    }
  }, [isInTelegram, isInitialized, initTelegram]);

  useEffect(() => {
    if (
      isInitialized &&
      isInTelegram === false && // Only call checkAuth if not in Telegram
      !authChecked
    ) {
      checkAuth().finally(() => setAuthChecked(true));
    } else if (isInitialized && isInTelegram === true && !authChecked) {
      // For Telegram users, just mark authChecked as true
      setAuthChecked(true);
    }
  }, [isInitialized, isInTelegram, checkAuth, authChecked]);

  useEffect(() => {
    if (isInitialized && isInTelegram !== undefined && authChecked) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, isInTelegram, authChecked]);

  if (
    isInTelegram === undefined ||
    !authChecked ||
    (isInitialized && showLoader)
  ) {
    return (
      <TelegramLoader
        isVisible={true}
        onComplete={() => setShowLoader(false)}
      />
    );
  }

  return null;
}

