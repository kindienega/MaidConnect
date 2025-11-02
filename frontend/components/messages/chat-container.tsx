"use client";

import React from "react";
import { Conversation } from "@/types";
import { ChatInterface } from "./chat-interface";

interface ChatContainerProps {
  selectedConversation: Conversation | null;
  onBack?: () => void;
}

export function ChatContainer({
  selectedConversation,
  onBack,
}: ChatContainerProps) {
  if (!selectedConversation) {
    return (
      <div className="h-screen hidden lg:flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">
            Select a chat to start conversation
          </h3>
          <p className="text-sm">
            Choose a broker from the list to begin messaging
          </p>
        </div>
      </div>
    );
  }

  return <ChatInterface conversation={selectedConversation} onBack={onBack} />;
}
