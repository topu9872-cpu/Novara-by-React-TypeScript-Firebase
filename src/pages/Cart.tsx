import React from "react";
import { useNavigate } from "react-router";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../ContextProvider";
import { toast } from "sonner";
import type { CartItem } from "../types/Cart";

const Cart = () => {
  const navigate = useNavigate();

  const { cart = [], setCart } = useCart() as unknown as { 
    cart?: CartItem[]; 
    setCart?: React.Dispatch<React.SetStateAction<CartItem[]>> 
  };

  const updateQuantity = (index: number, delta: number) => {
    if (!setCart) return;
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const item = newCart[index];
      if (!item) return prevCart;

      const currentQty = item.quantity || 1;
      const newQty = currentQty + delta;

      if (newQty <= 0) {
        newCart.splice(index, 1);
        toast.info("Item removed from cart");
      } else {
        newCart[index] = { ...item, quantity: newQty };
      }
      return [...newCart]; // Spread ensures React detects state change
    });
  };

  const removeItem = (index: number) => {
    if (!setCart) return;
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    toast.info("Item removed from cart");
  };

  // Calculate the total number of individual items combined
  const totalItemsCount = cart.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  const subtotal = cart.reduce(
    (acc, item) => acc + Number(item.price) * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 0 ? 5.0 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-medium text-sm transition-colors cursor-pointer bg-white px-4 py-2.5 rounded-2xl border border-neutral-200/80 shadow-2xs"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Shop</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-green-800 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-green-800/20">
              N
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">
              Novara<span className="text-green-800">.</span>
            </span>
          </div>
        </div>

        {/* Cart Container */}
        <div className="bg-white p-8 rounded-4xl border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h1 className="font-bold text-neutral-900 text-lg flex items-center gap-2">
              <ShoppingBag size={20} className="text-green-800" />
              Your Shopping Cart
            </h1>
            <span className="text-xs font-semibold bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full">
              {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"}
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag size={28} />
              </div>
              <p className="text-sm font-medium text-neutral-500">
                Your cart is completely empty.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="px-6 py-3 bg-green-800 text-white rounded-2xl text-sm font-bold shadow-lg shadow-green-800/15 hover:bg-green-900 transition-all cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Items List */}
              <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto pr-1">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-2xl object-cover bg-neutral-100 border border-neutral-100 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-green-800 font-semibold mt-1">
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      {/* Quantity Modifier */}
                      <div className="flex items-center border border-neutral-200 rounded-xl bg-[#FAFAFA] p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, -1)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-neutral-900">
                          {item.quantity || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, 1)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <span className="text-sm font-extrabold text-neutral-900 min-w-16 text-right">
                        ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                      </span>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-2 cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Summary */}
              <div className="border-t border-neutral-100 pt-6 space-y-3 text-xs">
                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Priority Shipping</span>
                  <span className="font-semibold text-neutral-900">
                    ${shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-3 border-t border-neutral-100">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="w-full h-15 bg-green-800 text-white rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 hover:bg-green-900 transition-all shadow-xl shadow-green-800/15 active:scale-[0.98] cursor-pointer"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;