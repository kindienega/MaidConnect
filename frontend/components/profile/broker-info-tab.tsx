"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building2, Save, X, Upload, Edit, Eye } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth";

const brokerInfoSchema = z.object({
  companyName: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  specialties: z.string().min(5, "Specialties must be at least 5 characters"),
  yearsOfExperience: z.string().min(1, "Years of experience is required"),
});

type BrokerInfoFormData = z.infer<typeof brokerInfoSchema>;

export function BrokerInfoTab() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [businessCardFile, setBusinessCardFile] = useState<File | null>(null);
  const [showLicensePreview, setShowLicensePreview] = useState(false);
  const [showBusinessCardPreview, setShowBusinessCardPreview] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BrokerInfoFormData>({
    resolver: zodResolver(brokerInfoSchema),
    defaultValues: {
      companyName: "",
      description: "",
      specialties: "",
      yearsOfExperience: "",
    },
  });

  // Reset form when user data becomes available
  useEffect(() => {
    if (user) {
      reset({
        companyName: user.companyName || "",
        description: user.description || "",
        specialties: Array.isArray(user.specialties)
          ? user.specialties.join(", ")
          : user.specialties || "",
        yearsOfExperience: user.yearsOfExperience?.toString() || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: BrokerInfoFormData) => {
    try {
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

      await updateUser(formData);
      toast.success("Your broker information has been updated successfully.");
      setIsEditing(false);
      setLicenseFile(null);
      setBusinessCardFile(null);
    } catch (error) {
      console.log("error in broker info update", error);
      const errorMessage =
        typeof error === "object" &&
        error &&
        "message" in error &&
        error.message
          ? (error.message as string)
          : "Failed to update broker information! Please try again later.";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
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
      {/* Broker Information Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Broker Information</CardTitle>
              <CardDescription>
                Manage your broker profile and professional details
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
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
                    form="broker-info-form"
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
            id="broker-info-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  {...register("companyName")}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                  placeholder="Your Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  {...register("yearsOfExperience")}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                  placeholder="e.g., 5 years"
                />
                {errors.yearsOfExperience && (
                  <p className="text-sm text-destructive">
                    {errors.yearsOfExperience.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties</Label>
              <Input
                id="specialties"
                {...register("specialties")}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
                placeholder="e.g., Residential, Commercial, Luxury Properties"
              />
              {errors.specialties && (
                <p className="text-sm text-destructive">
                  {errors.specialties.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">About You</Label>
              <Textarea
                id="description"
                {...register("description")}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
                placeholder="Tell us about yourself, your experience, and what makes you a great broker..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="license">License Document</Label>

                {/* Show existing license image */}
                {user?.license && !isEditing && (
                  <div className="space-y-2">
                    <div className="relative">
                      <img
                        src={user.license}
                        alt="License Document"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setShowLicensePreview(true)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-green-600">
                      ✓ License document uploaded
                    </p>
                  </div>
                )}

                {/* Show upload option when editing */}
                {isEditing && (
                  <div className="space-y-2">
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
                    {user?.license && !licenseFile && (
                      <p className="text-sm text-blue-600">
                        Current license will be kept if no new file is selected
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessCard">Business Card</Label>

                {/* Show existing business card image */}
                {user?.businessCard && !isEditing && (
                  <div className="space-y-2">
                    <div className="relative">
                      <img
                        src={user.businessCard}
                        alt="Business Card"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setShowBusinessCardPreview(true)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-green-600">
                      ✓ Business card uploaded
                    </p>
                  </div>
                )}

                {/* Show upload option when editing */}
                {isEditing && (
                  <div className="space-y-2">
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
                    {user?.businessCard && !businessCardFile && (
                      <p className="text-sm text-blue-600">
                        Current business card will be kept if no new file is
                        selected
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Broker Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Broker Statistics</CardTitle>
          <CardDescription>
            Your professional performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {user?.rating ? `${user.rating}/5` : "No ratings yet"}
                </Badge>
                {user?.reviewCount && (
                  <span className="text-sm text-muted-foreground">
                    ({user.reviewCount} reviews)
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Active Listings</Label>
              <p className="text-2xl font-bold">{user?.activeListings || 0}</p>
            </div>

            <div className="space-y-2">
              <Label>Completed Deals</Label>
              <p className="text-2xl font-bold">{user?.completedDeals || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>
            Your broker account verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Verification Status</Label>
              <div className="flex items-center space-x-2">
                {user?.isVerified ? (
                  <Badge variant="secondary">Verified</Badge>
                ) : (
                  <Badge variant="destructive">Not Verified</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Account Status</Label>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    user && user.status === "approved"
                      ? "secondary"
                      : user && user.status === "pending"
                      ? "default"
                      : "destructive"
                  }
                >
                  {user && user.status
                    ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
                    : "Pending"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License Preview Modal */}
      {showLicensePreview && user?.license && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">License Document</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLicensePreview(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <img
              src={user.license}
              alt="License Document"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Business Card Preview Modal */}
      {showBusinessCardPreview && user?.businessCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Business Card</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBusinessCardPreview(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <img
              src={user.businessCard}
              alt="Business Card"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
