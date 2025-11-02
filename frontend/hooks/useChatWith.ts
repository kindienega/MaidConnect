import { Message } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface ChatWithResponse {
  data: {
    documents: Message[];
  };
}

const getAllChatWith = async (id: string): Promise<ChatWithResponse> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/messages/${id}/chat-with`, {
    method: "GET",
    credentials: "include", // allow cookies
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    // For new conversations, return empty messages instead of throwing error
    return {
      data: {
        documents: [],
      },
    };
  }

  return result;
};

export const useChatWith = (id: string) => {
  const queryClient = useQueryClient();
  const [realTimeMessages, setRealTimeMessages] = useState<Message[]>([]);

  const { data, isLoading, error } = useQuery<ChatWithResponse>({
    queryKey: ["chat-with", id],
    queryFn: () => getAllChatWith(id),
    // Don't refetch on window focus for new conversations
    refetchOnWindowFocus: false,
    // Retry only once for new conversations
    retry: 1,
  });

  const fetchedMessages = data?.data?.documents || [];

  // Combine fetched messages with real-time updates
  const messages = [...fetchedMessages, ...realTimeMessages];

  // Clear real-time messages when conversation changes
  useEffect(() => {
    setRealTimeMessages([]);
  }, [id]);

  return { messages, isLoading, error };
};

