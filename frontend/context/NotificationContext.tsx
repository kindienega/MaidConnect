import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Notification, NotificationContextType } from "../types";
import { useAuthStore } from "../store/auth";
import { useFetchNotifications } from "../hooks/useFetchNotifications";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  // State for final notifications (fetched + socket)
  const [finalNotifications, setFinalNotifications] = useState<Notification[]>(
    []
  );

  // Get user id and authentication status from useAuthStore
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.id || null;

  // Use the useFetchNotifications hook instead of direct axios calls
  // Pass userId only when authenticated to ensure proper fetching
  const {
    notifications: fetchedNotifications,
    isLoading,
    error: fetchError,
  } = useFetchNotifications(isAuthenticated && userId ? userId : "");

  // Map the fetched notifications to ensure they have the correct structure
  // Use useMemo to prevent recreation on every render
  const mappedFetchedNotifications = useMemo(() => {
    return fetchedNotifications
      ? fetchedNotifications.map((notif: any) => ({
          _id: notif._id || notif.id,
          id: notif.id || notif._id || Date.now().toString(),
          recipient: notif.recipient || notif.userId || "",
          type: notif.type || "propertyApproved",
          title: notif.title || notif.message || "Notification",
          message:
            notif.message || notif.title || "You have a new notification",
          metadata: notif.metadata || {},
          isRead: notif.isRead || false,
          createdAt: notif.createdAt || new Date().toISOString(),
          updatedAt: notif.updatedAt || new Date().toISOString(),
        }))
      : [];
  }, [fetchedNotifications]);

  // Update finalNotifications when fetched notifications change
  useEffect(() => {
    setFinalNotifications(mappedFetchedNotifications);
  }, [mappedFetchedNotifications]);

  // Clear notifications when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setFinalNotifications([]);
    }
  }, [isAuthenticated]);

  // Memoize the addNotification function to prevent infinite loops
  const addNotification = useCallback((notification: Notification) => {
    const newNotification: Notification = {
      ...notification,
      id: notification.id || notification._id || Date.now().toString(),
      isRead: false,
      createdAt: notification.createdAt || new Date().toISOString(),
      updatedAt: notification.updatedAt || new Date().toISOString(),
    };

    setFinalNotifications((prev) => {
      // Check if notification already exists in fetched notifications
      const exists = prev.some(
        (n) =>
          n.id === newNotification.id ||
          n._id === newNotification.id ||
          n.id === newNotification._id ||
          n._id === newNotification._id
      );

      // If notification exists, do nothing
      if (exists) return prev;

      // If notification doesn't exist, add it to the beginning
      return [newNotification, ...prev];
    });
  }, []);

  // Memoize the socket callback to prevent infinite loops
  const socketCallback = useCallback(
    (notification: Notification) => {
      addNotification(notification);
    },
    [addNotification]
  );

  const unreadCount = useMemo(
    () => finalNotifications.filter((notif) => !notif.isRead).length,
    [finalNotifications]
  );

  const value: NotificationContextType = useMemo(
    () => ({
      notifications: finalNotifications,
      unreadCount,
      addNotification,
      socketCallback,
      loading: isLoading,
      error: fetchError?.message || null,
    }),
    [
      finalNotifications,
      unreadCount,
      addNotification,
      socketCallback,
      isLoading,
      fetchError,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

