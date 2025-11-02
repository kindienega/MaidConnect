"use client";

import { useEffect } from "react";
import {
  Bell,
  CheckCircle,
  XCircle,
  RefreshCw,
  Lock,
  Trash2,
  CheckCheck,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useNotifications,
  NotificationProvider,
} from "@/context/NotificationContext";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/auth";
import {
  useMarkNotificationAsRead,
  useMarkAllNotificationAsRead,
  useClearAllNotifications,
  useClearNotification,
} from "@/hooks/useNotificationActions";

export function NotificationDropdown() {
  const { user } = useAuthStore();

  return (
    <NotificationProvider>
      <NotificationDropdownContent user={user} />
    </NotificationProvider>
  );
}

function NotificationDropdownContent({ user }: { user: any }) {
  const { notifications, unreadCount, socketCallback, error } =
    useNotifications();

  // Use mutation hooks for actions
  const markNotificationAsRead = useMarkNotificationAsRead();
  const markAllNotificationAsRead = useMarkAllNotificationAsRead();
  const clearAllNotifications = useClearAllNotifications();
  const clearNotification = useClearNotification();

  // Create a callback that handles both notifications and messages
  const handleSocketData = (data: any) => {
    // Check if it's a message or notification based on the data structure
    if (data.content && data.sender && data.recipient) {
      // It's a message - we'll handle this in the MessagesContext
      console.log("Message received in NotificationDropdown:", data);
      // Don't process messages here, let MessagesContext handle them
    } else {
      // It's a notification - process it normally
      socketCallback(data);
    }
  };

  // Connect to socket for real-time notifications and messages
  const socket = useSocket({
    serverUrl: process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL || null,
    userId: user?.id || "",
    onNotification: handleSocketData,
  });

  // Log socket connection status
  useEffect(() => {
    if (socket) {
      console.log("Socket connected for notifications and messages");
    }
  }, [socket]);

  const handleNotificationClick = async (notificationId: string) => {
    markNotificationAsRead.mutate({ notificationId });
  };

  const handleMarkAllAsRead = async () => {
    markAllNotificationAsRead.mutate({ userId: user?.id || "" });
  };

  const handleClearNotification = async (notificationId: string) => {
    clearNotification.mutate({ notificationId });
  };

  const handleClearAllNotifications = async () => {
    clearAllNotifications.mutate({ userId: user?.id || "" });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "propertyApproved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "propertyRejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "propertyUpdated":
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      case "passwordReset":
        return <Lock className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case "propertyApproved":
        return "Property Approved";
      case "propertyRejected":
        return "Property Rejected";
      case "propertyUpdated":
        return "Property Updated";
      case "passwordReset":
        return "Password Reset";
      default:
        return "Notification";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 min-h-[200px] max-h-96 overflow-y-auto"
      >
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center space-x-2">
            <DropdownMenuLabel>
              {notifications.length > 0
                ? `${notifications.length} Notifications`
                : "Notifications"}
            </DropdownMenuLabel>
          </div>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAllNotifications}
                disabled={clearAllNotifications.isPending}
                className="text-xs text-muted-foreground hover:text-destructive"
                title="Clear all notifications"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markAllNotificationAsRead.isPending}
                className="text-xs text-muted-foreground hover:text-foreground"
                title="Mark all as read"
              >
                <CheckCheck className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        {error && (
          <div className="p-4 text-center text-destructive">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm">No notifications yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              You'll see notifications here when they arrive
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id || notification._id}
              className="p-3 border-b last:border-b-0"
            >
              <div className="flex items-start space-x-3 w-full">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-medium ${
                        !notification.isRead
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {getNotificationTitle(notification.type)}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearNotification(
                            notification.id || notification._id || ""
                          );
                        }}
                        disabled={clearNotification.isPending}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        title="Remove notification"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      !notification.isRead
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    {!notification.isRead && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(
                              notification.id || notification._id || ""
                            );
                          }}
                          disabled={markNotificationAsRead.isPending}
                          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="mr-2 h-3 w-3" />
                          Mark as read
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

