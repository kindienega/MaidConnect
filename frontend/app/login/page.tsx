"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Building, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usePhone, setUsePhone] = useState(false);
  const { isAuthenticated, checkAuth, login, verifyOtp, isLoading, otpUserId } =
    useAuthStore();

  const router = useRouter();

  // useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Or a loader
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use phone number in email field if phone is selected, otherwise use email
      const loginValue = usePhone ? phone : email;
      const result = await login(loginValue, password);

      if (result.otpRequired) {
        setShowOtpForm(true);
        toast.success(
          `OTP sent to your ${
            usePhone ? "phone" : "email"
          }. Please check and enter it.`
        );
      } else {
        toast.success("Login successful!");
        setShowOtpForm(false);
        // No need to redirect here, effect will handle it
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        typeof error === "object" && error && "message" in error
          ? (error as any).message
          : "Login failed! Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!otpUserId) {
        toast.error("User ID not found. Please try logging in again.");
        return;
      }

      await verifyOtp(otpUserId, otp);
      toast.success("OTP verified successfully!");
      // No need to redirect here, effect will handle it
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        .PhoneInputCountry {
          background: white !important;
        }
        .PhoneInputCountrySelect {
          background: white !important;
          color: black !important;
        }
        .PhoneInputCountrySelectArrow {
          color: black !important;
        }
        .PhoneInputCountryIcon {
          background: white !important;
        }
        .PhoneInputCountrySelect option {
          background: white !important;
          color: black !important;
        }
        .PhoneInputCountrySelect:focus {
          background: white !important;
          color: black !important;
        }
        /* Force phone input background to white */
        .PhoneInput {
          background: white !important;
        }
        .PhoneInput input {
          background: white !important;
        }
        .PhoneInput > div {
          background: white !important;
        }
        .PhoneInput > div > input {
          background: white !important;
        }
        /* Override any inherited background */
        .PhoneInput * {
          background: white !important;
        }
        .PhoneInput input,
        .PhoneInput select,
        .PhoneInput div {
          background: white !important;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Building className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your AddisBroker account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showOtpForm ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={usePhone ? "phone" : "email"}>
                      {usePhone ? "Phone Number" : "Email"}
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setUsePhone(!usePhone);
                        // Clear the other field when switching
                        if (usePhone) {
                          setPhone("");
                        } else {
                          setEmail("");
                        }
                      }}
                      className="text-xs text-primary hover:text-primary/80 h-6 px-2"
                      disabled={isSubmitting}
                    >
                      {usePhone ? "Use Email" : "Use Phone"}
                    </Button>
                  </div>

                  {usePhone ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <PhoneInput
                        international
                        defaultCountry="ET"
                        value={phone}
                        onChange={(value) => setPhone(value || "")}
                        placeholder="Enter phone number"
                        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-inherit pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Enter OTP</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a 6-digit code to your email
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp">OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    disabled={isSubmitting}
                    className="text-center text-lg tracking-widest"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowOtpForm(false);
                    setOtp("");
                    setEmail("");
                    setPhone("");
                    setPassword("");
                  }}
                  disabled={isSubmitting}
                >
                  Back to Login
                </Button>
              </form>
            )}

            <Separator />

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
          <div className="px-6 pb-6">
            <Button asChild variant="outline" className="w-full">
              <a
                href="https://t.me/addisbrokersbot?startapp=login"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.884 8.03c-.131 1.381-.7 4.745-.99 6.29-.122.652-.36.871-.592.893-.503.046-.885-.331-1.372-.649-.763-.5-1.195-.811-1.932-1.302-.854-.563-.299-.872.186-1.378.127-.131 2.32-2.127 2.362-2.309.005-.023.01-.108-.041-.152-.051-.043-.125-.028-.179-.017-.076.017-1.28.814-3.618 2.388-.343.236-.653.352-.931.346-.306-.006-.895-.173-1.333-.316-.538-.176-.966-.269-.93-.568.019-.153.229-.31.631-.471 2.479-1.077 4.131-1.788 4.953-2.135 2.36-.98 2.853-1.151 3.17-1.157.07-.001.226.016.327.1.086.072.111.171.123.24.011.069.026.226.015.348z" />
                </svg>
                Login with Telegram
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

