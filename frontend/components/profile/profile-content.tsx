"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoTab } from "@/components/profile/personal-info-tab";
import { SecurityTab } from "@/components/profile/security-tab";
import { PreferencesTab } from "@/components/profile/preferences-tab";
import { useTelegramStore } from "@/store/telegram";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { BrandLoader } from "../ui/brand-loader";

export function ProfileContent() {
  const [activeTab, setActiveTab] = useState("personal");
  const { isInTelegram, showBottomNav } = useTelegramStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false && isInTelegram !== undefined)
      router.push("/");
  }, [isAuthenticated]);

  if (isAuthenticated === undefined || isAuthenticated !== true)
    return <BrandLoader />;

  return (
    <div className="min-h-screen bg-background">
      <div
        className={`container mx-auto px-4 py-8 ${
          showBottomNav ? "pb-20" : ""
        }`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger
                value="personal"
                className="text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Personal Info
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <PersonalInfoTab />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecurityTab />
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <PreferencesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
