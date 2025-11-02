"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo } from "react";
import { useMessages } from "@/context/MessagesContext";
import { ConversationsList } from "@/components/messages/conversations-list";
import { ChatContainer } from "@/components/messages/chat-container";
import { Conversation, User } from "@/types";
import { useAuthStore } from "@/store/auth";
import { useBrokerById } from "@/hooks/useBrokers";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagesPage />
    </Suspense>
  );
}

function MessagesPage() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversation");
  const brokerId = searchParams.get("broker");
  const { conversations, loading, error } = useMessages();
  const { user } = useAuthStore();

  // Fetch broker information if starting a new conversation
  const { broker: brokerInfo, isLoading: brokerLoading } = useBrokerById(
    brokerId || ""
  );

  // Find the selected conversation
  const selectedConversation = useMemo(() => {
    if (conversationId) {
      return (
        conversations.find((conv) => conv.chatWith.id === conversationId) ||
        null
      );
    }

    // If brokerId is provided, create a new conversation object for new chats
    if (brokerId) {
      // Check if conversation already exists
      const existingConversation = conversations.find(
        (conv) => conv.chatWith.id === brokerId
      );

      if (existingConversation) {
        return existingConversation;
      }

      // Create new conversation object that updates when broker info loads
      const newConversation: Conversation = {
        content: { text: "" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        unreadCount: 0,
        chatWith: {
          _id: brokerId,
          id: brokerId,
          name: brokerInfo?.name || "Loading...", // Will update when brokerInfo loads
          profilePhoto: brokerInfo?.profilePhoto,
        },
      };

      return newConversation;
    }

    return null;
  }, [conversationId, brokerId, conversations, brokerInfo]);

  // Update conversation object when broker info loads (for new conversations)
  const updatedConversation = useMemo(() => {
    if (
      selectedConversation &&
      brokerId &&
      brokerInfo &&
      selectedConversation.chatWith.name === "Loading..."
    ) {
      return {
        ...selectedConversation,
        chatWith: {
          ...selectedConversation.chatWith,
          name: brokerInfo.name,
          profilePhoto: brokerInfo.profilePhoto,
        },
      };
    }
    return selectedConversation;
  }, [selectedConversation, brokerId, brokerInfo]);

  // Memoize the callback to prevent unnecessary re-renders
  const handleConversationSelect = useCallback((conversationId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("conversation", conversationId);
    url.searchParams.delete("broker"); // Remove broker param when selecting existing conversation
    window.history.replaceState({}, "", url.toString());
  }, []);

  // Memoize the callback to clear conversation
  const handleBackFromChat = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("conversation");
    url.searchParams.delete("broker");
    window.history.replaceState({}, "", url.toString());
  }, []);

  // Show loading state only for initial conversations loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">
            Loading conversations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-sm">Error loading conversations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background">
      <div className="h-full grid grid-cols-1 lg:grid-cols-3">
        {/* Left side - Conversation list */}
        <div
          className={`lg:col-span-1 border-r ${
            updatedConversation ? "hidden lg:block" : "block"
          }`}
        >
          <div className="h-screen flex flex-col">
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold">Messages</h1>
            </div>
            <div className="h-screen flex-1 overflow-scroll scrollbar-hide">
              <ConversationsList
                conversations={conversations}
                onConversationSelect={handleConversationSelect}
                selectedConversationId={conversationId || undefined}
              />
            </div>
          </div>
        </div>

        {/* Right side - Chat interface or select message */}
        <div
          className={`lg:col-span-2 h-full flex flex-col ${
            updatedConversation ? "block" : "hidden lg:block"
          }`}
        >
          <ChatContainer
            selectedConversation={updatedConversation}
            onBack={handleBackFromChat}
          />
        </div>
      </div>
    </div>
  );
}

