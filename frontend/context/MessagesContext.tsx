"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Conversation, Message } from "@/types";
import { useMyConversations } from "@/hooks/useMyConversations";
import { useAuthStore } from "@/store/auth";
import { useSocket } from "@/hooks/useSocket";

interface MessagesContextType {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  addMessage: (message: Message) => void;
  socketCallback: (message: Message) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined
);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const {
    conversations: fetchedConversations,
    isLoading,
    error,
  } = useMyConversations();
  const { user, isAuthenticated } = useAuthStore();

  // State for final conversations (fetched + real-time updates)
  const [finalConversations, setFinalConversations] = useState<Conversation[]>(
    []
  );

  // Update finalConversations when fetched conversations change
  useEffect(() => {
    setFinalConversations(fetchedConversations);
  }, [fetchedConversations]);

  // Clear conversations when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setFinalConversations([]);
    }
  }, [isAuthenticated]);

  // Memoize the addMessage function to prevent infinite loops
  const addMessage = useCallback(
    (message: Message) => {
      if (!user) return;

      setFinalConversations((prevConversations) => {
        const newConversations = [...prevConversations];

        // Find the conversation between the sender and recipient
        const conversationIndex = newConversations.findIndex(
          (conv) =>
            (conv.chatWith.id === message.sender.id &&
              user.id === message.recipient.id) ||
            (conv.chatWith.id === message.recipient.id &&
              user.id === message.sender.id)
        );

        if (conversationIndex !== -1) {
          // Update existing conversation
          const updatedConversation = {
            ...newConversations[conversationIndex],
            content: {
              text: message.content.text,
            },
            updatedAt: message.createdAt,
            unreadCount:
              message.sender.id === user.id
                ? newConversations[conversationIndex].unreadCount
                : newConversations[conversationIndex].unreadCount + 1,
          };

          newConversations[conversationIndex] = updatedConversation;

          // Move updated conversation to the top
          newConversations.unshift(
            newConversations.splice(conversationIndex, 1)[0]
          );
        } else {
          // Create new conversation if it doesn't exist
          const newConversation: Conversation = {
            content: {
              text: message.content.text,
            },
            createdAt: message.createdAt,
            updatedAt: message.createdAt,
            unreadCount: message.sender.id === user.id ? 0 : 1,
            chatWith:
              message.sender.id === user.id
                ? message.recipient
                : message.sender,
          };

          newConversations.unshift(newConversation);
        }

        return newConversations;
      });
    },
    [user]
  );

  // Memoize the socket callback to prevent infinite loops
  const socketCallback = useCallback(
    (message: Message) => {
      addMessage(message);
    },
    [addMessage]
  );

  // Connect to socket for real-time messaging
  const socket = useSocket({
    serverUrl: process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL || null,
    userId: user?.id || "",
    onNotification: () => {}, // We don't handle notifications here
    onMessage: socketCallback,
  });

  // Log socket connection status
  useEffect(() => {
    if (socket) {
      console.log("Socket connected for messages in MessagesContext");
    }
  }, [socket]);

  const value: MessagesContextType = useMemo(
    () => ({
      conversations: finalConversations,
      unreadCount: finalConversations.filter((notif) => notif.unreadCount > 0)
        .length,
      addMessage,
      socketCallback,
      loading: isLoading,
      error: error?.message || null,
    }),
    [finalConversations, addMessage, socketCallback, isLoading, error]
  );

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
}
