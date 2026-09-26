import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  DocumentSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import type { Product } from "../types/Product";
import type { Orders } from "../types/Orders";
import type { CartItem } from "../types/Cart";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { toast } from "sonner";
import type { Address } from "../types/Address";
import { createNotification } from "./notifications";

const getCurrentUser = async (): Promise<User | null> => {
  const auth = getAuth();

  if (auth.currentUser) {
    return auth.currentUser;
  }

  return await new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, "Products"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
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
      ...doc.data(),
      id: doc.id,
    }));

    return {
      products: products as Product[],
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    };
  } catch (error) {
    console.error("Firestore Error:", error);
    return {
      products: [],
      lastDoc: null,
    };
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, "Products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        id: docSnap.id,
      } as Product;
    }

    return null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

export const createOrder = async (
  orderData: Orders,
): Promise<Orders | null> => {
  try {
    const sessionId = orderData.products?.[0]?.sessionId;

    if (!sessionId) {
      console.error("❌ Session ID not found");
      return null;
    }

    const orderRef = doc(db, "orders", sessionId);

    const stockNotifications: {
      type: "low_stock" | "out_of_stock";
      productName: string;
      newStock: number;
    }[] = [];

    // =====================================
    // 1. CREATE ORDER + UPDATE STOCK
    // =====================================

    const result = await runTransaction(db, async (transaction) => {
      const productsToUpdate = [];

      for (const item of orderData.products) {
        const productRef = doc(db, "Products", item.id);

        const productSnap = await transaction.get(productRef);

        if (!productSnap.exists()) {
          throw new Error(`Product not found: ${item.name}`);
        }

        const product = productSnap.data();

        const currentStock = Number(product.stock || 0);
        const buyingQuantity = Number(item.quantity || 0);

        if (currentStock <= 0) {
          throw new Error(`${item.name} is out of stock`);
        }

        if (buyingQuantity > currentStock) {
          throw new Error(
            `Only ${currentStock} item(s) available for ${item.name}`,
          );
        }

        const newStock = currentStock - buyingQuantity;

        // =====================================
        // CHECK STOCK NOTIFICATION
        // =====================================

        if (currentStock > 5 && newStock <= 5 && newStock > 0) {
          stockNotifications.push({
            type: "low_stock",
            productName: item.name,
            newStock,
          });
        }

        if (currentStock > 0 && newStock === 0) {
          stockNotifications.push({
            type: "out_of_stock",
            productName: item.name,
            newStock,
          });
        }

        productsToUpdate.push({
          productRef,
          product,
          newStock,
        });
      }

      // =====================================
      // CREATE ORDER
      // =====================================

      const order = {
        ...orderData,
        createdAt: new Date(),
      };

      transaction.set(orderRef, order, {
        merge: true,
      });

      // =====================================
      // DECREASE STOCK
      // =====================================

      for (const item of productsToUpdate) {
        transaction.update(item.productRef, {
          stock: item.newStock,

          status:
            item.newStock === 0
              ? "Out of Stock"
              : item.product.status || "Active",
        });
      }

      return order;
    });

    // =====================================
    // 2. NEW ORDER NOTIFICATION
    // =====================================

    await createNotification({
      title: "New Order",
      message: `${
        orderData.displayName || orderData.email
      } placed a new order worth $${Number(orderData.amount).toFixed(2)}.`,
      type: "new_order",
      priority: "high",
    });

    return result as Orders;
  } catch (error) {
    console.error("❌ ORDER FAILED:", error);

    return null;
  }
};

export const getUserOrders = async (): Promise<Orders[]> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      toast.error("Please login first");
      return [];
    }

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Orders),
    }));
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    return [];
  }
};

export const AddToCart = async (product: Product, quantity: number) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    const cartRef = doc(db, "users", user.uid, "cart", product.id);

    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      const currentQuantity = cartSnap.data().quantity || 0;

      await updateDoc(cartRef, {
        quantity: currentQuantity + quantity,
      });
    } else {
      await setDoc(cartRef, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category || "",
        quantity: quantity,
        addedAt: new Date(),
      });
    }

    toast.success("Added to cart");
  } catch (error) {
    console.error("Add to cart error:", error);
    toast.error("Failed to add to cart");
  }
};

export const updateCartItemQuantity = async (
  productId: string,
  quantity: number,
) => {
  try {
    const user = await getCurrentUser();

    if (!user) return;

    const cartRef = doc(db, "users", user.uid, "cart", productId);

    if (quantity <= 0) {
      await deleteDoc(cartRef);
      return;
    }

    await updateDoc(cartRef, {
      quantity,
    });
  } catch (error) {
    console.error("Update cart quantity error:", error);
    toast.error("Failed to update cart quantity");
  }
};

export const removeCartItem = async (productId: string) => {
  try {
    const user = await getCurrentUser();

    if (!user) return;

    const cartRef = doc(db, "users", user.uid, "cart", productId);

    await deleteDoc(cartRef);
  } catch (error) {
    console.error("Remove cart item error:", error);
    toast.error("Failed to remove item");
  }
};

export const getCartItems = async (): Promise<CartItem[]> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return [];
    }

    const cartRef = collection(db, "users", user.uid, "cart");

    const snapshot = await getDocs(cartRef);

    const cartItems: CartItem[] = snapshot.docs
      .map((doc) => {
        const data = doc.data() as Partial<CartItem> & {
          price?: number | string;
          quantity?: number | string;
        };

        const normalizedPrice = Number(data.price ?? 0);
        const normalizedQuantity = Number(data.quantity ?? 1);

        return {
          id: doc.id,
          name: typeof data.name === "string" ? data.name : "Unnamed item",
          price: Number.isFinite(normalizedPrice) ? normalizedPrice : 0,
          image: typeof data.image === "string" ? data.image : "",
          quantity:
            Number.isFinite(normalizedQuantity) && normalizedQuantity > 0
              ? normalizedQuantity
              : 1,
        };
      })
      .filter((item) => item.name || item.image || item.price > 0);

    return cartItems;
  } catch (error) {
    console.error("Get cart error:", error);
    toast.error("Failed to load cart");
    return [];
  }
};

export const saveAddress = async (addressData: Address) => {
  const user = await getCurrentUser();

  if (!user) return;

  const userRef = doc(db, "address", user.uid);

  await setDoc(
    userRef,
    {
      address: {
        ...addressData,
        isDefault: true,
      },
    },
    {
      merge: true,
    },
  );
};

export const getAddress = async (userId: string) => {
  const addressRef = doc(db, "address", userId);

  const snapshot = await getDoc(addressRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return data.address as Address;
};

export const deleteAddress = async (userId: string) => {
  const addressRef = doc(db, "address", userId);

  await deleteDoc(addressRef);
};
