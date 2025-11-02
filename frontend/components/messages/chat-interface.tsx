"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation, Message } from "@/types";
import { useTelegramStore } from "@/store/telegram";
import { useChatWith } from "@/hooks/useChatWith";
import { useAuthStore } from "@/store/auth";
import { useMessages } from "@/context/MessagesContext";
import {
  useMarkMessageAsRead,
  useSendMessage,
} from "@/hooks/useMessageActions";

interface ChatInterfaceProps {
  conversation: Conversation;
  messages?: Message[];
  onBack?: () => void;
}

export function ChatInterface({
  conversation,
  messages: initialMessages,
  onBack,
}: ChatInterfaceProps) {
  const router = useRouter();
  const { showBottomNav } = useTelegramStore();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMarkedAsRead = useRef(false);
  const { user } = useAuthStore();
  const { addMessage } = useMessages();

  // Get safe values with fallbacks
  const chatWithId = conversation.chatWith?.id || "";
  const chatWithId_ = conversation.chatWith?._id || "";
  const chatWithName = conversation.chatWith?.name || "Unknown User";
  const chatWithPhoto = conversation.chatWith?.profilePhoto;
  const chatWithInitial = chatWithName.charAt(0).toUpperCase();

  // Use the hook to fetch messages
  const { messages, isLoading, error } = useChatWith(chatWithId);

  // Check if this is a new conversation (no existing messages)
  const isNewConversation =
    conversation.content?.text === "" && messages.length === 0;

  // Check if broker info is still loading
  const isBrokerInfoLoading = chatWithName === "Loading...";

  // Mark messages as read when opening the conversation (only for existing conversations)
  const markAsReadMutation = useMarkMessageAsRead(chatWithId_);

  // Send message mutation
  const sendMessageMutation = useSendMessage({
    data: {
      recipient: chatWithId_,
      content: { text: newMessage },
    },
    chatWithId: chatWithId,
  });

  // Auto-scroll functionality
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change or component mounts
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom when conversation changes
  useEffect(() => {
    scrollToBottom();
  }, [chatWithId]);

  // Mark messages as read when conversation is opened (only for existing conversations)
  useEffect(() => {
    if (chatWithId_ && !hasMarkedAsRead.current && !isNewConversation) {
      hasMarkedAsRead.current = true;
      markAsReadMutation.mutate(chatWithId_);
    }
  }, [chatWithId_, isNewConversation, markAsReadMutation]);

  const handleBackClick = () => {
    if (onBack) {
      // Use the callback to clear selected conversation
      onBack();
    } else if (showBottomNav) {
      // In Telegram mini app, navigate to messages page
      router.push("/messages");
    } else {
      // In regular web, navigate to messages page
      router.push("/messages");
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    // Create a temporary message for immediate UI update
    const tempMessage: Message = {
      _id: `temp-${Date.now()}`,
      id: `temp-${Date.now()}`,
      content: { text: newMessage },
      sender: {
        _id: user.id,
        id: user.id,
        name: user.name || "You",
        profilePhoto: user.profilePhoto,
      },
      recipient: {
        _id: chatWithId_,
        id: chatWithId,
        name: chatWithName,
        profilePhoto: chatWithPhoto,
      },
      isRead: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };

    // Add the message to the MessagesContext for real-time updates
    addMessage(tempMessage);

    // Send the message using the hook
    sendMessageMutation.mutate(undefined, {
      onSuccess: () => {
        // Clear the input after successful send
        setNewMessage("");
      },
      onError: (error) => {
        console.error("Failed to send message:", error);
        // You can add toast notification here if needed
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-sm">Error loading messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Chat Header - fixed at top */}
      <div className="bg-white border-b px-4 py-3 shrink-0 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="p-0 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={() => router.push(`/brokers/${chatWithId}`)}
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={chatWithPhoto} alt={chatWithName} />
                <AvatarFallback className="text-sm font-semibold">
                  {chatWithInitial}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">
                {isBrokerInfoLoading ? (
                  <span className="flex items-center space-x-2">
                    <span>{chatWithName}</span>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                  </span>
                ) : (
                  chatWithName
                )}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isNewConversation ? "Start a conversation" : "Broker"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area - scrollable */}
      <div className="h-screen overflow-scroll scrollbar-hide">
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-hide space-y-3">
          {messages && messages.length > 0 ? (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                formatTime={formatTime}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              {isNewConversation ? (
                <div>
                  <p className="text-lg font-medium mb-2">
                    Start a conversation
                  </p>
                  <p className="text-sm">
                    Send your first message to begin chatting
                  </p>
                </div>
              ) : (
                <p>No messages yet. Start the conversation!</p>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input - fixed at bottom with conditional padding for Telegram */}
      <div
        className={`bg-white border-t p-4 shrink-0 sticky bottom-0 z-10 ${
          showBottomNav ? "pb-20" : ""
        }`}
      >
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder={
              isNewConversation
                ? "Type your first message..."
                : "Type a message..."
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            size="sm"
            className="p-2"
          >
            {sendMessageMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  formatTime: (timestamp: string) => string;
}

function MessageBubble({ message, formatTime }: MessageBubbleProps) {
  const { user } = useAuthStore();

  // Determine if this is the current user's message
  const isOwnMessage = user?.id === message.sender.id;

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md ${
          isOwnMessage ? "order-2" : "order-1"
        }`}
      >
        <div
          className={`rounded-lg px-3 py-2 ${
            isOwnMessage
              ? "bg-primary text-primary-foreground"
              : "bg-white border"
          }`}
        >
          <p className="text-sm">{message.content.text}</p>
          <p
            className={`text-xs mt-1 ${
              isOwnMessage
                ? "text-primary-foreground/70"
                : "text-muted-foreground"
            }`}
          >
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

