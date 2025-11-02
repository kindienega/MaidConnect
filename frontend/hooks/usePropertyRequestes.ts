import { IPropertyRequest } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface PropertiesResponse {
  data: {
    documents: IPropertyRequest[];
  };
}

const getAllPropertyRequests = async (): Promise<PropertiesResponse> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch("/api/request-property", {
    method: "GET",
    credentials: "include", // allow cookies
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch property requests.");
  }

  return result;
};

export const usePropertyRequests = () => {
  const { data, isLoading, error } = useQuery<PropertiesResponse>({
    queryKey: ["property-requests"],
    queryFn: getAllPropertyRequests,
  });

  const properties = data?.data?.documents || [];

  return { properties, isLoading, error };
};
