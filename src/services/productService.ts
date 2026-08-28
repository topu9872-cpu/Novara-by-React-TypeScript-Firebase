import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

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
