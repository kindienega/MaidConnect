import { Property, Notification } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface NotificationsResponse {
  data: {
    documents: Notification[];
  };
}

const getAllNotifications = async (
  id: string
): Promise<NotificationsResponse> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const response = await fetch(`/api/notifications/${id}`, {
    method: "GET",
    credentials: "include", // allow cookies
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    // throw new Error(result.error || "Failed to fetch notifications.");
    return {
      data: {
        documents: [],
      },
    };
  }

  return result;
};

export const useFetchNotifications = (id: string) => {
  const { data, isLoading, error } = useQuery<NotificationsResponse>({
    queryKey: ["notifications", id],
    queryFn: () => getAllNotifications(id),
  });

  const notifications = data?.data?.documents || [];

  return { notifications, isLoading, error };
};

