"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Shield,
  Lock,
  Smartphone,
  Mail,
  Key,
  Eye,
  EyeOff,
  Save,
  X,
  CheckCircle,
  AlertCircle,
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { useUpdatePassword } from "@/hooks/useUpdatePassword";

const passwordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function SecurityTab() {
  const { user, updateUser } = useAuthStore();
  const { toast } = useToast();
  const updatePassword = useUpdatePassword();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(user?.mfaEnabled || false);
  const [mfaMethod, setMfaMethod] = useState<"email" | "sms" | "authenticator">(
    user?.mfaBy || "email"
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const handlePasswordChange = async (data: PasswordFormData) => {
    try {
      if (!user?.telegramId && !data.currentPassword) {
        toast({
          title: "Current password required",
          description: "Please enter your current password.",
          variant: "destructive",
        });
        return;
      }

      await updatePassword.mutateAsync({
        currentPassword: data.currentPassword ?? "",
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setIsChangingPassword(false);
      reset();
    } catch (error) {
      // Error toast handled in the hook
    }
  };

  const handleCancelPasswordChange = () => {
    reset();
    setIsChangingPassword(false);
  };

  const handleMfaToggle = async (enabled: boolean) => {
    try {
      // In a real app, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      setMfaEnabled(enabled);
      await updateUser({
        ...user,
        mfaEnabled: enabled,
        mfaBy: enabled ? mfaMethod : undefined,
      });

      toast({
        title: enabled ? "MFA enabled" : "MFA disabled",
        description: enabled
          ? `Two-factor authentication has been enabled using ${mfaMethod}.`
          : "Two-factor authentication has been disabled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update MFA settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMfaMethodChange = async (
    method: "email" | "sms" | "authenticator"
  ) => {
    try {
      // In a real app, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      setMfaMethod(method);
      await updateUser({
        ...user,
        mfaBy: method,
      });

      toast({
        title: "MFA method updated",
        description: `Two-factor authentication method changed to ${method}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update MFA method. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Two-Factor Authentication</span>
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">
                Protect your account with two-factor authentication
              </p>
            </div>
            <Switch checked={mfaEnabled} onCheckedChange={handleMfaToggle} />
          </div>

          {mfaEnabled && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <Label>Authentication Method</Label>
                <Select value={mfaMethod} onValueChange={handleMfaMethodChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="sms">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4" />
                        <span>SMS</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="authenticator">
                      <div className="flex items-center space-x-2">
                        <Key className="h-4 w-4" />
                        <span>Authenticator App</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {mfaMethod === "email" && (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>
                      Verification codes will be sent to {user?.email}
                    </span>
                  </>
                )}
                {mfaMethod === "sms" && (
                  <>
                    <Smartphone className="h-4 w-4" />
                    <span>
                      Verification codes will be sent to {user?.phone}
                    </span>
                  </>
                )}
                {mfaMethod === "authenticator" && (
                  <>
                    <Key className="h-4 w-4" />
                    <span>
                      Use an authenticator app like Google Authenticator
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {mfaEnabled ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">
                  Two-factor authentication is enabled
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-600">
                  Two-factor authentication is disabled
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Change Password</span>
              </CardTitle>
              <CardDescription>
                Update your account password to keep it secure
              </CardDescription>
            </div>
            {!isChangingPassword ? (
              <Button onClick={() => setIsChangingPassword(true)}>
                Change Password
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleCancelPasswordChange}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="password-form"
                  disabled={isSubmitting || updatePassword.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isChangingPassword ? (
            <form
              id="password-form"
              onSubmit={handleSubmit(handlePasswordChange)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords ? "text" : "password"}
                    placeholder={
                      user?.telegramId
                        ? "If you have not set a password before, please leave this blank"
                        : undefined
                    }
                    {...register("currentPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {!user?.telegramId && errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords ? "text" : "password"}
                    {...register("newPassword")}
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords ? "text" : "password"}
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </form>
          ) : (
            <div className="text-sm text-muted-foreground">
              Last password change:{" "}
              {user?.passwordChangedAt
                ? new Date(user.passwordChangedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "Never"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle>Security Information</CardTitle>
          <CardDescription>
            Your account security details and recent activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Account Status</Label>
              <div className="flex items-center space-x-2">
                <Badge variant={user?.isActive ? "default" : "destructive"}>
                  {user?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Last Active</Label>
              <p className="text-sm text-muted-foreground">
                {user?.lastActive
                  ? new Date(user.lastActive).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>MFA Status</Label>
              <div className="flex items-center space-x-2">
                <Badge variant={mfaEnabled ? "default" : "secondary"}>
                  {mfaEnabled ? "Enabled" : "Disabled"}
                </Badge>
                {mfaEnabled && <Badge variant="outline">{mfaMethod}</Badge>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Login Method</Label>
              <p className="text-sm text-muted-foreground">
                {user?.telegramId ? "Telegram" : "Email/Password"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

