import { create } from "zustand";
import { User } from "@/types";

interface BrokersState {
  brokers: User[];
  newBrokers: User[];
  mostReviewedBrokers: User[];
  isLoading: boolean;

  fetchBrokers: () => Promise<void>;
  fetchNewBrokers: () => Promise<void>;
  fetchMostReviewedBrokers: () => Promise<void>;
}

export const useBrokersStore = create<BrokersState>((set, get) => ({
  brokers: [],
  newBrokers: [],
  mostReviewedBrokers: [],
  isLoading: false,

  fetchBrokers: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      const mockBrokers: User[] = [
        {
          id: "1",
          name: "John Broker",
          email: "john@addisbroker.com",
          phone: "+251911234567",
          profilePhoto:
            "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
          contactInfo: {
            whatsapp: "+251911234567",
            telegram: "@johnbroker",
          },
          role: "Broker",
          isActive: true,
          rating: 4.8,
          reviewCount: 45,
          specialties: ["Residential", "Commercial"],
          description:
            "Experienced broker with 5+ years in Addis Ababa real estate market",
          activeListings: 12,
          completedDeals: 78,
          createdAt: "2023-06-15T08:00:00Z",
          isVerified: true,
          status: "approved",
        },
        {
          id: "2",
          name: "Sarah Properties",
          email: "sarah@addisbroker.com",
          phone: "+251911234568",
          profilePhoto:
            "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg",
          contactInfo: {
            whatsapp: "+251911234568",
            telegram: "@sarahproperties",
          },
          role: "Broker",
          isActive: true,
          rating: 4.9,
          reviewCount: 67,
          specialties: ["Luxury Homes", "Investment Properties"],
          description:
            "Specialist in luxury properties and investment opportunities",
          activeListings: 8,
          completedDeals: 95,
          createdAt: "2023-08-20T10:00:00Z",
          isVerified: true,
          status: "approved",
        },
        {
          id: "3",
          name: "Mike Real Estate",
          email: "mike@addisbroker.com",
          phone: "+251911234569",
          profilePhoto:
            "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
          contactInfo: {
            whatsapp: "+251911234569",
            telegram: "@mikerealestate",
          },
          role: "Broker",
          isActive: true,
          rating: 4.6,
          reviewCount: 32,
          specialties: ["Commercial", "Land"],
          description:
            "Commercial real estate expert with extensive market knowledge",
          activeListings: 15,
          completedDeals: 54,
          createdAt: "2024-01-10T14:00:00Z",
          isVerified: true,
          status: "approved",
        },
      ];

      set({
        brokers: mockBrokers,
        newBrokers: mockBrokers.slice(0, 3),
        mostReviewedBrokers: mockBrokers
          .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
          .slice(0, 3),
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchNewBrokers: async () => {
    const { brokers } = get();
    const newBrokers = brokers
      .sort(
        (a, b) =>
          new Date(
            typeof b.createdAt === "string" ? b.createdAt : String(b.createdAt)
          ).getTime() -
          new Date(
            typeof a.createdAt === "string" ? a.createdAt : String(a.createdAt)
          ).getTime()
      )
      .slice(0, 3);
    set({ newBrokers });
  },

  fetchMostReviewedBrokers: async () => {
    const { brokers } = get();
    const mostReviewedBrokers = brokers
      .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      .slice(0, 3);
    set({ mostReviewedBrokers });
  },
}));

