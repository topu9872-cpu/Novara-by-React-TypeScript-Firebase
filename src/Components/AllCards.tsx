import React, { useEffect, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import gsap from "gsap";
import { FaStar } from "react-icons/fa";
import type { Product } from "../types/Product";
import { NavLink } from "react-router";

interface CardProps {
  product: Product;
}

export const Card: React.FC<CardProps> = ({ product }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    // Direct mount animation to guarantee cards always fade in nicely
    const anim = gsap.fromTo(
      cardElement,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      },
    );

    return () => {
      anim.kill();
    };
  }, []);

  const ratingNum =
    typeof product.rating === "string"
      ? parseFloat(product.rating)
      : product.rating || 0;

  return (
    <div
      ref={cardRef}
      className="product-card w-full bg-white rounded-2xl p-3 shadow-xs border border-neutral-100 opacity-0 flex flex-col justify-between hover:shadow-md transition-shadow"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-4/3 sm:aspect-square rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
        />
      </div>
      
        {/* Card Details / Content */}
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-semibold text-neutral-900 text-sm tracking-tight truncate">
            {product.name}
          </h3>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-base font-bold text-neutral-900">
              ${product.price}
            </span>

           <NavLink to={`/shop/${product.id}`}
              onClick={() => console.log(`Added ${product.name} to cart`)}
              aria-label="Add to Cart"
              className="w-9 h-9 rounded-lg bg-[#09221F] text-white flex items-center justify-center hover:bg-[#0F302A] transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              </NavLink>
          </div>

          {/* Rating Stars Section */}
          <div className="flex items-center gap-1 pt-0.5">
            <div className="flex items-center gap-0.5 text-[11px]">
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
                      style={{
                        width: `${fill * 100}%`,
                      }}
                    >
                      <FaStar />
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
   
    </div>
  );
};

export default Card;
