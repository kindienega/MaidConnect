import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const approveProperty = async (propertyId: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/properties/${propertyId}/approve`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to approve property.");
  }

  return result;
};

const disapproveProperty = async (propertyId: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/properties/${propertyId}/disapprove`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to disapprove property.");
  }

  return result;
};

export const useApproveProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveProperty,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property approved successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve property");
    },
  });
};

export const useDisapproveProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disapproveProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property disapproved successfully!");
    },
  });
};
