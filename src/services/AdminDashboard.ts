import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { ProductStatus } from "../types/Product";

export const updateProductStatus = async (
  productId: string,
  status: ProductStatus,
) => {
  const productRef = doc(db, "Products", productId);
  await updateDoc(productRef, {
    status,
  });
};
