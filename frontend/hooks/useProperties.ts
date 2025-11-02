import { Property } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface PropertiesResponse {
  data: {
    documents: Property[];
  };
}

const getAllProperties = async (): Promise<PropertiesResponse> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch("/api/properties", {
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

export const useProperties = () => {
  const { data, isLoading, error } = useQuery<PropertiesResponse>({
    queryKey: ["properties"],
    queryFn: getAllProperties,
  });

  const properties = data?.data?.documents || [];

  return { properties, isLoading, error };
};
