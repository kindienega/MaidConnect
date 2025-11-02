"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageCircle, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Conversation } from "@/types";

interface ConversationsListProps {
  conversations: Conversation[];
  onConversationSelect: (conversationId: string) => void;
  selectedConversationId?: string;
}

export function ConversationsList({
  conversations,
  onConversationSelect,
  selectedConversationId,
}: ConversationsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brokerId = searchParams.get("broker");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conv) =>
    (conv.chatWith?.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleConversationClick = (conversationId: string) => {
    onConversationSelect(conversationId);
  };

  const handleNewMessage = (brokerId: string) => {
    // Check if conversation already exists
    const existingConversation = conversations.find(
      (conv) => conv.chatWith?.id === brokerId
    );

    if (existingConversation) {
      router.push(`/messages/${existingConversation.chatWith?.id || brokerId}`);
    } else {
      // In a real app, you would create a new conversation here
      router.push(`/messages/new?broker=${brokerId}`);
    }
  };

  // Auto-navigate to conversation if brokerId is provided
  React.useEffect(() => {
    if (brokerId) {
      const existingConversation = conversations.find(
        (conv) => conv.chatWith?.id === brokerId
      );

      if (existingConversation) {
        // Update URL without navigation to show the conversation in the right panel
        onConversationSelect(existingConversation.chatWith?.id || brokerId);
      }
    }
  }, [brokerId, conversations, onConversationSelect]);

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
        {filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery
                  ? "No conversations found"
                  : "Select a chat to send message"}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "Start a conversation with a broker by clicking the Message button on their profile."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationCard
              key={conversation.chatWith?.id || `conv-${Math.random()}`}
              conversation={conversation}
              onClick={() =>
                handleConversationClick(conversation.chatWith?.id || "")
              }
              isSelected={conversation.chatWith?.id === selectedConversationId}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface ConversationCardProps {
  conversation: Conversation;
  onClick: () => void;
  isSelected?: boolean;
}

function ConversationCard({
  conversation,
  onClick,
  isSelected,
}: ConversationCardProps) {
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (diffInHours < 48) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      }
    } catch (error) {
      return "Unknown time";
    }
  };

  // Get safe values with fallbacks
  const chatWithName = conversation.chatWith?.name || "Unknown User";
  const chatWithPhoto = conversation.chatWith?.profilePhoto;
  const chatWithInitial = chatWithName.charAt(0).toUpperCase();

  return (
    <Card
      className={`cursor-pointer transition-colors ${
        isSelected
          ? "bg-accent text-accent-foreground border-primary/20"
          : "hover:bg-muted/50"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={chatWithPhoto} alt={chatWithName} />
              <AvatarFallback className="text-sm font-semibold">
                {chatWithInitial}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">{chatWithName}</h3>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs ${
                    isSelected
                      ? "text-accent-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {conversation.createdAt
                    ? formatTime(conversation.createdAt)
                    : "Unknown time"}
                </span>
                {conversation.unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </div>

            <p
              className={`text-sm truncate ${
                isSelected
                  ? "text-accent-foreground/70"
                  : "text-muted-foreground"
              }`}
            >
              {conversation.content?.text || "No message content"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

