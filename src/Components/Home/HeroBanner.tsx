import React from "react";
import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router";

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
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-r from-neutral-50 via-neutral-100 to-stone-100 border border-neutral-200/60 shadow-sm">
        {/* Background decorative shape behind sofa */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[320px] h-80 lg:w-105 lg:h-105 bg-neutral-200/50 rounded-full blur-2xl pointer-events-none z-0" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center p-8 lg:p-14 gap-8">
          {/* Left Content Column */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-4">
            {/* Best Seller Badge */}
            <span className="inline-block px-3.5 py-1.5 text-xs font-semibold tracking-wider text-amber-900 bg-amber-100/80 rounded-full shadow-2xs">
              {badgeText}
            </span>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 leading-[1.15]">
              {title}
            </h1>

            {/* Description */}
            <p className="text-sm lg:text-base text-neutral-600 max-w-sm leading-relaxed">
              {description}
            </p>

            {/* Price */}
            <div className="text-2xl font-bold text-neutral-900 pt-1">
              {price}
            </div>

            {/* Action Button */}
            <NavLink to={'/shop'}
              onClick={onShopNow}
              className="mt-2 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-xl aspect-16/10 overflow-hidden rounded-2xl">
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
  );
};

export default HeroBanner;
