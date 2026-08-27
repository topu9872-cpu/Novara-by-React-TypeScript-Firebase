import { createContext, useContext, useState, type ReactNode, } from "react";

type CartContextType = {
  cart: number[];
  addToCart: (id: number) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export default function ContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<number[]>([]);

  const addToCart = (id: number) => {
    setCart((prev) => [...new Set([...prev, id])]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};