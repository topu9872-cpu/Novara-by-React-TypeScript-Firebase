import { createContext, useContext, useState, type ReactNode } from "react";

export type CartItem = {
  id: number | string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const CartContext = createContext<CartContextType | null>(null);

export default function ContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      const incomingQty = product.quantity || 1; // Captures whatever quantity (e.g., 5) is passed

      if (existingIndex > -1) {
        // If product already exists, add the incoming quantity to the existing one
        const newCart = [...prev];
        const currentQty = newCart[existingIndex].quantity || 1;
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: currentQty + incomingQty,
        };
        return newCart;
      }
      // Otherwise add it as a new cart item with the selected quantity
      return [...prev, { ...product, quantity: incomingQty }];
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside ContextProvider");
  return context;
};