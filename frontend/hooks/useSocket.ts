import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Message, Notification } from "../types";

interface UseSocketProps {
  serverUrl: string | null;
  userId: string; // This will be used as the roomId
  onNotification: (data: Notification | Message) => void;
  onMessage?: (message: Message) => void; // Optional callback for messages
}

export const useSocket = ({
  serverUrl,
  userId,
  onNotification,
  onMessage,
}: UseSocketProps): Socket | null => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Only create socket connection if serverUrl is provided
    if (!serverUrl) {
      console.log("No backend server URL provided - running in demo mode");
      return;
    }

    console.log("Attempting to connect to:", serverUrl);

    const socket = io(serverUrl, {
      transports: ["websocket", "polling"], // Fallback to polling if websocket fails
      timeout: 5000, // 5 second timeout
      forceNew: true,
    });

    socket.on("connect", () => {
      console.log("Connected to server");
      // Join the user-specific room after connecting
      if (userId) {
        socket.emit("joinRoom", userId);
        console.log("Emitted joinRoom for", userId);
      }
    });

    // Debug: log all events received (if onAny is available)
    if (socket.onAny) {
      socket.onAny((event, ...args) => {
        console.log("[Socket Event]", event, args);
      });
    }

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
    });

    socket.on("connect_error", (error) => {
      console.log("Connection error:", error.message);
      // Don't throw error, just log it
    });

    socket.on("notification", (notification: Notification) => {
      console.log("Received notification:", notification);
      onNotification(notification);
    });

    // Listen for new_notification events from backend
    socket.on("new_notification", (notification: Notification) => {
      console.log("Received new_notification:", notification);
      onNotification(notification);
    });

    socket.on("new_message", (message: Message) => {
      console.log("Received new_message:", message);
      // Call both callbacks if provided
      onNotification(message);
      if (onMessage) {
        onMessage(message);
      }
    });

    socketRef.current = socket;

    // return () => {
    //   console.log("Cleaning up socket connection");
    //   socket.disconnect();
    //   socketRef.current = null;
    // };
  }, [serverUrl, userId, onNotification, onMessage]);

  return socketRef.current;
};
