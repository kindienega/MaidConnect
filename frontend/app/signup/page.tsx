"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Building, User, Mail, Phone, Upload } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type Role = "User" | "Broker";

export default function RegisterPage() {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    role: Role;
    specialtiesInput: string;
    description: string;
    whatsapp: string;
    telegram: string;
    yearsOfExperience: string;
  }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "User",
    specialtiesInput: "",
    description: "",
    whatsapp: "",
    telegram: "",
    yearsOfExperience: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [businessCardFile, setBusinessCardFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const { signup, isLoading } = useAuthStore();
  const router = useRouter();
  const { isAuthenticated, checkAuth, login, verifyOtp, otpUserId } =
    useAuthStore();

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

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate broker-specific fields
    if (formData.role === "Broker") {
      if (
        !formData.yearsOfExperience ||
        isNaN(Number(formData.yearsOfExperience))
      ) {
        toast.error("Years of experience must be a valid number");
        return;
      }
    }

    try {
      // Create FormData for file uploads
      const submitData = new FormData();

      // Add basic user data
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("role", formData.role);
      submitData.append("phone", formData.phone);
      submitData.append("password", formData.password);
      submitData.append("passwordConfirm", formData.confirmPassword);

      // Add contact info as individual fields
      if (formData.whatsapp) {
        submitData.append("contactInfo[whatsapp]", formData.whatsapp);
      }
      if (formData.telegram) {
        submitData.append("contactInfo[telegram]", formData.telegram);
      }

      submitData.append("createdAt", new Date().toISOString());
      submitData.append("isActive", "true");

      // Add broker-specific data
      if (formData.role === "Broker") {
        submitData.append("yearsOfExperience", formData.yearsOfExperience);

        // Add specialties as individual array items
        const specialties = formData.specialtiesInput
          .split(" ")
          .filter(Boolean)
          .map((s) => s.replace(/-/g, " "));

        specialties.forEach((specialty, index) => {
          submitData.append(`specialties[${index}]`, specialty);
        });

        if (formData.description) {
          submitData.append("description", formData.description);
        }

        // Add files
        if (licenseFile) {
          submitData.append("license", licenseFile);
        }
        if (businessCardFile) {
          submitData.append("businessCard", businessCardFile);
        }
      }

      // Call signup with FormData
      await signup(submitData);
      toast.success("Registration successful!");
      router.push("/");
    } catch (error) {
      console.log(error);
      const errorMessage =
        typeof error === "object" && error && "message" in error
          ? (error as any).message
          : "Registration failed! Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLicenseUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLicenseFile(file);
    }
  };

  const handleBusinessCardUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setBusinessCardFile(file);
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
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Join AddisBroker and start your property journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInput
                  international
                  defaultCountry="ET"
                  value={formData.phone}
                  onChange={(value) => handleInputChange("phone", value || "")}
                  placeholder="Enter phone number"
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-inherit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="text"
                  placeholder="WhatsApp number or link"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    handleInputChange("whatsapp", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  type="text"
                  placeholder="Telegram username or link"
                  value={formData.telegram}
                  onChange={(e) =>
                    handleInputChange("telegram", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    handleInputChange("role", value as Role)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">Customer</SelectItem>
                    <SelectItem value="Broker">Broker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === "Broker" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">
                      Years of Experience *
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      placeholder="e.g., 5"
                      value={formData.yearsOfExperience}
                      onChange={(e) =>
                        handleInputChange("yearsOfExperience", e.target.value)
                      }
                      min="0"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      * Required for broker registration
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialties">Specialties</Label>
                    <Input
                      id="specialties"
                      type="text"
                      placeholder="e.g., office rent office-broker"
                      value={formData.specialtiesInput || ""}
                      onChange={(e) =>
                        handleInputChange("specialtiesInput", e.target.value)
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate specialties with spaces. Use hyphens for
                      multi-word specialties (e.g., office-broker).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      type="text"
                      placeholder="Describe your experience"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license">License Document</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="license"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleLicenseUpload}
                        className="flex-1"
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {licenseFile && (
                      <p className="text-sm text-green-600">
                        ✓ {licenseFile.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Optional document to verify your license
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessCard">Business Card</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="businessCard"
                        type="file"
                        accept="image/*"
                        onChange={handleBusinessCardUpload}
                        className="flex-1"
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {businessCardFile && (
                      <p className="text-sm text-green-600">
                        ✓ {businessCardFile.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Optional business card image
                    </p>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <Separator />

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
                  Register with Telegram
                </a>
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

