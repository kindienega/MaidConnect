"use client";

import { Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMyConversations } from "@/hooks/useMyConversations";

interface ContactButtonsProps {
  phone?: string;
  email: string;
  brokerId: string;
}

export function ContactButtons({
  phone,
  email,
  brokerId,
}: ContactButtonsProps) {
  const router = useRouter();
  const { conversations } = useMyConversations();

  const handleSendMessage = () => {
    // Check if conversation already exists
    const existingConversation = conversations.find(
      (conv) => conv.chatWith.id === brokerId
    );

    if (existingConversation) {
      // Navigate to existing conversation
      router.push(`/messages?conversation=${existingConversation.chatWith.id}`);
    } else {
      // In a real app, you would create a new conversation here
      // For now, we'll navigate to messages page and let the user start a new conversation
      router.push(`/messages?broker=${brokerId}`);
    }
  };

  return (
    <div className="space-y-3">
      {phone && (
        <Button
          className="w-full"
          size="lg"
          onClick={() => window.open(`tel:${phone}`)}
        >
          <Phone className="h-4 w-4 mr-2" />
          Call {phone}
        </Button>
      )}
      <Button
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() => window.open(`mailto:${email}`)}
      >
        <Mail className="h-4 w-4 mr-2" />
        Send Email
      </Button>
      <Button className="w-full" size="lg" onClick={handleSendMessage}>
        <MessageCircle className="h-4 w-4 mr-2" />
        Send Message
      </Button>
    </div>
  );
}

