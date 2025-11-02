"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Users,
  CreditCard,
  Star,
  Repeat,
  ChevronLeft,
  Settings,
  HelpCircle,
  Search,
  ClipboardList,
} from "lucide-react";

const adminNav = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Properties", href: "/admin/properties", icon: Home },
  {
    name: "Property Requests",
    href: "/admin/property-requests",
    icon: ClipboardList,
  },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Transactions", href: "/admin/transactions", icon: Repeat },
];

const secondaryNav = [
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Help", href: "/admin/help", icon: HelpCircle },
  { name: "Search", href: "/admin/search", icon: Search },
];

interface AdminSidebarProps {
  children: React.ReactNode;
}

export default function AdminSidebar({ children }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const sidebarWidth = collapsed ? 80 : 288; // w-20 or w-72 in px

  // Collapse sidebar by default on small screens
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, []);

  return (
    <div className="min-w-full bg-white relative">
      <aside
        className={`transition-all duration-300 bg-white border-r shadow-lg flex flex-col h-screen fixed top-0 left-0 z-30 ${
          collapsed ? "w-20" : "w-72"
        }`}
        style={{ width: sidebarWidth }}
      >
        {/* Header */}
        <div className="p-4 pt-4 border-b">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <Home className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Main Navigation - Now scrollable */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Main Navigation Items */}
          <nav className="space-y-2 mb-6">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors group
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                  prefetch={false}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Secondary Navigation */}
          <nav className="space-y-2">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors group
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                  prefetch={false}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer - User Info */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">
                  admin@addisbroker.com
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse/Expand Button */}
        <button
          className={`absolute -right-4 top-1/2 -translate-y-1/2 transition-all duration-300 bg-white hover:bg-gray-50 text-muted-foreground hover:text-foreground rounded-full shadow-md p-2 flex items-center justify-center focus:outline-none border z-30
            ${collapsed ? "rotate-180" : ""}
          `}
          style={{ width: 32, height: 32 }}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </aside>

      {/* Main Content Area - Similar to SidebarInset */}
      <div
        className="transition-all duration-300 min-h-screen"
        style={{ marginLeft: sidebarWidth }}
      >
        {children}
      </div>
    </div>
  );
}
