"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Bell,
  MapPin,
  Home,
  Building,
  Warehouse,
  TreePine,
  Save,
  X,
  Settings,
} from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";

const preferencesSchema = z.object({
  location: z.string().optional(),
  priceRangeMin: z
    .number()
    .min(0, "Minimum price must be 0 or greater")
    .optional(),
  priceRangeMax: z
    .number()
    .min(0, "Maximum price must be 0 or greater")
    .optional(),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

const propertyTypes = [
  { value: "apartment", label: "Apartment", icon: Building },
  { value: "house", label: "House", icon: Home },
  { value: "commercial", label: "Commercial", icon: Warehouse },
  { value: "office", label: "Office", icon: TreePine },
];

const locations = [
  "Addis Ababa",
  "Bole",
  "Kirkos",
  "Arada",
  "Yeka",
  "Nifas Silk-Lafto",
  "Kolfe Keranio",
  "Gulele",
  "Lideta",
  "Akaky Kaliti",
  "Addis Ketema",
];

export function PreferencesTab() {
  const { user, updateUser } = useAuthStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
    user?.preferences?.propertyType || []
  );
  const [emailNotifications, setEmailNotifications] = useState(
    user?.notifications?.email ?? true
  );
  const [inAppNotifications, setInAppNotifications] = useState(
    user?.notifications?.inApp ?? true
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      location: user?.preferences?.location || "",
      priceRangeMin: user?.preferences?.priceRange?.min || undefined,
      priceRangeMax: user?.preferences?.priceRange?.max || undefined,
    },
  });

  const onSubmit = async (data: PreferencesFormData) => {
    try {
      await updateUser({
        ...user,
        preferences: {
          location: data.location,
          priceRange: {
            min: data.priceRangeMin || 0,
            max: data.priceRangeMax || 10000000,
          },
          propertyType: selectedPropertyTypes,
        },
        notifications: {
          email: emailNotifications,
          inApp: inAppNotifications,
        },
      });

      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    reset();
    setSelectedPropertyTypes(user?.preferences?.propertyType || []);
    setEmailNotifications(user?.notifications?.email ?? true);
    setInAppNotifications(user?.notifications?.inApp ?? true);
    setIsEditing(false);
  };

  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleNotificationToggle = async (
    type: "email" | "inApp",
    enabled: boolean
  ) => {
    try {
      if (type === "email") {
        setEmailNotifications(enabled);
      } else {
        setInAppNotifications(enabled);
      }

      await updateUser({
        ...user,
        notifications: {
          email: type === "email" ? enabled : emailNotifications,
          inApp: type === "inApp" ? enabled : inAppNotifications,
        },
      });

      toast({
        title: `${type === "email" ? "Email" : "In-app"} notifications ${
          enabled ? "enabled" : "disabled"
        }`,
        description: `You will ${enabled ? "receive" : "no longer receive"} ${
          type === "email" ? "email" : "in-app"
        } notifications.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Search Preferences</span>
              </CardTitle>
              <CardDescription>
                Customize your property search preferences
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Settings className="h-4 w-4 mr-2" />
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
                  form="preferences-form"
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form
            id="preferences-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label>Preferred Location</Label>
              <Select
                value={user?.preferences?.location || ""}
                onValueChange={(value) => {
                  if (isEditing) {
                    // Update form value
                    const event = { target: { value } } as any;
                    register("location").onChange(event);
                  }
                }}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Property Types</Label>
              <div className="flex flex-wrap gap-2">
                {propertyTypes.map((type) => (
                  <Button
                    key={type.value}
                    type="button"
                    variant={
                      selectedPropertyTypes.includes(type.value)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="flex items-center space-x-2"
                    onClick={() => isEditing && togglePropertyType(type.value)}
                    disabled={!isEditing}
                  >
                    <type.icon className="h-4 w-4" />
                    <span>{type.label}</span>
                  </Button>
                ))}
              </div>
              {selectedPropertyTypes.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No property types selected. All types will be shown in search
                  results.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceRangeMin">Minimum Price (ETB)</Label>
                <Input
                  id="priceRangeMin"
                  type="number"
                  {...register("priceRangeMin", { valueAsNumber: true })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                  placeholder="0"
                />
                {errors.priceRangeMin && (
                  <p className="text-sm text-destructive">
                    {errors.priceRangeMin.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceRangeMax">Maximum Price (ETB)</Label>
                <Input
                  id="priceRangeMax"
                  type="number"
                  {...register("priceRangeMax", { valueAsNumber: true })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                  placeholder="10000000"
                />
                {errors.priceRangeMax && (
                  <p className="text-sm text-destructive">
                    {errors.priceRangeMax.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Preferences</span>
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={(enabled) =>
                handleNotificationToggle("email", enabled)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">
                In-App Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications within the app
              </p>
            </div>
            <Switch
              checked={inAppNotifications}
              onCheckedChange={(enabled) =>
                handleNotificationToggle("inApp", enabled)
              }
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Notification Types</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>New property listings</span>
                <Badge variant="outline">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Price changes</span>
                <Badge variant="outline">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>New messages</span>
                <Badge variant="outline">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Property updates</span>
                <Badge variant="outline">Enabled</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Preferences Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Preferences</CardTitle>
          <CardDescription>
            Summary of your current search and notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  Preferred Location
                </Label>
                <p className="text-sm text-muted-foreground">
                  {user?.preferences?.location || "Any location"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Property Types</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user?.preferences?.propertyType &&
                  user.preferences.propertyType.length > 0 ? (
                    user.preferences.propertyType.map((type) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      All types
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Price Range</Label>
                <p className="text-sm text-muted-foreground">
                  {user?.preferences?.priceRange
                    ? `${user.preferences.priceRange.min.toLocaleString()} - ${user.preferences.priceRange.max.toLocaleString()} ETB`
                    : "Any price"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  Email Notifications
                </Label>
                <Badge
                  variant={user?.notifications?.email ? "default" : "secondary"}
                >
                  {user?.notifications?.email ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  In-App Notifications
                </Label>
                <Badge
                  variant={user?.notifications?.inApp ? "default" : "secondary"}
                >
                  {user?.notifications?.inApp ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <div>
                <Label className="text-sm font-medium">Last Updated</Label>
                <p className="text-sm text-muted-foreground">
                  {user?.updatedAt
                    ? new Date(user.updatedAt.toString()).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "2-digit", day: "2-digit" }
                      )
                    : "Never"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

