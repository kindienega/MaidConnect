"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Building,
  Warehouse,
  Users,
  UserPlus,
  MessageSquare,
  Plus,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTelegramStore } from "@/store/telegram";
import { useAuthStore } from "@/store/auth";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const { isInTelegram } = useTelegramStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedType) params.set("type", selectedType);

    router.push(`/search?${params.toString()}`);
  };

  const handleBrowseBrokers = () => {
    router.push("/brokers");
  };

  const handleRegisterBroker = () => {
    if (!user) {
      // No user logged in - redirect to signup
      if (isInTelegram) {
        router.push("/profile");
      } else {
        router.push("/signup");
      }
    } else if (user.role === "User") {
      // User is logged in with role "User" - redirect to upgrade to broker
      router.push("/profile");
    }
  };

  const handleRequestProperty = () => {
    router.push("/properties/request_property");
  };

  const handleAddProperty = () => {
    router.push("/properties/add");
  };

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Content */}
          <div className="space-y-6 mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Find Your Dream Property in{" "}
              <span className="text-primary">Addis Ababa</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the perfect home or investment opportunity with trusted
              brokers and verified listings across the city.
            </p>
          </div>

          {/* Action Cards */}
          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-sm md:max-w-none mx-auto">
            {/* Browse Brokers Card */}
            <Card className="w-full md:w-60 lg:w-64 p-6 bg-white/90 backdrop-blur-sm border border-black/10 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-black" />
                </div>
                <p className="text-sm text-black/70">
                  Connect with trusted brokers easily
                </p>
                <Button
                  onClick={handleBrowseBrokers}
                  className="w-full bg-black text-white hover:bg-black/90 hover:scale-105 hover:shadow-lg transition-all duration-300 transform"
                  variant="default"
                >
                  Browse Brokers
                </Button>
              </div>
            </Card>

            {/* Register As Broker Card - Only show if no user or user role is "User" */}
            {(!user || user.role === "User") && (
              <Card className="w-full md:w-60 lg:w-64 p-6 bg-white/90 backdrop-blur-sm border border-black/10 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <UserPlus className="h-8 w-8 text-black" />
                  </div>
                  <p className="text-sm text-black/70">
                    {!user
                      ? "Join free, grow your business"
                      : "Upgrade your account to broker"}
                  </p>
                  <Button
                    onClick={handleRegisterBroker}
                    className={`w-full hover:scale-105 hover:shadow-lg transition-all duration-300 transform ${
                      !user
                        ? "bg-black text-white hover:bg-black/90"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    variant="default"
                  >
                    {!user ? "Register As Broker" : "Upgrade to Broker"}
                  </Button>
                </div>
              </Card>
            )}

            {/* Request Properties Card */}
            <Card className="w-full md:w-60 lg:w-64 p-6 bg-white/90 backdrop-blur-sm border border-black/10 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-8 w-8 text-black" />
                </div>
                <p className="text-sm text-black/70">
                  Get reliable listings instantly
                </p>
                <Button
                  onClick={handleRequestProperty}
                  className="w-full bg-black text-white hover:bg-black/90 hover:scale-105 hover:shadow-lg transition-all duration-300 transform"
                  variant="default"
                >
                  Request Properties
                </Button>
              </div>
            </Card>

            {/* Add Properties Card */}
            <Card className="w-full md:w-60 lg:w-64 p-6 bg-white/90 backdrop-blur-sm border border-black/10 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-8 w-8 text-black" />
                </div>
                <p className="text-sm text-black/70">
                  Post properties quickly for free
                </p>
                <Button
                  onClick={handleAddProperty}
                  className="w-full bg-black text-white hover:bg-black/90 hover:scale-105 hover:shadow-lg transition-all duration-300 transform"
                  variant="default"
                >
                  Add Properties
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Brokers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">
                Years Experience
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

