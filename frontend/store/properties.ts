import { create } from "zustand";
import { Property, SearchFilters } from "@/types";
import { useTelegramStore } from "./telegram";

interface PropertiesState {
  properties: Property[];
  filteredProperties: Property[];
  currentProperty: Property | undefined | null;
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
  fetchProperties: () => Promise<void>;
  getProperty: (id: string) => Promise<Property>;
  searchProperties: (query: string) => void;
  createProperty: (property: FormData) => Promise<Property>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
}

export const usePropertiesStore = create<PropertiesState>((set, get) => ({
  properties: [],
  filteredProperties: [],
  currentProperty: undefined,
  isLoading: false,
  error: null,
  filters: {
    query: "",
    propertyType: "",
    location: { region: "" },
    priceRange: [0, 500000000],
    sortBy: "newest",
  },

  fetchProperties: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/properties");
      if (response.ok) {
        const data = await response.json();
        set({ properties: data.properties });
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getProperty: async (id: string) => {
    console.log(id, "form properties store getProperty");
    try {
      // Reset currentProperty to undefined when starting to fetch
      set({ currentProperty: undefined });

      // Try to get token from localStorage (Telegram users)
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("jwt");
      }

      const response = await fetch(`/api/properties/${id}`, {
        method: "GET",
        credentials: "include", // for browser users (cookies)
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.log("errrrorrrrr before catch", errorBody);
        // Set currentProperty to null if property not found
        if (response.status === 404) {
          set({ currentProperty: null });
          throw new Error("Property not found");
        }
        throw new Error(errorBody.error || "Failed to fetch property.");
      }

      const result = await response.json();
      console.log("result", result);
      const { property } = result;
      set({ currentProperty: property });
      return property;
    } catch (error) {
      console.log(error, "from the store");
      // Set currentProperty to null on error
      set({ currentProperty: null });
      throw error;
    }
  },

  searchProperties: (query: string) => {
    const { properties } = get();
    const filtered = properties.filter(
      (property) =>
        property.title.toLowerCase().includes(query.toLowerCase()) ||
        property.description.toLowerCase().includes(query.toLowerCase())
    );
    set({ filteredProperties: filtered });
  },

  createProperty: async (property: FormData) => {
    try {
      console.log(property.get("pricePerSquareMeter"), "from the store");
      set({ isLoading: true });

      const isInTelegram = useTelegramStore.getState().isInTelegram;
      let headers: HeadersInit = {};

      // Add authentication based on context
      if (isInTelegram === false) {
        // Web user - use credentials
        const response = await fetch("/api/properties/add", {
          method: "POST",
          credentials: "include",
          headers,
          body: property, // Send FormData directly
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create property");
        }

        const result = await response.json();
        const createdProperty = result.property;

        return createdProperty;
      } else if (isInTelegram === true) {
        // Telegram user - use Authorization header
        const token = localStorage.getItem("jwt");
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch("/api/properties/add", {
          method: "POST",
          credentials: "include",
          headers,
          body: property, // Send FormData directly
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create property");
        }

        const result = await response.json();
        const createdProperty = result.property;

        return createdProperty;
      } else {
        throw new Error("Unable to determine user context");
      }
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProperty: async (id: string, property: Partial<Property>) => {
    try {
      set({ isLoading: true });
      // Simulate API call
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProperty: async (id: string) => {
    try {
      set({ isLoading: true });
      // Simulate API call
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setFilters: (newFilters: Partial<SearchFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  clearFilters: () => {
    set({
      filters: {
        query: "",
        propertyType: "",
        location: { region: "" },
        priceRange: [0, 500000000],
        sortBy: "newest",
      },
    });
  },
}));

