"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Search,
  Plus,
  MessageCircle,
  User,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTelegramStore } from "@/store/telegram";

const navItems = [
  { href: "/properties", icon: Building, label: "Properties" },
  { href: "/brokers", icon: User, label: "Brokers" },
  { href: "/properties/add", icon: Plus, label: "Post" },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { showBottomNav } = useTelegramStore();

  if (!showBottomNav) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t telegram-bg">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[60px]",
                isActive
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
