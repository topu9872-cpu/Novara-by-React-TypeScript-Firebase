import type { Timestamp } from "firebase/firestore";

export type OrderProduct = {
  category: string;
  color: string;
  description: string;
  id: string;
  image: string;
  material: string;
  name: string;
  price: string;
  quantity: number;
  rating: string;
  sessionId: string;
  stock: number;
};

export type Order = {
  id: string;
  amount: number;
  createdAt: Timestamp;
  currency: string;
  displayName: string;
  email: string;
  paymentStatus: "paid" | "pending" | "failed";
  phoneNumber: string;
  products: OrderProduct[];
  userId?: string;
};