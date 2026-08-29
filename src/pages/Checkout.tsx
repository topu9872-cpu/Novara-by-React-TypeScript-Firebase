import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { auth, db } from "../firebase/firebase"; // Ensure 'db' is exported from your firebase config file
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useCart } from "../ContextProvider";
import { toast } from "sonner";
import type { CartItem } from "../types/Cart";


type PaymentMethodType = "stripe" | "bkash" | "nagad";

const Checkout: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

const { cart = [], setCart } = useCart() as unknown as { 
    cart?: CartItem[]; 
    setCart?: React.Dispatch<React.SetStateAction<CartItem[]>> 
  };

  const currentUser = auth.currentUser;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("stripe");
  
  const [formData, setFormData] = useState({
    fullName: currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    mobileNumber: "",
    transactionId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + Number(item.price) * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 0 ? 5.0 : 0;
  const total = subtotal + shipping;

  // Firebase Order Submission Handler
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Structure the order payload to save in Firestore
      const orderData = {
        userId: currentUser ? currentUser.uid : "guest",
        customerDetails: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
        },
        paymentDetails: {
          method: paymentMethod,
          // Only save relevant fields depending on payment method
          ...(paymentMethod === "stripe" ? {
            cardNumberLast4: formData.cardNumber.slice(-4),
          } : {
            senderMobile: formData.mobileNumber,
            transactionId: formData.transactionId,
          }),
        },
        items: cart,
        subtotal: subtotal,
        shippingFee: shipping,
        totalAmount: total,
        status: paymentMethod === "stripe" ? "Paid" : "Pending Verification",
        createdAt: serverTimestamp(),
      };

      // 2. Save document to the 'orders' collection in Firebase Firestore
      await addDoc(collection(db, "orders"), orderData);

      toast.success("Order placed and saved successfully!");
      
      if (setCart) {
        setCart([]);
      }
      
      navigate("/shop");
    } catch (error: any) {
      console.error("Error saving order: ", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Header */}
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
              Novara<span className="text-green-800">.</span>
            </span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-100 text-emerald-800 px-3.5 py-2 rounded-2xl text-xs font-semibold">
            <Lock size={13} />
            <span className="hidden sm:inline">SSL Secure</span>
          </div>
        </div>

        {/* Main Grid Checkout Layout */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Container: Form Sections */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Shipping Information Card */}
              <div className="bg-white p-8 rounded-4xl border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 font-bold text-xs">
                      1
                    </div>
                    <h2 className="font-bold text-neutral-900 text-base">
                      Shipping Information
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full h-13 px-4 bg-[#FAFAFA] border border-neutral-200 text-neutral-900 rounded-2xl text-sm font-medium focus:bg-white focus:border-green-800 focus:ring-4 focus:ring-green-800/5 focus:outline-none transition-all"
                      placeholder="Alex Morgan"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-13 px-4 bg-[#FAFAFA] border border-neutral-200 text-neutral-900 rounded-2xl text-sm font-medium focus:bg-white focus:border-green-800 focus:ring-4 focus:ring-green-800/5 focus:outline-none transition-all"
                      placeholder="alex@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full h-13 px-4 bg-[#FAFAFA] border border-neutral-200 text-neutral-900 rounded-2xl text-sm font-medium focus:bg-white focus:border-green-800 focus:ring-4 focus:ring-green-800/5 focus:outline-none transition-all"
                    placeholder="123 Luxury Avenue, Suite 4B"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full h-13 px-4 bg-[#FAFAFA] border border-neutral-200 text-neutral-900 rounded-2xl text-sm font-medium focus:bg-white focus:border-green-800 focus:ring-4 focus:ring-green-800/5 focus:outline-none transition-all"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      required
                      value={formData.zip}
                      onChange={handleChange}
                      className="w-full h-13 px-4 bg-[#FAFAFA] border border-neutral-200 text-neutral-900 rounded-2xl text-sm font-medium focus:bg-white focus:border-green-800 focus:ring-4 focus:ring-green-800/5 focus:outline-none transition-all"
                      placeholder="10001"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full h-13 px-4 bg-[#FAFAFA] border border-neutral-200 text-neutral-900 rounded-2xl text-sm font-medium focus:bg-white focus:border-green-800 focus:ring-4 focus:ring-green-800/5 focus:outline-none transition-all"
                      placeholder="+1 (555)..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods Card */}
              <div className="bg-white p-8 rounded-4xl border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 font-bold text-xs">
                      2
                    </div>
                    <h2 className="font-bold text-neutral-900 text-base">
                      Payment Method
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stripe")}
                    className={`p-4 rounded-2xl border flex flex-col h-30 items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "stripe"
                        ? "border-green-800 bg-green-800/5 text-green-800 font-bold shadow-xs scale-[1.02]"
                        : "border-neutral-200 bg-[#FAFAFA] text-neutral-500 hover:border-neutral-300"
                    }`}
                  >
                    <img src="https://1000logos.net/wp-content/uploads/2021/05/Stripe-logo.png" alt="Stripe" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bkash")}
                    className={`p-4 rounded-2xl border flex flex-col h-30 items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "bkash"
                        ? "border-pink-600 bg-pink-50/60 text-pink-900 font-bold shadow-xs scale-[1.02]"
                        : "border-neutral-200 bg-[#FAFAFA] text-neutral-500 hover:border-neutral-300"
                    }`}
                  >
                    <img src="https://i.pinimg.com/736x/8a/d9/e2/8ad9e26626fa6621d8ee43bb5856bcd6.jpg" className="object-cover" alt="bKash" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("nagad")}
                    className={`p-4 rounded-2xl border flex flex-col h-30 items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "nagad"
                        ? "border-orange-600 bg-orange-50/60 text-orange-900 font-bold shadow-xs scale-[1.02]"
                        : "border-neutral-200 bg-[#FAFAFA] text-neutral-500 hover:border-neutral-300"
                    }`}
                  >
                    <img src="https://static.freepnglogo.com/images/all_img/1725618513nagad-logo.png" alt="Nagad" />
                  </button>
                </div>

                {paymentMethod === "stripe" ? (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        required={paymentMethod === "stripe"}
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="w-full h-13 px-4 bg-[#FAFAFA] border border-neutral-200 text-neutral-900 rounded-2xl text-sm font-medium focus:bg-white focus:border-green-800 focus:ring-4 focus:ring-green-800/5 focus:outline-none transition-all"
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                          Expiration
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          required={paymentMethod === "stripe"}
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          className="w-full h-13 px-4 bg-[#FAFAFA] border border-neutral-200 text-neutral-900 rounded-2xl text-sm font-medium focus:bg-white focus:border-green-800 focus:ring-4 focus:ring-green-800/5 focus:outline-none transition-all"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                          CVC
                        </label>
                        <input
                          type="password"
                          name="cardCvc"
                          required={paymentMethod === "stripe"}
                          maxLength={4}
                          value={formData.cardCvc}
                          onChange={handleChange}
                          className="w-full h-13 px-4 bg-[#FAFAFA] border border-neutral-200 text-neutral-900 rounded-2xl text-sm font-medium focus:bg-white focus:border-green-800 focus:ring-4 focus:ring-green-800/5 focus:outline-none transition-all"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
                      <p className="font-semibold text-neutral-900">
                        <span>
                          {paymentMethod.toUpperCase()} Direct Transfer Instructions:
                        </span>
                      </p>
                      <p>
                        Send amount to merchant wallet:{" "}
                        <span className="font-bold text-neutral-900">
                          01700-000000
                        </span>
                      </p>
                      <p className="text-neutral-500">
                        Insert your mobile number and transaction ref below.
                      </p>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        Sender Wallet No
                      </label>
                      <input
                        type="text"
                        name="mobileNumber"
                        required={paymentMethod === "bkash" || paymentMethod === "nagad"}
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="w-full h-13 px-4 bg-[#FAFAFA] border border-neutral-200 text-neutral-900 rounded-2xl text-sm font-medium focus:bg-white focus:border-green-800 focus:ring-4 focus:ring-green-800/5 focus:outline-none transition-all"
                        placeholder="018xxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        Transaction ID (TrxID)
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        required={paymentMethod === "bkash" || paymentMethod === "nagad"}
                        value={formData.transactionId}
                        onChange={handleChange}
                        className="w-full h-13 px-4 bg-[#FAFAFA] border border-neutral-200 text-neutral-900 rounded-2xl text-sm font-medium focus:bg-white focus:border-green-800 focus:ring-4 focus:ring-green-800/5 focus:outline-none transition-all"
                        placeholder="9H87G6F5E4"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Main Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-15 bg-green-800 text-white rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 hover:bg-green-900 transition-all shadow-xl shadow-green-800/15 active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <Lock size={18} />
                <span>
                  {isSubmitting
                    ? "Processing Transaction..."
                    : `Authorize Payment • $${total.toFixed(2)}`}
                </span>
              </button>
            </form>
          </div>

          {/* Right Container: Sticky Review Summary */}
          <div className="lg:col-span-5 bg-white p-8 rounded-4xl border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="font-bold text-neutral-900 text-base">
                Order Review
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium bg-neutral-100 px-3 py-1 rounded-full">
                <ShoppingBag size={13} />
                <span>{cart.length} items</span>
              </div>
            </div>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-8">
                  Your cart is currently empty.
                </p>
              ) : (
                cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 py-2 border-b border-neutral-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover bg-neutral-100 border border-neutral-100 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
                          Quantity: {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-neutral-900">
                      ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

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

            <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 text-neutral-400 text-[11px] font-medium leading-relaxed">
              <ShieldCheck size={26} className="text-emerald-700 shrink-0" />
              <span>
                Backed by Novara's money-back guarantee and end-to-end
                encryption.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;