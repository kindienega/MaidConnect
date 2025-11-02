import { Property } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface PropertyResponse {
  data: {
    document: Property;
  };
}

const getProperty = async (id: string): Promise<PropertyResponse> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/properties/${id}`, {
    method: "GET",
    credentials: "include", // allow cookies
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch properties.");
  }

  return result;
};

export const useProperty = (id: string) => {
  const { data, isLoading, error } = useQuery<PropertyResponse>({
    queryKey: ["property", id],
    queryFn: () => getProperty(id),
  });

  console.log(data, "data from useProperty");

  const property = data?.data?.document || null;

  return { property, isLoading, error };
};
