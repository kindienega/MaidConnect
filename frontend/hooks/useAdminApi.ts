"use client";
import { useState } from "react";
import { User, Listing, Review, Transaction } from "@/types/admin";

// --- MOCK DATA ---
const MOCK_USERS: User[] = [
  {
    _id: "1",
    name: "Alice Admin",
    email: "alice@admin.com",
    role: "Admin",
    status: "Active",
  },
  {
    _id: "2",
    name: "Bob Broker",
    email: "bob@broker.com",
    role: "Broker",
    status: "Active",
  },
  {
    _id: "3",
    name: "Charlie User",
    email: "charlie@user.com",
    role: "User",
    status: "Suspended",
  },
];

const MOCK_LISTINGS: Listing[] = [
  {
    _id: "l1",
    title: "Modern Apartment",
    status: "Approved",
    owner: "Bob Broker",
    createdAt: "2024-06-01",
  },
  {
    _id: "l2",
    title: "Cozy House",
    status: "Pending",
    owner: "Bob Broker",
    createdAt: "2024-06-02",
  },
  {
    _id: "l3",
    title: "Luxury Villa",
    status: "Archived",
    owner: "Bob Broker",
    createdAt: "2024-05-15",
  },
];

const MOCK_REVIEWS: Review[] = [
  {
    _id: "r1",
    broker: "Bob Broker",
    reviewer: "Charlie User",
    rating: 5,
    comment: "Great service!",
    status: "Approved",
  },
  {
    _id: "r2",
    broker: "Bob Broker",
    reviewer: "Alice Admin",
    rating: 3,
    comment: "Average experience.",
    status: "Pending",
  },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    transactionId: "t1",
    user: "Charlie User",
    listingOrService: "Modern Apartment",
    amount: 1000,
    status: "Success",
    paymentMethod: "Card",
    timestamp: "2024-06-10",
  },
  {
    transactionId: "t2",
    user: "Bob Broker",
    listingOrService: "Cozy House",
    amount: 500,
    status: "Pending",
    paymentMethod: "Bank",
    timestamp: "2024-06-11",
  },
];

const MOCK_STATS = {
  totalUsers: 3,
  totalListings: 3,
  totalBrokers: 1,
  monthlyRevenue: [
    { month: "Jan", value: 2000 },
    { month: "Feb", value: 3000 },
    { month: "Mar", value: 2500 },
    { month: "Apr", value: 4000 },
    { month: "May", value: 3500 },
    { month: "Jun", value: 1500 },
  ],
};

const MOCK_PAYMENT_STATS = {
  today: 1000,
  month: 5000,
  refundRate: 2.5,
  monthlyRevenue: [
    { month: "Jan", value: 2000 },
    { month: "Feb", value: 3000 },
    { month: "Mar", value: 2500 },
    { month: "Apr", value: 4000 },
    { month: "May", value: 3500 },
    { month: "Jun", value: 1500 },
  ],
};

const MOCK_USER_PAYMENTS = [
  {
    transactionId: "t1",
    amount: 1000,
    status: "Success",
    paymentMethod: "Card",
    timestamp: "2024-06-10",
  },
  {
    transactionId: "t3",
    amount: 200,
    status: "Refunded",
    paymentMethod: "Mobile",
    timestamp: "2024-06-12",
  },
];

// --- MOCK HOOK ---
export function useAdminApi() {
  // State
  const [users, setUsers] = useState(MOCK_USERS);
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [stats, setStats] = useState(MOCK_STATS);
  const [paymentStats, setPaymentStats] = useState(MOCK_PAYMENT_STATS);
  const [userPayments, setUserPayments] = useState(MOCK_USER_PAYMENTS);
  const [filters, setFilters] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // Mocked fetch functions (simulate loading)
  const fetchUsers = async () => {
    setLoading(true);
    setTimeout(() => {
      setUsers(MOCK_USERS);
      setLoading(false);
    }, 300);
  };
  const fetchListings = async () => {
    setLoading(true);
    setTimeout(() => {
      setListings(MOCK_LISTINGS);
      setLoading(false);
    }, 300);
  };
  const fetchReviews = async () => {
    setLoading(true);
    setTimeout(() => {
      setReviews(MOCK_REVIEWS);
      setLoading(false);
    }, 300);
  };
  const fetchTransactions = async () => {
    setLoading(true);
    setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setLoading(false);
    }, 300);
  };
  const fetchStats = async () => {
    setLoading(true);
    setTimeout(() => {
      setStats(MOCK_STATS);
      setLoading(false);
    }, 300);
  };
  const fetchPaymentStats = async () => {
    setLoading(true);
    setTimeout(() => {
      setPaymentStats(MOCK_PAYMENT_STATS);
      setLoading(false);
    }, 300);
  };
  const fetchUserPayments = async (_userId: string) => {
    setLoading(true);
    setTimeout(() => {
      setUserPayments(MOCK_USER_PAYMENTS);
      setLoading(false);
    }, 300);
  };

  // Mocked actions (simulate state changes)
  const promoteUser = async (id: string) => {
    setUsers(users.map((u) => (u._id === id ? { ...u, role: "Admin" } : u)));
  };
  const demoteUser = async (id: string) => {
    setUsers(users.map((u) => (u._id === id ? { ...u, role: "User" } : u)));
  };
  const suspendUser = async (id: string) => {
    setUsers(
      users.map((u) => (u._id === id ? { ...u, status: "Suspended" } : u))
    );
  };
  const deleteUser = async (id: string) => {
    setUsers(users.filter((u) => u._id !== id));
  };
  const approveBroker = async (id: string) => {
    setUsers(users.map((u) => (u._id === id ? { ...u, status: "Active" } : u)));
  };
  const suspendBroker = async (id: string) => {
    setUsers(
      users.map((u) => (u._id === id ? { ...u, status: "Suspended" } : u))
    );
  };

  const approveListing = async (id: string) => {
    setListings(
      listings.map((l) => (l._id === id ? { ...l, status: "Approved" } : l))
    );
  };
  const rejectListing = async (id: string) => {
    setListings(
      listings.map((l) => (l._id === id ? { ...l, status: "Rejected" } : l))
    );
  };
  const editListing = async (id: string, data: any) => {
    setListings(listings.map((l) => (l._id === id ? { ...l, ...data } : l)));
  };
  const deleteListing = async (id: string) => {
    setListings(listings.filter((l) => l._id !== id));
  };
  const archiveListing = async (id: string) => {
    setListings(
      listings.map((l) => (l._id === id ? { ...l, status: "Archived" } : l))
    );
  };

  const approveReview = async (id: string) => {
    setReviews(
      reviews.map((r) => (r._id === id ? { ...r, status: "Approved" } : r))
    );
  };
  const flagReview = async (id: string) => {
    setReviews(
      reviews.map((r) => (r._id === id ? { ...r, status: "Flagged" } : r))
    );
  };

  return {
    users,
    fetchUsers,
    promoteUser,
    demoteUser,
    suspendUser,
    deleteUser,
    approveBroker,
    suspendBroker,
    listings,
    fetchListings,
    approveListing,
    rejectListing,
    editListing,
    deleteListing,
    archiveListing,
    reviews,
    fetchReviews,
    approveReview,
    flagReview,
    transactions,
    fetchTransactions,
    stats,
    fetchStats,
    paymentStats,
    fetchPaymentStats,
    userPayments,
    fetchUserPayments,
    filters,
    setFilters,
    loading,
  };
}
