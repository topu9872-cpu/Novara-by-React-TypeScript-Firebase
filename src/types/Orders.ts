export interface OrderProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category?: string;
  sessionId?: string;
}

export interface Orders {
  id?: string;

  userId: string;

  amount: number;
  currency: string;

  displayName: string;
  email: string;
  phoneNumber: string;

  paymentStatus: string;

  createdAt: unknown;

  products: OrderProduct[];
}