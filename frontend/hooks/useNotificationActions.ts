import { useMutation, useQueryClient } from "@tanstack/react-query";

const markNotificationAsRead = async ({
  notificationId,
}: {
  notificationId: string;
}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(
    `/api/notifications/${notificationId}/mark-read`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to mark notification as read.");
  }

  return result;
};

const markAllNotificationsAsRead = async ({ userId }: { userId: string }) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/notifications/${userId}/mark-all-read`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Failed to mark all notifications as read."
    );
  }

  return result;
};

const clearAllNotifications = async ({ userId }: { userId: string }) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/notifications/${userId}/clear-all`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to clear all notifications.");
  }

  return result;
};

const clearNotification = async ({
  notificationId,
}: {
  notificationId: string;
}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/notifications/${notificationId}/clear`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to mark notification as read.");
  }

  return result;
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Invalidate and refetch own properties list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => {
      console.log(error);
      // toast.error(error.message || "Failed to mark notification as read");
    },
  });
};

export const useMarkAllNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Invalidate and refetch own properties list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => {
      console.log(error);
      // toast.error(error.message || "Failed to mark all notifications as read");
    },
  });
};

export const useClearAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearAllNotifications,
    onSuccess: () => {
      // Invalidate and refetch notifications list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => {
      console.log(error);
      // toast.error(error.message || "Failed to clear all notifications");
    },
  });
};

export const useClearNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearNotification,
    onSuccess: () => {
      // Invalidate and refetch notifications list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => {
      console.log(error);
      // toast.error(error.message || "Failed to clear notification");
    },
  });
};
