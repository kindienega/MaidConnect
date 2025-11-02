import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface UsersResponse {
  data: {
    documents: User[];
  };
}

const getAllUsers = async (): Promise<UsersResponse> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch("/api/users", {
    method: "GET",
    credentials: "include", // allow cookies
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch users.");
  }

  return result;
};

export const useUsers = () => {
  const { data, isLoading, error } = useQuery<UsersResponse>({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const users = data?.data?.documents || [];

  return { users, isLoading, error };
};
