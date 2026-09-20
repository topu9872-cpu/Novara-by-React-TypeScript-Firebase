import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Product, ProductStatus } from "../types/Product";

export const updateProductStatus = async (
  productId: string,
  status: ProductStatus,
) => {
  const productRef = doc(db, "Products", productId);
  await updateDoc(productRef, {
    status,
  });
};


export const deleteProduct = async (id: string) => {
  try {
    const productRef = doc(db, "Products", id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const restoreProduct = async (product: Product) => {
  try {
    const productRef = doc(db, "Products", product.id);

    await setDoc(productRef, product);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
