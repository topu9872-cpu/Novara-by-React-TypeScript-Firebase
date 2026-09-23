import {
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  query,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Product, ProductStatus } from "../types/Product";
import type { Order } from "../types/CustomarOrders";

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

export const updateProduct = async (product: Product) => {
  try {
    const productId = product.id;
    const productRef = doc(db, "Products", productId);
    await updateDoc(productRef, {
      category: product?.category,
      color: product?.color,
      description: product?.description,
      image: product?.image,
      material: product?.material,
      name: product?.name,
      price: product?.price,
      rating: product?.rating,
      stock: product?.stock?.toString(),
    });
  } catch (error) {
    console.error(error);
  }
};

export const getAllOrders = async (
  search = "",
  payment: string,
): Promise<Order[]> => {
  try {
    const constraints: any[] = [];
    
    // Only query if payment is selected AND it's not "All"
    // Also convert to lowercase to match Firestore values ("paid", "pending", etc.)
    if (payment && payment !== "All") {
      constraints.push(where("paymentStatus", "==", payment.toLowerCase()));
    }

    const q = query(collection(db, "orders"), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Order,
      )
      .filter(
        (order) =>
          !search ||
          order.displayName?.toLowerCase().includes(search.toLowerCase()) ||
          order.email?.toLowerCase().includes(search.toLowerCase()),
      );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};