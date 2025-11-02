import { Property } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const updateOwnPropertyStatus = async (propertyId: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(
    `/api/properties/${propertyId}/own/update-status`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to update property status.");
  }

  return result;
};

const updateOwnProperty = async ({
  propertyId,
  data,
}: {
  propertyId: string;
  data: Property;
}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  console.log(data);

  const response = await fetch(`/api/properties/${propertyId}/own/update`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to update property.");
  }

  return result;
};

const deleteOwnProperty = async (propertyId: string) => {
  console.log(propertyId, "from delete");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/properties/${propertyId}/own/delete`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to delete property.");
  }

  return result;
};

export const useUpdateOwnPropertyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOwnPropertyStatus,
    onSuccess: () => {
      // Invalidate and refetch own properties list
      queryClient.invalidateQueries({ queryKey: ["own-properties"] });
      toast.success("Property status updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update property status");
    },
  });
};

export const useUpdateOwnProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOwnProperty,
    onSuccess: () => {
      // Invalidate and refetch own properties list
      queryClient.invalidateQueries({ queryKey: ["own-properties"] });
      toast.success("Property updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update property");
    },
  });
};

export const useDeleteOwnProperty = () => {
  console.log("from deleteOwnProperty custome hook");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOwnProperty,
    onSuccess: () => {
      // Invalidate and refetch own properties list
      queryClient.invalidateQueries({ queryKey: ["own-properties"] });
      toast.success("Property deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete property");
    },
  });
};

