import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const updatePropertyRequestStatus = async (
  propertyId: string,
  data: { status: "pending" | "in-progress" | "completed" | "rejected" }
) => {
  console.log(typeof window, "💥💥💥💥💥💥💥💥💥💥💥💥");
  console.log(propertyId, data, "data in updatePropertyRequestStatus");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(
    `/api/request-property/update-status/${propertyId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Failed to update property request status."
    );
  }

  return result;
};

export const useUpdatePropertyRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      propertyId: string;
      data: { status: "pending" | "in-progress" | "completed" | "rejected" };
    }) => updatePropertyRequestStatus(data.propertyId, data.data),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property request status updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update property request status");
    },
  });
};

