import { Property } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface PropertyResponse {
  data: {
    documents: Property[];
  };
}

const getOwnProperties = async (
  page: number,
  limit: number
): Promise<PropertyResponse> => {
  console.log(page, limit, `page and limit`);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(
    `/api/properties/own?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include", // allow cookies
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch properties.");
  }

  return result;
};

export const useOwnProperties = (
  filter: { page: number; limit: number },
  id: string
) => {
  const { data, isLoading, error } = useQuery<PropertyResponse>({
    queryKey: ["own-properties", id],
    queryFn: () => getOwnProperties(filter.page, filter.limit),
  });

  console.log(data, "data from useOwnProperties");

  const properties = data?.data?.documents || null;

  return { properties, isLoading, error };
};

