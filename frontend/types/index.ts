export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  pricePerSquareMeter: number;
  location: {
    region: string;
    city: string;
    subCity: string;
    neighborhood: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  type: "apartment" | "house" | "commercial" | "office";
  status: "Active" | "Rented" | "Sold";
  images: string[]; // Maximum of 5 images allowed
  listingType: "rent" | "sale";
  features: {
    bedrooms?: number;
    bathrooms?: number;
    area: number;
    parking?: boolean;
    // furnished?: boolean;
  };
  owner: User;
  views: number;
  viewedBy: String[];
  rating: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
  moderationStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
}

export interface User {
  id: string;
  telegramId?: string;
  userName?: string;
  email: string;
  password?: string | undefined;
  passwordConfirm?: string | undefined;
  passwordChangedAt?: Date;
  mfaEnabled?: boolean;
  mfaBy?: "email" | "sms" | "authenticator";
  name: string;
  phone: string;
  profilePhoto?: string;
  contactInfo?: {
    whatsapp?: string;
    telegram?: string;
  };
  role: "SuperAdmin" | "Admin" | "Broker" | "User";
  // brokerDetails
  companyName?: string;
  license?: string;
  businessCard?: string;
  yearsOfExperience?: number;
  isVerified?: boolean;
  status: "approved" | "pending" | "rejected";
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  specialties?: string[];
  description?: string;
  activeListings?: number;
  completedDeals?: number;
  properties?: Property[];

  // user
  preferences?: {
    location?: string;
    priceRange?: { min: number; max: number };
    propertyType?: string[];
  };

  notifications?: {
    email?: boolean;
    inApp?: boolean;
  };

  lastActive?: Date;
  createdAt: String;
  updatedAt?: String;
  isActive: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  id: string;
  content: {
    text: string;
  };
  sender: {
    _id: string;
    id: string;
    name: string;
    profilePhoto?: string;
  };
  recipient: {
    _id: string;
    id: string;
    name: string;
    profilePhoto?: string;
  };
  isRead: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Conversation {
  content: {
    text: string;
  };
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
  chatWith: {
    _id: string;
    id: string;
    name: string;
    profilePhoto?: string;
  };
}

export interface SearchFilters {
  query?: string;
  location?: {
    region?: string;
    city?: string;
    subCity?: string;
    neighborhood?: string;
  };
  priceRange?: [number, number];
  propertyType?: string;
  status?: string;
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    minArea?: number;
    maxArea?: number;
    parking?: boolean;
    furnished?: boolean;
  };
  sortBy?: "newest" | "price_low" | "price_high" | "popularity" | "rating";
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    start_param?: string;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  isClosingConfirmationEnabled: boolean;
  headerColor: string;
  backgroundColor: string;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  HapticFeedback: {
    impactOccurred: (
      style: "light" | "medium" | "heavy" | "rigid" | "soft"
    ) => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  close: () => void;
  expand: () => void;
  ready: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export interface Notification {
  _id?: string;
  id: string;
  recipient: string;
  type:
    | "propertyApproved"
    | "passwordReset"
    | "propertyRejected"
    | "propertyUpdated";
  title: string;
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  socketCallback: (notification: Notification) => void;
  loading: boolean;
  error: string | null;
}

export interface IPropertyRequest {
  id: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  type: "apartment" | "house" | "commercial" | "office";
  propertyPurpose: "rent" | "sale" | "both";
  minPrice: number;
  maxPrice: number;
  location: string;
  description?: string;
  area: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: Boolean;
  status: "pending" | "in-progress" | "completed" | "rejected";
  servedBy?: string;
  servedAt?: Date;
  priority?: "low" | "medium" | "high";
  notes?: string;
}
