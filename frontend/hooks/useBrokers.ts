import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface BrokersResponse {
  data: {
    documents: User[];
  };
}

interface SingleBrokerResponse {
  data: {
    document: User;
  };
}

const getAllBrokers = async (): Promise<BrokersResponse> => {
  const response = await fetch("/api/users/brokers", {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch brokers.");
  }

  return result;
};

const getBrokerById = async (id: string): Promise<SingleBrokerResponse> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/users/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch broker.");
  }

  return result;
};

export const useBrokers = () => {
  const { data, isLoading, error } = useQuery<BrokersResponse>({
    queryKey: ["brokers"],
    queryFn: getAllBrokers,
  });

  const brokers = data?.data?.documents || [];

  return { brokers, isLoading, error };
};

export const useBrokerById = (id: string) => {
  const { data, isLoading, error } = useQuery<SingleBrokerResponse>({
    queryKey: ["broker", id],
    queryFn: () => getBrokerById(id),
    enabled: !!id && id.trim() !== "", // Only run query if id is provided and not empty
  });

  const broker = data?.data?.document || null;

  return { broker, isLoading, error };
};
