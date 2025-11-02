"use client";

import { Building } from "lucide-react";

export function BrandLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-background z-50">
      {/* Logo */}
      <div className="flex flex-col items-center justify-center w-full h-full py-12 animate-fade-in">
        <div className="mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 shadow-lg animate-pulse">
            <Building className="h-8 w-8 text-white" />
          </div>
        </div>
        {/* Brand Name */}
        <h2 className="text-xl font-bold text-primary mb-2">AddisBroker</h2>
        <p className="text-muted-foreground mb-6">Loading, please wait...</p>
        {/* Animated Dots */}
        <div className="flex space-x-1 mt-2">
          <span
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-accent rounded-full animate-bounce"
            style={{ animationDelay: "100ms" }}
          />
          <span
            className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
            style={{ animationDelay: "200ms" }}
          />
        </div>
      </div>
    </div>
  );
}
