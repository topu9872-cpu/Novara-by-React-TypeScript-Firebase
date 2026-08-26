import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { NavLink } from "react-router";

export const SummerSale: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate text content and button
      gsap.from(contentRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Animate the separate image coming from the right
      gsap.from(imageRef.current, {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      });
    }, bannerRef);

    return () => ctx.revert(); // Cleanup GSAP context on unmount
  }, []);

  return (
    <div className="mx-8">
    <div
      ref={bannerRef}
      className="relative w-full bg-amber-200 mx-auto max-w-7xl h-72 overflow-hidden bg-cover bg-center flex items-center justify-between px-12  rounded-3xl mb-6"
      style={{
        backgroundImage: `url(${"/assets/Gemini_Generated_Image_7dw6zu7dw6zu7dw6.jpg"})`,
      }}
    >
      {/* Optional dark overlay for readability */}
      <div className="absolute inset-0 pointer-events-none" />

      {/* Content Container (Left Side) */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-start text-white max-w-md"
      >
        <span className="text-sm font-medium tracking-wide uppercase opacity-90 mb-2">
          Summer Sale
        </span>

        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
          Up to 30% Off <br />
          On Selected Items
        </h1>

        <NavLink
          to={"/shop"}
          className="bg-white text-gray-900 font-medium px-6 py-2.5 rounded-full shadow-md hover:bg-gray-100 transition-colors flex items-center gap-2 group"
        >
          <span>Shop Now</span>
          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>
        </NavLink>
      </div>

      {/* Separate Image Container (Right Side) */}
      <div className="relative z-10 h-full flex items-end">
        <img
          ref={imageRef}
          src="/assets/FB_IMGgh-removebg-preview.png"
          alt="Summer Sale Item"
          className="max-h-[85%]"
        />
      </div>
      </div>
    </div>
  );
};