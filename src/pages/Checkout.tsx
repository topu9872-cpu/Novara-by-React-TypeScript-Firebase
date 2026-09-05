import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, Lock, ShoppingBag, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { auth } from "../firebase/firebase";
import { toast } from "sonner";
import type { CartItem } from "../types/Cart";
// If you have a hook or context for the cart, import it here:
// import { useCart } from "../context/CartContext";
const currentUser = auth.currentUser;
type CheckoutProduct = CartItem & {
  _id?: string;
  id?: string;
};

type LocationState = {
  product?: CheckoutProduct;
  quantity?: number;
};

const STRIPE_FUNCTION_URL =
  "http://127.0.0.1:5001/novara-7b539/asia-southeast1/createCheckoutSession";

const Checkout: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // -----------------------------------------
  // USER INFORMATION
  // -----------------------------------------

  const [formData] = useState({
    fullName: currentUser?.displayName || "",
    email: currentUser?.email || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // If using a Cart context, call it here, e.g.:
  // const { cart = [] } = useCart();
  const cart: CartItem[] = []; // Fallback placeholder if no context is used yet

  // -----------------------------------------
  // CHECKOUT STATE
  // -----------------------------------------

  const checkoutState = useMemo<LocationState>(() => {
    return (location.state as LocationState) || {};
  }, [location.state]);

  const product = checkoutState.product;

  const quantity = Math.max(1, Number(checkoutState.quantity || 1));

  // -----------------------------------------
  // CHECKOUT ITEMS
  // -----------------------------------------

  const checkoutItems = useMemo<CartItem[]>(() => {
    if (product) {
      return [
        {
          ...product,
          quantity,
        },
      ];
    }

    return cart;
  }, [product, quantity, cart]);

  // -----------------------------------------
  // PRICE
  // -----------------------------------------

  const subtotal = useMemo(() => {
    return checkoutItems.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);
  }, [checkoutItems]);

  const shipping = subtotal > 0 ? 5 : 0;

  const total = subtotal + shipping;

  // -----------------------------------------
  // GSAP
  // -----------------------------------------

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current.children,
      {
        opacity: 0,
        y: 30,
        scale: 0.98,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      },
    );
  }, []);

  // -----------------------------------------
  // STRIPE CHECKOUT
  // -----------------------------------------
  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (checkoutItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    const user = auth.currentUser;

    if (!user) return;
    setIsSubmitting(true);

    try {
      const payload = {
        productPrice: total,
        quantity,

        // User information
        userId: user.uid,
        email: user.email || formData.email,
        displayName: user.displayName || formData.fullName,
        phoneNumber: user.phoneNumber || "",

        // Products
        firstProduct: checkoutItems[0],
        product: checkoutItems,
      };

      const response = await fetch(STRIPE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create Stripe checkout session.",
        );
      }

      if (!data.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Stripe checkout error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to start Stripe checkout.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-medium text-sm transition-colors cursor-pointer bg-white px-4 py-2.5 rounded-2xl border border-neutral-200/80 shadow-2xs"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-green-800 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-green-800/20">
              N
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">
              Novara
              <span className="text-green-800">.</span>
            </span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-100 text-emerald-800 px-3.5 py-2 rounded-2xl text-xs font-semibold">
            <Lock size={13} />
            <span className="hidden sm:inline">SSL Secure</span>
          </div>
        </div>

        {/* CONTENT */}
        <div
          ref={containerRef}
          className="max-w-5xl flex justify-center mx-auto"
        >
          <form
            onSubmit={handleStripeCheckout}
            className="w-full max-w-lg bg-white p-8 rounded-4xl border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-6"
          >
            {/* ORDER REVIEW */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="font-bold text-neutral-900 text-base">
                Order Review
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium bg-neutral-100 px-3 py-1 rounded-full">
                <ShoppingBag size={13} />
                <span>{checkoutItems.length} items</span>
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="space-y-3">
              {checkoutItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    $
                    {(Number(item.price) * Number(item.quantity || 1)).toFixed(
                      2,
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* TOTALS */}
            <div className="border-t border-neutral-100 pt-4 space-y-3 text-xs">
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
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* SECURITY */}
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 text-neutral-400 text-[11px] font-medium leading-relaxed">
              <ShieldCheck size={26} className="text-emerald-700 shrink-0" />
              <span>
                Backed by Novara's money-back guarantee and end-to-end
                encryption.
              </span>
            </div>

            {/* STRIPE BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || checkoutItems.length === 0}
              className="w-full h-15 bg-green-800 text-white rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 hover:bg-green-900 transition-all shadow-xl shadow-green-800/15 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <Lock size={18} />
              <span>
                {isSubmitting
                  ? "Processing Transaction..."
                  : `Continue to Stripe • $${total.toFixed(2)}`}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
