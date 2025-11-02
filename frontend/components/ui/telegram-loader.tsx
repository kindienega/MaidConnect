"use client";

import { useState, useEffect } from "react";
import { Building, Home, MapPin, Star, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TelegramLoaderProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function TelegramLoader({ isVisible, onComplete }: TelegramLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      icon: Building,
      title: "Connecting to AddisBroker",
      description: "Establishing secure connection...",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: MapPin,
      title: "Loading Properties",
      description: "Fetching latest listings...",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Users,
      title: "Finding Brokers",
      description: "Connecting with professionals...",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Star,
      title: "Loading Reviews",
      description: "Getting community insights...",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: TrendingUp,
      title: "Analyzing Market",
      description: "Processing market data...",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Home,
      title: "Ready to Explore",
      description: "Your real estate journey begins...",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete?.();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [isVisible, onComplete, steps.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center w-screen h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-100 rounded-full opacity-20 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full opacity-10 animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">AddisBroker</h1>
          <p className="text-gray-600">Your Gateway to Real Estate</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Initializing...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-4">
            {(() => {
              const Icon = steps[currentStep].icon;
              return (
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    steps[currentStep].bgColor
                  )}
                >
                  <Icon className={cn("w-6 h-6", steps[currentStep].color)} />
                </div>
              );
            })()}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                {steps[currentStep].title}
              </h3>
              <p className="text-sm text-gray-600">
                {steps[currentStep].description}
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-2 mt-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index <= currentStep
                  ? "bg-gradient-to-r from-blue-500 to-green-500"
                  : "bg-gray-300"
              )}
            />
          ))}
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating Buildings */}
          <div className="absolute top-10 left-10 animate-float">
            <Building className="w-6 h-6 text-blue-400 opacity-60" />
          </div>
          <div className="absolute top-20 right-16 animate-float delay-1000">
            <Home className="w-5 h-5 text-green-400 opacity-60" />
          </div>
          <div className="absolute bottom-20 left-16 animate-float delay-2000">
            <MapPin className="w-4 h-4 text-purple-400 opacity-60" />
          </div>
          <div className="absolute bottom-10 right-10 animate-float delay-1500">
            <Star className="w-4 h-4 text-yellow-400 opacity-60" />
          </div>
        </div>
      </div>

      {/* Loading Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100" />
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200" />
      </div>
    </div>
  );
}

// Add custom animations to tailwind.config.ts
const customAnimations = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
`;

// Add this to your global CSS or tailwind.config.ts
export const telegramLoaderStyles = customAnimations;

