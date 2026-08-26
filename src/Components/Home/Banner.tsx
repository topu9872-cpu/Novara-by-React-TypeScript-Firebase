import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  FaArrowRight,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaHeadset,
} from "react-icons/fa";

const Banner = () => {
  const compRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for smooth sequence animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Badge animation
      tl.fromTo(
        ".anim-badge",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        // 2. Heading lines appearing sequentially
        .fromTo(
          ".anim-title-line",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 },
          "-=0.3"
        )
        // 3. Paragraph description
        .fromTo(
          ".anim-desc",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        // 4. Buttons group
        .fromTo(
          ".anim-buttons",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        // 5. Trust badges appearing one by one
        .fromTo(
          ".anim-trust-item",
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 },
          "-=0.3"
        )
        // 6. Right side image reveal
        .fromTo(
          ".anim-image",
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 1 },
          "-=0.8"
        );
    }, compRef);

    return () => ctx.revert(); // Cleanup GSAP context on unmount
  }, []);

  return (
    <section
      ref={compRef}
      className="min-h-screen bg-linear-to-r from-white to-amber-50  flex items-center justify-center p-4 lg:p-6 overflow-hidden"
    >
      <div className="relative max-w-7xl w-full bg-linear-to-r from-white to-amber-50 rounded-3xl overflow-hidden">
        <div className="grid lg:grid-cols-2 items-center">
          
          {/* Left Side */}
          <div className="relative z-20 px-8 py-12 lg:px-16 lg:py-16">
            
            {/* Animated Badge */}
            <div className="anim-badge opacity-0">
              <span className="inline-block bg-amber-100 text-amber-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                NEW ARRIVAL
              </span>
            </div>

            {/* Animated Heading */}
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              <span className="anim-title-line inline-block opacity-0">
                Modern Living
              </span>
              <br />
              <span className="anim-title-line text-emerald-900 inline-block transition-transform duration-500 hover:scale-105 cursor-default opacity-0">
                Made Beautiful.
              </span>
            </h1>

            {/* Paragraph */}
            <p className="anim-desc mt-6 text-gray-500 text-lg max-w-md opacity-0">
              Premium furniture collections crafted for comfort, style &
              durability.
            </p>

            {/* Buttons */}
            <div className="anim-buttons mt-8 flex flex-wrap gap-4 opacity-0">
              <button className="group bg-slate-900 hover:bg-black text-white px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-all duration-300 hover:scale-105 active:scale-95">
                <span>Shop Now</span>
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>

              <button className="text-gray-700 font-medium hover:text-black transition-colors px-4 py-3.5">
                Explore Collections
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-6 border-t border-gray-200">
              <div className="anim-trust-item opacity-0 flex flex-col items-center gap-2 text-center group cursor-pointer">
                <div className="p-2.5 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors duration-300">
                  <FaShieldAlt className="text-emerald-700 text-lg transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-xs font-medium text-gray-600">Premium</span>
              </div>

              <div className="anim-trust-item opacity-0 flex flex-col items-center gap-2 text-center group cursor-pointer">
                <div className="p-2.5 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors duration-300">
                  <FaTruck className="text-emerald-700 text-lg transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-xs font-medium text-gray-600">Shipping</span>
              </div>

              <div className="anim-trust-item opacity-0 flex flex-col items-center gap-2 text-center group cursor-pointer">
                <div className="p-2.5 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors duration-300">
                  <FaUndo className="text-emerald-700 text-lg transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-xs font-medium text-gray-600">Returns</span>
              </div>

              <div className="anim-trust-item opacity-0 flex flex-col items-center gap-2 text-center group cursor-pointer">
                <div className="p-2.5 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors duration-300">
                  <FaHeadset className="text-emerald-700 text-lg transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-xs font-medium text-gray-600">Support</span>
              </div>
            </div>

          </div>

          {/* Right Side - Custom Top-Curved Arch Container matching the image */}
          <div className="anim-image opacity-0 relative h-88 sm:h-113 lg:h-155 overflow-hidden lg:rounded-tl-[80px]">
            <img
              src="/assets/Gemini_Generated_Image_pk59nxpk59nxpk59.jpg"
              alt="Hero Furniture"
              className="w-full h-full rounded-3xl object-cover transform hover:scale-95 transition-transform duration-1000 ease-out"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 25%, black 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 25%, black 100%)",
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;