"use client";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ChatContainer } from "@/components/messages/chat-container";
import { useMessages } from "@/context/MessagesContext";

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  // This component needs to be client-side to use the hook
  // We'll need to create a client component wrapper
  return (
    <div className="h-screen bg-background">
      <main className="pb-20">
        <ChatPageClient id={params.id} />
      </main>
    </div>
  );
}

// Client component to use the hook
function ChatPageClient({ id }: { id: string }) {
  const { conversations } = useMessages();

  const conversation = conversations.find((conv) => conv.chatWith.id === id);

  if (!conversation) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Conversation not found</p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    window.history.back();
  };

  return (
    <ChatContainer selectedConversation={conversation} onBack={handleBack} />
  );
}

