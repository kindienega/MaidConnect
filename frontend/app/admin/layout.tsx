"use client";

import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useTelegramStore } from "@/store/telegram";
import { BrandLoader } from "@/components/ui/brand-loader";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // 1 minute
            refetchOnWindowFocus: true,
          },
        },
      })
  );
  const { isAuthenticated } = useAuthStore();
  const { isInTelegram } = useTelegramStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated === false && isInTelegram !== undefined)
      router.push("/");
    if (
      isAuthenticated &&
      user &&
      user.role !== "Admin" &&
      user.role !== "SuperAdmin"
    ) {
      router.push("/");
    }
  }, [isAuthenticated]);

  if (isAuthenticated === undefined || isAuthenticated !== true)
    return <BrandLoader />;

  // if (user?.role !== "Admin" && user?.role !== "SuperAdmin") {
  //   router.push("/");
  // }

  // cment
  return (
    <div className="theme-default theme-scaled">
      <QueryClientProvider client={queryClient}>
        <AdminSidebar>
          {/* <AdminHeader /> */}
          <div className="flex flex-1 flex-col">{children}</div>
        </AdminSidebar>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster />
      </QueryClientProvider>
    </div>
  );
}

// triggering commit
