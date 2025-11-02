import { Conversation } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface MyConversationsResponse {
  data: {
    documents: Conversation[];
  };
}

const getAllMyConversations = async (): Promise<MyConversationsResponse> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/messages/my-conversations`, {
    method: "GET",
    credentials: "include", // allow cookies
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    // throw new Error(result.error || "Failed to fetch notifications.");
    return {
      data: {
        documents: [],
      },
    };
  }

  return result;
};

export const useMyConversations = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<MyConversationsResponse>({
    queryKey: ["my-conversations"],
    queryFn: () => getAllMyConversations(),
  });

  const conversations = data?.data?.documents || [];

  return { conversations, isLoading, error };
};

