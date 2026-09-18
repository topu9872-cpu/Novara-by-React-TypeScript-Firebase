import type { Timestamp } from "firebase/firestore";

export type Customer = {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  phoneNumber: string;

  totalOrders: number;
  totalSpent: number;

  createdAt: Timestamp;
  lastOrderAt?: Timestamp;
};
