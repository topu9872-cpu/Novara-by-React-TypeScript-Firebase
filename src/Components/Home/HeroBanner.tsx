import React, { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router";
import gsap from "gsap";

interface HeroBannerProps {
  badgeText?: string;
  title?: string;
  description?: string;
  price?: string;
  sofaImageUrl?: string;
  onShopNow?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  badgeText = "BEST SELLER",
  title = "Comfort That Completes Your Home.",
  description = "Sleek design. Lasting comfort. Made for modern living.",
  price = "$499.00",
  sofaImageUrl = "/assets/Gemini_Generated_Image_lwpok3lwpok3lwpo.jpg",
  onShopNow,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a smooth timeline for staggered sequential reveals
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Reveal main banner container smoothly with a subtle scale up
      tl.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.98, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1 }
      )
      // 2. Stagger elements inside the left column smoothly
      .fromTo(
        [badgeRef.current, titleRef.current, descRef.current, priceRef.current, buttonRef.current],
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
        "-=0.6" // Overlap slightly with the previous animation for fluidity
      )
      // 3. Elegant fade and scale-in for the right image container
      .fromTo(
        imageWrapperRef.current,
        { opacity: 0, scale: 0.95, x: 30 },
        { opacity: 1, scale: 1, x: 0, duration: 1.1 },
        "-=0.7"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="mx-4">
    <div className="w-full max-w-7xl mx-auto p-4">
      <div 
        ref={containerRef}
        className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-r from-neutral-50 via-neutral-100 to-stone-100 border border-neutral-200/60 shadow-sm opacity-0"
      >
        {/* Background decorative shape behind sofa */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[320px] h-80 lg:w-105 lg:h-105 bg-neutral-200/50 rounded-full blur-2xl pointer-events-none z-0" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center p-8 lg:p-14 gap-8">
          
          {/* Left Content Column */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-4">
            {/* Best Seller Badge */}
            <span ref={badgeRef} className="inline-block px-3.5 py-1.5 text-xs font-semibold tracking-wider text-amber-900 bg-amber-100/80 rounded-full shadow-2xs opacity-0">
              {badgeText}
            </span>

            {/* Title */}
            <h1 ref={titleRef} className="text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 leading-[1.15] opacity-0">
              {title}
            </h1>

            {/* Description */}
            <p ref={descRef} className="text-sm lg:text-base text-neutral-600 max-w-sm leading-relaxed opacity-0">
              {description}
            </p>

            {/* Price */}
            <div ref={priceRef} className="text-2xl font-bold text-neutral-900 pt-1 opacity-0">
              {price}
            </div>

            {/* Action Button */}
            <NavLink 
              ref={buttonRef}
              to={'/shop'}
              onClick={onShopNow}
              className="mt-2 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer opacity-0"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div ref={imageWrapperRef} className="relative w-full max-w-lg lg:max-w-xl aspect-16/10 overflow-hidden rounded-2xl shadow-md opacity-0">
              <img
                src={sofaImageUrl}
                alt="Modern sectional sofa with coffee table and plant"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
    </section>
  );
};

export default HeroBanner;