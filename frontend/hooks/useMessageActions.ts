import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";

const markMessageAsRead = async (chatWithId: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(
    `/api/messages/${chatWithId}/mark-message-as-read`,
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
    throw new Error(result.error || "Failed to mark message as read.");
  }

  return result;
};

const sendMessage = async (data: {
  recipient: string;
  content: { text: string };
}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  console.log(data);

  const response = await fetch(`/api/messages/send-message`, {
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
    throw new Error(result.error || "Failed to send message.");
  }

  return result;
};

export const useMarkMessageAsRead = (chatWithId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markMessageAsRead,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["my-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["chat-with", chatWithId] });
      // toast.success("Message marked as read successfully!");
    },
    // onError: (error: Error) => {
    //   toast.error(error.message || "Failed to mark message as read");
    // },
  });
};

export const useSendMessage = ({
  data,
  chatWithId,
}: {
  data: { recipient: string; content: { text: string } };
  chatWithId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sendMessage(data),
    onSuccess: () => {
      // Invalidate and refetch conversations list to show new conversation
      queryClient.invalidateQueries({ queryKey: ["my-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["chat-with", chatWithId] });

      // Also invalidate the specific conversation to ensure it's updated
      queryClient.invalidateQueries({ queryKey: ["conversation", chatWithId] });

      // toast.success("Message sent successfully!");
    },
    // onError: (error: Error) => {
    //   toast.error(error.message || "Failed to send message");
    // },
  });
};
