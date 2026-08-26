import { useEffect, useRef } from "react";
import gsap from "gsap";
import { FaBoxOpen, FaAward, FaSmile, FaHeadset } from "react-icons/fa";

const StatsBar = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div className="px-8">
    <div
      ref={ref}
      className="max-w-7xl w-full bg-[#0d2322] text-white rounded-2xl mx-auto  py-5 px-8 grid grid-cols-2 md:grid-cols-4 gap-6 items-center shadow-lg"
    >
      <div className="opacity-0 flex items-center gap-3">
        <FaBoxOpen className="text-teal-300 text-2xl shrink-0" />
        <div>
          <h4 className="text-lg font-bold">500+</h4>
          <p className="text-xs text-teal-200/70">Unique Products</p>
        </div>
      </div>

      <div className="opacity-0 flex items-center gap-3">
        <FaAward className="text-teal-300 text-2xl shrink-0" />
        <div>
          <h4 className="text-lg font-bold">120+</h4>
          <p className="text-xs text-teal-200/70">Premium Brands</p>
        </div>
      </div>

      <div className="opacity-0 flex items-center gap-3">
        <FaSmile className="text-teal-300 text-2xl shrink-0" />
        <div>
          <h4 className="text-lg font-bold">10K+</h4>
          <p className="text-xs text-teal-200/70">Happy Customers</p>
        </div>
      </div>

      <div className="opacity-0 flex items-center gap-3">
        <FaHeadset className="text-teal-300 text-2xl shrink-0" />
        <div>
          <h4 className="text-lg font-bold">24/7</h4>
          <p className="text-xs text-teal-200/70">Customer Support</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StatsBar;