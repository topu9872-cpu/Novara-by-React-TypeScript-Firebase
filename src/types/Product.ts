export interface Product {
  id: string;
  category: string;

  color: string;

  description: string;

  image: string;

  material: string;

  name: string;

  price: string;

  rating: string | number;

  stock?: number;
  status?: ProductStatus;
  isDeleted?: boolean;
  deletedAt?: Date | string | null;
}

export type ProductStatus = string;
