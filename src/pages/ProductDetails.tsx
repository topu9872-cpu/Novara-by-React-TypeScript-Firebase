import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import {
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { getProductById } from "../services/productService";
import type { Product } from "../types/Product";
import { useCart } from "../ContextProvider";
import { toast } from "sonner";
import { FaStar } from "react-icons/fa";
import { auth } from "../firebase/firebase";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const location = useLocation();

  // Safely extract addToCart from your global context
  const { addToCart } = useCart() as unknown as {
    addToCart?: (product: Product & { quantity?: number }, qty?: number) => void;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (addToCart) {
      // Pass both product and quantity correctly
      addToCart({ ...product, quantity }, quantity);
      toast.success(`Added ${quantity} ${product.name} to your cart!`);
    } else {
      toast.error("Cart action unavailable.");
    }
  };

  const user = auth.currentUser;

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login", {
        state: { from: location },
      });
      return;
    }
    if (!product) return;

    if (addToCart) {
      addToCart({ ...product, quantity }, quantity);
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-neutral-500 font-medium">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">
          Product Not Found
        </h2>
        <p className="text-neutral-500 mb-6">
          The product you are looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-[#09221F] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#0F302A] transition-all cursor-pointer"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const ratingNum =
    typeof product.rating === "string"
      ? parseFloat(product.rating)
      : product.rating || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 mb-16">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-neutral-600 hover:text-emerald-800 font-medium text-sm mb-8 transition-colors cursor-pointer"
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Product Image Container */}
        <div className="w-full aspect-square bg-neutral-100 rounded-3xl overflow-hidden shadow-sm flex items-center justify-center border border-neutral-100 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col space-y-6">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3">
              {product.category || "General"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* Price & Rating */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
            <span className="text-3xl font-extrabold text-neutral-900">
              ${product.price}
            </span>

            <div className="flex items-center gap-1.5 text-sm">
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, index) => {
                  const fill = Math.min(Math.max(ratingNum - index, 0), 1);
                  return (
                    <span
                      key={index}
                      className="relative inline-block text-neutral-300"
                    >
                      <FaStar />
                      <span
                        className="absolute inset-0 overflow-hidden text-amber-400"
                        style={{ width: `${fill * 100}%` }}
                      >
                        <FaStar />
                      </span>
                    </span>
                  );
                })}
              </div>
              <span className="text-neutral-500 font-medium text-xs">
                ({ratingNum.toFixed(1)})
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-neutral-900 text-sm">
              Description
            </h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {product.description ||
                "Experience top-tier quality and design crafted to fit your everyday lifestyle seamlessly. Premium materials combined with modern aesthetics."}
            </p>
          </div>

          {/* Quantity & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-neutral-900">
                Quantity
              </span>
              <div className="flex items-center border border-neutral-200 rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-100 transition-colors font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-sm font-semibold text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-100 transition-colors font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-white text-[#09221F] border border-[#09221F] rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all shadow-xs active:scale-98 cursor-pointer"
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 h-12 bg-[#09221F] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#0F302A] transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Perks / Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-100 text-center">
            <div className="flex flex-col items-center p-3 rounded-2xl bg-neutral-50">
              <Truck className="w-5 h-5 text-emerald-700 mb-1.5" />
              <span className="text-[11px] font-semibold text-neutral-700">
                Free Shipping
              </span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-neutral-50">
              <RotateCcw className="w-5 h-5 text-emerald-700 mb-1.5" />
              <span className="text-[11px] font-semibold text-neutral-700">
                Easy Returns
              </span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-neutral-50">
              <ShieldCheck className="w-5 h-5 text-emerald-700 mb-1.5" />
              <span className="text-[11px] font-semibold text-neutral-700">
                Secure Checkout
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;