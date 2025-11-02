"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Camera, Save, X, Building2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth";
import { useTelegramStore } from "@/store/telegram";
import { BrokerInfoTab } from "./broker-info-tab";
import { ManageTab } from "./manage-tab";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const upgradeToBrokerSchema = z.object({
  companyName: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  specialties: z.string().min(5, "Specialties must be at least 5 characters"),
  yearsOfExperience: z.string().min(1, "Years of experience is required"),
});

type UpgradeToBrokerFormData = z.infer<typeof upgradeToBrokerSchema>;

export function PersonalInfoTab() {
  const { user, updateUser, upgradeToBroker } = useAuthStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [businessCardFile, setBusinessCardFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [phoneValue, setPhoneValue] = useState<string>("");
  const { isInTelegram } = useTelegramStore();

  console.log("PersonalInfoTab - user:", user);

  // Check if user is not a regular User (i.e., is Broker, Admin, or SuperAdmin)
  const isNonUser = user?.role && user.role !== "User";

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showUpgradeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showUpgradeModal]);

  const {
    register: registerUpgrade,
    handleSubmit: handleSubmitUpgrade,
    formState: { errors: upgradeErrors, isSubmitting: isUpgradeSubmitting },
    reset: resetUpgrade,
  } = useForm<UpgradeToBrokerFormData>({
    resolver: zodResolver(upgradeToBrokerSchema),
    defaultValues: {
      companyName: "",
      description: "",
      specialties: "",
      yearsOfExperience: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset: resetPersonal,
  } = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(10, "Phone number must be at least 10 digits"),
        whatsapp: z.string().optional(),
        telegram: z.string().optional(),
        description: z.string().optional(),
      })
    ),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      telegram: "",
      description: "",
    },
  });

  // Reset form when user data becomes available
  useEffect(() => {
    if (user) {
      resetPersonal({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        whatsapp: user.contactInfo?.whatsapp || "",
        telegram: user.contactInfo?.telegram || user.userName || "",
        description: user.description || "",
      });
      setPhoneValue(user.phone || "");
    }
  }, [user, resetPersonal]);

  const onSubmitPersonal = async (data: any) => {
    try {
      const { email, name, description, telegram, whatsapp } = data;
      const userData = {
        email,
        name,
        phone: phoneValue,
        description,
        contactInfo: {
          telegram,
          whatsapp,
        },
      };
      await updateUser(userData);
      toast.success("Your personal information has been updated successfully.");
      setIsEditing(false);
    } catch (error) {
      console.log("error in the client", error);
      const errorMessage =
        typeof error === "object" &&
        error &&
        "message" in error &&
        error.message
          ? (error.message as string)
          : "Failed to update profile! Please try again later.";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    resetPersonal();
    setPhoneValue(user?.phone || "");
    setIsEditing(false);
  };

  const handleProfilePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Check if user is a Telegram user
    if (isInTelegram) {
      toast.info(
        "To change your profile picture, please update your Telegram profile picture first."
      );
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("profilePhoto", file);

      // Use the improved updateUser function from auth store
      await updateUser(formData);

      toast.success("Your profile photo has been updated successfully");
    } catch (error) {
      console.log("error in the client", error);
      const errorMessage =
        typeof error === "object" &&
        error &&
        "message" in error &&
        (error as any).message
          ? (error as any).message
          : "Failed to upload photo! Please try again later.";

      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmitUpgrade = async (data: UpgradeToBrokerFormData) => {
    try {
      console.log("data", data);

      // Validate required files
      // if (!licenseFile) {
      //   toast.error("License document is required");
      //   return;
      // }
      // if (!businessCardFile) {
      //   toast.error("Business card is required");
      //   return;
      // }

      const formData = new FormData();
      if (data.companyName) {
        formData.append("companyName", data.companyName);
      }
      formData.append("description", data.description);
      formData.append("specialties", data.specialties);
      formData.append("yearsOfExperience", data.yearsOfExperience);

      if (licenseFile) {
        formData.append("license", licenseFile);
      }
      if (businessCardFile) {
        formData.append("businessCard", businessCardFile);
      }

      console.log("Upgrade data:", data);
      console.log("Files:", { licenseFile, businessCardFile });

      // Call the upgradeToBroker function from auth store
      await upgradeToBroker(formData);

      toast.success(
        "Your upgrade request has been submitted successfully! We'll review your application."
      );
      setShowUpgradeModal(false);
      resetUpgrade();
      setLicenseFile(null);
      setBusinessCardFile(null);
    } catch (error) {
      console.log("error in upgrade submission", error);
      const errorMessage =
        typeof error === "object" &&
        error &&
        "message" in error &&
        error.message
          ? (error.message as string)
          : "Failed to submit upgrade request! Please try again later.";
      toast.error(errorMessage);
    }
  };

  const handleCancelUpgrade = () => {
    setShowUpgradeModal(false);
    resetUpgrade();
    setLicenseFile(null);
    setBusinessCardFile(null);
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
    <div className="space-y-6">
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
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

      {/* Upgrade to Broker Button for Users */}
      {user?.role === "User" && (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade to Broker</CardTitle>
            <CardDescription>
              Become a broker to list properties and manage deals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Upgrade to Broker
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Profile Photo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>
            {isInTelegram
              ? "Your profile photo is synced with your Telegram profile. Update your Telegram profile picture to change it here."
              : "Update your profile picture to personalize your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={
                      isInTelegram === true
                        ? `${user?.profilePhoto}?v=${user?.updatedAt}`
                        : user?.profilePhoto
                    }
                    alt={user?.name}
                  />

                  <AvatarFallback className="text-2xl">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  className={`absolute bottom-0 right-0 rounded-full p-2 cursor-pointer transition-colors ${
                    isInTelegram
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePhotoUpload}
                    disabled={isUploading || isInTelegram}
                  />
                </label>
              </div>
              <div>
                <h3 className="font-medium">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.role}</p>
                {user?.isVerified && (
                  <Badge variant="secondary" className="mt-1">
                    Verified
                  </Badge>
                )}
                {isInTelegram && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600 mt-2">
                    <span>🔒</span>
                    <span>Read-only (Telegram user)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Indicator - Positioned on the far right */}
            <div className="flex flex-col items-end space-y-2 ml-4 md:ml-8">
              <Badge
                variant="outline"
                className={`px-2 py-1 text-xs md:text-sm font-medium ${
                  user?.status === "approved"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : user?.status === "pending"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : user?.status === "rejected"
                    ? "bg-red-100 text-red-800 border-red-200"
                    : "bg-gray-100 text-gray-800 border-gray-200"
                }`}
              >
                {user?.status
                  ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
                  : "Unknown"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nested Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList
          className={`grid ${
            isNonUser ? "grid-cols-3" : "grid-cols-1"
          } bg-gray-100`}
        >
          <TabsTrigger
            value="basic"
            className="text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Basic Info
          </TabsTrigger>
          {isNonUser && (
            <>
              <TabsTrigger
                value="broker"
                className="text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Broker Info
              </TabsTrigger>
              <TabsTrigger
                value="manage"
                className="text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Manage
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    {isInTelegram
                      ? "Update your contact details and other information. Name and profile photo are synced with your Telegram profile."
                      : "Update your basic information and contact details"}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      <User className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        form="personal-info-form"
                        disabled={isSubmitting}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form
                id="personal-info-form"
                onSubmit={handleSubmit(onSubmitPersonal)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      disabled={!isEditing || isInTelegram}
                      className={
                        !isEditing || isInTelegram
                          ? "bg-muted cursor-not-allowed"
                          : ""
                      }
                      onClick={() => {
                        if (isInTelegram && !isEditing) {
                          toast.info(
                            "To change your name, please update your Telegram profile name first."
                          );
                        }
                      }}
                    />
                    {isInTelegram && (
                      <p className="text-xs text-blue-600 flex items-center space-x-1">
                        <span>🔒</span>
                        <span>Read-only (synced from Telegram)</span>
                      </p>
                    )}
                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <PhoneInput
                      international
                      defaultCountry="ET"
                      value={phoneValue}
                      onChange={(value) => setPhoneValue(value || "")}
                      placeholder="Enter phone number"
                      disabled={!isEditing}
                      className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-inherit ${
                        !isEditing ? "bg-muted" : ""
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp (Optional)</Label>
                    <Input
                      id="whatsapp"
                      {...register("whatsapp")}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                      placeholder="+251911234567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telegram">
                      Telegram Username (Optional)
                    </Label>
                    <Input
                      id="telegram"
                      {...register("telegram")}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Bio/Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details and registration information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{user?.role}</Badge>
                    {user?.isVerified && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <p className="text-sm text-muted-foreground">
                    {user?.createdAt
                      ? new Date(user.createdAt.toString()).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "2-digit", day: "2-digit" }
                        )
                      : "N/A"}
                  </p>
                </div>

                {user?.telegramId && (
                  <div className="space-y-2">
                    <Label>Telegram ID</Label>
                    <p className="text-sm text-muted-foreground">
                      {user.telegramId}
                    </p>
                  </div>
                )}

                {user?.userName && (
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <p className="text-sm text-muted-foreground">
                      @{user.userName}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isNonUser && (
          <>
            <TabsContent value="broker" className="space-y-6">
              <BrokerInfoTab />
            </TabsContent>
            <TabsContent value="manage" className="space-y-6">
              <ManageTab />
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Upgrade to Broker Modal */}
      {showUpgradeModal && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ margin: 0, padding: 0 }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 scrollbar-hide">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">
                Upgrade to Broker
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelUpgrade}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form
              onSubmit={handleSubmitUpgrade((data) => {
                console.log("Form submitted with data:", data);
                return onSubmitUpgrade(data);
              })}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input
                    id="companyName"
                    {...registerUpgrade("companyName")}
                    placeholder="Your Company Name"
                  />
                  {upgradeErrors.companyName && (
                    <p className="text-sm text-destructive">
                      {upgradeErrors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input
                    id="yearsOfExperience"
                    {...registerUpgrade("yearsOfExperience")}
                    placeholder="e.g., 5 years"
                  />
                  {upgradeErrors.yearsOfExperience && (
                    <p className="text-sm text-destructive">
                      {upgradeErrors.yearsOfExperience.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialties">Specialties</Label>
                <Input
                  id="specialties"
                  {...registerUpgrade("specialties")}
                  placeholder="e.g., Residential, Commercial, Luxury Properties"
                />
                {upgradeErrors.specialties && (
                  <p className="text-sm text-destructive">
                    {upgradeErrors.specialties.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">About You</Label>
                <Textarea
                  id="description"
                  {...registerUpgrade("description")}
                  placeholder="Tell us about yourself, your experience, and what makes you a great broker..."
                  rows={4}
                />
                {upgradeErrors.description && (
                  <p className="text-sm text-destructive">
                    {upgradeErrors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelUpgrade}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpgradeSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isUpgradeSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

