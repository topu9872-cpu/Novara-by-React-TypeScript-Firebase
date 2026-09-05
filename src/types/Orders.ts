import type { Product } from "./Product";

export interface Orders {
  phoneNumber: string | number;
  userId: string;
  sessionId: string;
  email: string;
  displayName: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  products: Product[];
}