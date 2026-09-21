import {
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Product, ProductStatus } from "../types/Product";

export const updateProductStatus = async (
  productId: string,
  status: ProductStatus,
) => {
  try {
    const productRef = doc(db, "Products", productId);

    await updateDoc(productRef, {
      status,
    });
  } catch (error) {
    console.error("Failed to update product status:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const productRef = doc(db, "Products", id);

    await deleteDoc(productRef);
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
};

export const restoreProduct = async (product: Product) => {
  try {
    const productRef = doc(db, "Products", product.id);

    const { id, ...productData } = product;

    await setDoc(productRef, productData);
  } catch (error) {
    console.error("Failed to restore product:", error);
    throw error;
  }
};

export const createProduct = async (
  product: Product,
): Promise<Product | null> => {
  try {
    const productRef = doc(db, "Products", product.id);

    const productData = {
      ...product,
      status: "Active" as ProductStatus,
      createdAt: serverTimestamp(),
    };

    await setDoc(productRef, productData);

    return {
      ...product,
      status: "Active",
    };
  } catch (error) {
    console.error("Failed to create product:", error);
    return null;
  }
};