export interface User {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Broker" | "User";
  status: "Active" | "Suspended";
}
export interface Listing {
  _id: string;
  title: string;
  status: string;
  owner: string;
  createdAt: string;
}
export interface Review {
  _id: string;
  broker: string;
  reviewer: string;
  rating: number;
  comment: string;
  status: string;
}
export interface Transaction {
  transactionId: string;
  user: string;
  listingOrService: string;
  amount: number;
  status: string;
  paymentMethod: string;
  timestamp: string;
}
