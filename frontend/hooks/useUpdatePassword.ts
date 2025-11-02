import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTelegramStore } from "@/store/telegram";
import { toast } from "sonner";

const updatePassword = async (
  data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
  isInTelegram: boolean | undefined
) => {
  console.log(typeof window, "💥💥💥💥💥💥💥💥💥💥💥💥");
  const { currentPassword, newPassword, confirmPassword } = data;
  if (!newPassword || !confirmPassword) {
    throw new Error("Please provide new password and confirm password");
  }
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/users/update-my-password`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  console.log(result);
  if (isInTelegram) localStorage.setItem("jwt", result.token);

  if (!response.ok) {
    throw new Error(result.error || "Failed to update password.");
  }

  return result;
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  const isInTelegram = useTelegramStore((state) => state.isInTelegram);

  return useMutation({
    mutationFn: (data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => updatePassword(data, isInTelegram),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Password updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update password");
    },
  });
};
