import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const approveUser = async (userId: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/users/${userId}/approve`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to approve user.");
  }

  return result;
};

const disapproveUser = async (userId: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/users/${userId}/disapprove`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to disapprove user.");
  }

  return result;
};

const upgradeToAdmin = async (userId: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/users/${userId}/upgrade-admin`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to upgrade user to admin.");
  }

  return result;
};

export const useApproveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveUser,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User approved successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve user");
    },
  });
};

export const useUpgradeToAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upgradeToAdmin,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User upgraded to admin successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upgrade user to admin");
    },
  });
};

export const useDisapproveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disapproveUser,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User disapproved successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to disapprove user");
    },
  });
};
