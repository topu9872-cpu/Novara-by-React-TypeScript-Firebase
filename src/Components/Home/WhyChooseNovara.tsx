
import { FaGem, FaBoxOpen, FaTruckFast, FaShieldHalved } from "react-icons/fa6";

const features = [
  {
    icon: <FaGem className="text-xl text-neutral-800" />,
    title: "High Quality",
    description: "Crafted with premium materials",
  },
  {
    icon: <FaBoxOpen className="text-xl text-neutral-800" />,
    title: "Fast Delivery",
    description: "Quick & reliable shipping",
  },
  {
    icon: <FaTruckFast className="text-xl text-neutral-800" />,
    title: "Easy Returns",
    description: "Hassle-free returns policy",
  },
  {
    icon: <FaShieldHalved className="text-xl text-neutral-800" />,
    title: "Secure Payment",
    description: "100% secure payment guarantee",
  },
];

export default function WhyChooseNovara() {
  return (
    <section className="mx-6">
      {/* Injecting keyframe animation directly so no tailwind.config changes are needed */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-10 font-sans">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">
          Why Choose Novara?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 150}ms forwards`,
                opacity: 0,
              }}
              className="bg-[#fcf9f7] rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-sm font-bold text-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-45">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}