"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Bell,
  User,
  Menu,
  X,
  Home,
  Building,
  MessageCircle,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth";
import { useTelegramStore } from "@/store/telegram";
import { NotificationDropdown } from "./NotificationDropdown";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, checkAuth, logout, isTelegramUser } =
    useAuthStore();
  const { showBottomNav } = useTelegramStore();
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   const check = async () => {
  //     await checkAuth();
  //   };
  //   check();
  // }, [checkAuth]);

  // Hide header on messages pages
  const isMessagesPage = pathname?.startsWith("/messages");
  if (isMessagesPage) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Building className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">AddisBroker</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-6"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/properties"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Properties
            </Link>
            <Link
              href="/brokers"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Brokers
            </Link>
            <Link
              href="/properties/add"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Add Property
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {(isAuthenticated || showBottomNav) && <NotificationDropdown />}

            {/* User Menu */}
            {isAuthenticated && !isTelegramUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profilePhoto} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {(user?.role === "Admin" || user?.role === "SuperAdmin") && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/messages">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  {/** Only show logout if not a telegram user */}
                  {!isTelegramUser && (
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              !showBottomNav && (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )
            )}

            {/* Mobile Menu Button */}
            {!showBottomNav && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <form onSubmit={handleSearch} className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="inline mr-2 h-4 w-4" />
                Home
              </Link>
              <Link
                href="/properties"
                className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <Building className="inline mr-2 h-4 w-4" />
                Properties
              </Link>
              <Link
                href="/brokers"
                className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="inline mr-2 h-4 w-4" />
                Brokers
              </Link>
              <Link
                href="/properties/add"
                className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <Plus className="inline mr-2 h-4 w-4" />
                Add Property
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
