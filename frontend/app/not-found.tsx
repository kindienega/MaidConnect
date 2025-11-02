"use client";

import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Page Not Found
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
              Please check the URL and try again.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>

          {/* Additional Links */}
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              You might also want to visit:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/properties"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Properties
              </Link>
              <Link
                href="/brokers"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Brokers
              </Link>
              <Link
                href="/about"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

