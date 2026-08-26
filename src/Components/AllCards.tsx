import React, { useEffect, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import gsap from "gsap";
import { FaStar } from "react-icons/fa";
import { ScrollTrigger } from "gsap/ScrollTrigger";
interface ProductItem {
  id: string | number;
  title: string;
  price: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
}

export const Card: React.FC = () => {
 const containerRef = useRef<HTMLDivElement>(null);
const fakeProducts: ProductItem[] = [
    {
      id: 1,
      title: "Modern Armchair",
      price: "$199.00",
      rating: 4.5,
      reviewsCount: 150,
      imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Velvet Lounge Chair",
      price: "$249.00",
      rating: 2.6,
      reviewsCount: 210,
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Nordic Accent Chair",
      price: "$179.00",
      rating: 4.3,
      reviewsCount: 98,
      imageUrl: "https://images.unsplash.com/photo-1580481077494-e3299ac25e94?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Minimalist Club Chair",
      price: "$229.00",
      rating: 4.6,
      reviewsCount: 134,
      imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600&auto=format&fit=crop",
    },
  ];



useEffect(() => {
  const cards = containerRef.current?.querySelectorAll(".product-card");

  if (!cards) return;

  gsap.fromTo(
    cards,
    {
      opacity: 0,
      y: 60,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    }
  );

  return () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
}, []);
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {fakeProducts.map((product) => (
         <div
  key={product.id}
  className="product-card w-full bg-white rounded-3xl p-4 shadow-sm border border-neutral-100 opacity-0 flex flex-col justify-between hover:shadow-md transition-shadow"
>
            {/* Product Image Container */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100 flex items-center justify-center mb-4">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Card Details / Content */}
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold text-neutral-900 text-base tracking-tight">
                {product.title}
              </h3>

              <div className="flex items-center justify-between pt-1">
                <span className="text-lg font-bold text-neutral-900">
                  {product.price}
                </span>

                <button
                  onClick={() => console.log(`Added ${product.title} to cart`)}
                  aria-label="Add to Cart"
                  className="w-11 h-11 rounded-xl bg-[#09221F] text-white flex items-center justify-center hover:bg-[#0F302A] transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>



<div className="flex items-center gap-1">
  <div className="flex items-center gap-0.5 text-xs">
    {Array.from({ length: 5 }).map((_, index) => {
      const fill = Math.min(Math.max(product.rating - index, 0), 1);

      return (
        <span
          key={index}
          className="relative inline-block text-neutral-300"
        >
          {/* Empty star */}
          <FaStar />

          {/* Filled portion */}
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

  <span className="text-xs text-neutral-400 font-medium">
    ({product.reviewsCount})
  </span>
</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;