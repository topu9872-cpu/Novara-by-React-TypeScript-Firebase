import {
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  query,
  collection,
  getDocs,
  getDoc,
  doc,
  getCountFromServer,
} from "firebase/firestore";
import type { Product, ProductStatus } from "../types/Product";
import type { Order } from "../types/CustomarOrders";
import { db } from "../firebase/firebase";

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
  payment = ""
): Promise<Order[]> => {
  try {
    const constraints =
      payment
        ? [where("paymentStatus", "==", payment.toLowerCase())]
        : [];

    const snapshot = await getDocs(
      query(collection(db, "orders"), ...constraints)
    );

    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }) as Order)
      .filter(
        (order) =>
          !search ||
          order.displayName
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          order.email
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// Get or create visitor ID
export const getVisitorId = () => {
  let visitorId = localStorage.getItem("visitor_id");

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("visitor_id", visitorId);
  }

  return visitorId;
};

// Get month in YYYY-MM format
export const getMonthKey = (date = new Date()) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}`;
};

// Track visitor once per month
export const trackUniqueView = async () => {
  const visitorId = getVisitorId();
  const currentMonth = getMonthKey();

  const visitorRef = doc(db, "portfolioViews", visitorId);

  const visitorSnap = await getDoc(visitorRef);

  // New visitor
  if (!visitorSnap.exists()) {
    await setDoc(visitorRef, {
      firstVisit: serverTimestamp(),
      lastVisit: serverTimestamp(),
      months: [currentMonth],
    });

    return true;
  }

  const data = visitorSnap.data();
  const months: string[] = data.months || [];

  // Already counted this month
  if (months.includes(currentMonth)) {
    await updateDoc(visitorRef, {
      lastVisit: serverTimestamp(),
    });

    return false;
  }

  // New month for existing visitor
  await updateDoc(visitorRef, {
    lastVisit: serverTimestamp(),
    months: [...months, currentMonth],
  });

  return true;
};

// Get unique views for a specific month
export const getMonthlyUniqueViews = async (month: string) => {
  const viewsRef = collection(db, "portfolioViews");

  const q = query(viewsRef, where("months", "array-contains", month));

  const snapshot = await getDocs(q);

  return snapshot.size;
};

// Get last 6 months
export const getLastSixMonths = () => {
  const months: {
    key: string;
    name: string;
  }[] = [];

  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

    months.push({
      key: getMonthKey(date),
      name: date.toLocaleString("en-US", {
        month: "long",
      }),
    });
  }

  return months;
};


export const getMonthlyOrderCount = async (start: Date, end: Date) => {
  const q = query(
    collection(db, "orders"),
    where("createdAt", ">=", start),
    where("createdAt", "<", end)
  );

  const snapshot = await getCountFromServer(q);

  return snapshot.data().count;
};