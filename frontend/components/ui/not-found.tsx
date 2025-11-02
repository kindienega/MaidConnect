"use client";

import { useEffect, useState } from "react";
import { Search, UserX, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface NotFoundProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export function NotFound({
  title = "Oops! No broker found",
  message = "We couldn't find a broker with that ID. They might have been removed or the ID might be incorrect.",
  showBackButton = true,
  showHomeButton = true,
}: NotFoundProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [bounceVisible, setBounceVisible] = useState(false);

  useEffect(() => {
    // Stagger the animations
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setBounceVisible(true), 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-primary/10">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div
              className={`relative transition-all duration-700 ${
                isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <UserX className="w-10 h-10 text-red-500" />
              </div>
              <div
                className={`absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center transition-all duration-500 delay-300 ${
                  bounceVisible ? "animate-bounce" : ""
                }`}
              >
                <Search className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary mb-2">
            {title}
          </CardTitle>
          <p className="text-muted-foreground leading-relaxed">{message}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {showBackButton && (
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            )}
            {showHomeButton && (
              <Button onClick={() => router.push("/")} className="flex-1">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Try searching for brokers on our{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-primary hover:text-primary/80"
                onClick={() => router.push("/brokers")}
              >
                brokers page
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
