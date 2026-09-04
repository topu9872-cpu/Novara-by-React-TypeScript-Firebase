import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  DocumentSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import type { Product } from "../types/Product";

export const getProducts = async () => {
  try {
    const snapshot = await getDocs(collection(db, "Products"));

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return products;
  } catch (error) {
    console.error("Firestore Error:", error);
    return [];
  }
};

interface GetProductsParams {
  search?: string;
  category?: string;
  lastDoc?: DocumentSnapshot | null;
}

export const getAllProducts = async ({
  search = "",
  category = "all",
}: GetProductsParams = {}) => {
  try {
    const constraints: any[] = [];

    // Search by product name
    if (search) {
      constraints.push(where("name", ">=", search));
      constraints.push(where("name", "<=", search + "\uf8ff"));
    }

    // Category filter
    if (category !== "all") {
      constraints.push(where("category", "==", category));
    }

    // Sort by name default
    constraints.push(orderBy("name"));

    const q = query(collection(db, "Products"), ...constraints);
    const snapshot = await getDocs(q);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      products: products as Product[],
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    };
  } catch (error) {
    console.error("Firestore Error:", error);
    return { products: [], lastDoc: null };
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, "Products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};
