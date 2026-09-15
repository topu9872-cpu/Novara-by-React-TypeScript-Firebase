import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  ArrowRight,
  Clock,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { toast } from "sonner";
import type { CartItem } from "../types/Cart";

import {
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "../services/productService";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD CART
  // =========================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const items = await getCartItems();

        setCartItems(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error("Cart loading error:", error);
        toast.error("Failed to load cart");
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // =========================
  // UPDATE QUANTITY
  // =========================
  const updateQuantity = async (index: number, delta: number) => {
    const item = cartItems[index];

    if (!item?.id) return;

    const currentQty = item.quantity || 1;
    const nextQty = currentQty + delta;

    try {
      // Remove item
      if (nextQty <= 0) {
        await removeCartItem(item.id);

        setCartItems((prev) => prev.filter((_, i) => i !== index));

        toast.info("Item removed from cart");
        return;
      }

      // Update Firestore
      await updateCartItemQuantity(item.id, nextQty);

      // Update UI
      setCartItems((prev) =>
        prev.map((cartItem, i) =>
          i === index
            ? {
                ...cartItem,
                quantity: nextQty,
              }
            : cartItem,
        ),
      );
    } catch (error) {
      console.error("Quantity update error:", error);
      toast.error("Failed to update quantity");
    }
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem = async (index: number) => {
    const item = cartItems[index];

    if (!item?.id) return;

    try {
      await removeCartItem(item.id);

      setCartItems((prev) => prev.filter((_, i) => i !== index));

      toast.info(`${item.name} is removed from cart`);
    } catch (error) {
      console.error("Remove cart item error:", error);
      toast.error("Failed to remove item");
    }
  };

  // =========================
  // TOTALS
  // =========================
  const totalItemsCount = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0,
  );

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * (item.quantity || 1),
    0,
  );

  const shipping = subtotal > 0 ? 5 : 0;

  const total = subtotal + shipping;

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-sm">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-neutral-100 flex items-center justify-center">
          <Clock size={23} className="text-neutral-500 animate-spin" />
        </div>

        <p className="mt-4 text-sm text-neutral-500">Loading your cart...</p>
      </div>
    );
  }

  // =========================
  // EMPTY CART
  // =========================
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-emerald-800 transition mb-10"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="bg-white border border-neutral-100 rounded-3xl p-10 sm:p-16 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
              <ShoppingBag size={36} className="text-emerald-800" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-6">
              Your cart is empty
            </h1>

            <p className="text-sm text-neutral-500 mt-3 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet.
            </p>

            <button
              onClick={() => navigate("/shop")}
              className="mt-7 bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // CART
  // =========================
  return (
    <div className="min-h-screen bg-[#FBFBFB] px-4 py-10 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-emerald-800 transition"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
            <ShoppingBag size={18} />

            <span>
              {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
            Shopping Cart
          </h1>

          <p className="text-sm text-neutral-500 mt-2">
            Review your items before checkout.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* =========================
              CART ITEMS
          ========================= */}
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-5 sm:p-7">
            <div className="space-y-5">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group border-b border-neutral-100 pb-5 last:border-0 last:pb-0"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-neutral-100 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-3">
                        <div>
                          <h2 className="font-semibold text-neutral-900 truncate">
                            {item.name}
                          </h2>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => removeItem(index)}
                          className="text-neutral-400 hover:text-red-500 transition shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-emerald-800 font-bold mt-3">
                        ${Number(item.price).toFixed(2)}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQuantity(index, -1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-neutral-100 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-9 text-center text-sm font-semibold">
                            {item.quantity || 1}
                          </span>

                          <button
                            onClick={() => updateQuantity(index, 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-neutral-100 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Item total */}
                        <p className="font-bold text-neutral-900">
                          $
                          {(Number(item.price) * (item.quantity || 1)).toFixed(
                            2,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue shopping */}
            <button
              onClick={() => navigate("/shop")}
              className="mt-7 flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </button>
          </div>

          {/* =========================
              SUMMARY
          ========================= */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 sm:p-7">
              <h2 className="text-xl font-bold text-neutral-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Items</span>

                  <span className="font-semibold text-neutral-900">
                    {totalItemsCount}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>

                  <span className="font-semibold text-neutral-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Shipping</span>

                  <span className="font-semibold text-neutral-900">
                    ${shipping.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-neutral-100 pt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-neutral-900">Total</span>

                    <span className="text-xl font-bold text-emerald-800">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              <div className="mt-6 p-4 bg-emerald-50 rounded-2xl flex gap-3">
                <Clock size={18} className="text-emerald-800 mt-0.5 shrink-0" />

                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    Fast Delivery
                  </p>

                  <p className="text-xs text-emerald-700 mt-1">
                    Estimated delivery within 3–5 business days.
                  </p>
                </div>
              </div>

              {/* Checkout */}
              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full h-13 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
