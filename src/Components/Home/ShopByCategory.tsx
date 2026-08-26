import { FaArrowRight } from "react-icons/fa6";
import { NavLink } from "react-router";

const categories = [
  {
    title: "Living Room",
    items: "120+ items",
    bg: "bg-[#e2eae4]", // soft sage green tint
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Bedroom",
    items: "90+ items",
    bg: "bg-[#e4e9f0]", // soft blue-gray tint
    image:
      "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Dining Room",
    items: "75+ items",
    bg: "bg-[#f8ede3]", // soft peach/warm cream tint
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1c0c85243?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Office Room",
    items: "60+ items",
    bg: "bg-[#f0f0f0]", // soft neutral grey tint
    image:
      "https://images.unsplash.com/photo-1580481077494-e3299ac2569e?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Outdoor",
    items: "45+ items",
    bg: "bg-[#faeee3]", // warm outdoor tint
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
  },
];

export default function ShopByCategory() {
  return (
    <section className="mx-4">
      {/* Inline keyframe animation styling */}
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
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-neutral-900">
            Shop By Category
          </h2>
          <NavLink to={'/shop'} className="text-sm font-semibold text-neutral-800 hover:text-neutral-600 flex items-center gap-1 transition-colors">
            View All <FaArrowRight className="text-xs" />
          </NavLink>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {categories.map((cat, index) => (
            <div
              key={index}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 120}ms forwards`,
                opacity: 0,
              }}
              className={`${cat.bg} rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 shadow-sm`}
            >
              {/* Text Info */}
              <div className="z-10 mb-4">
                <h3 className="text-base font-bold text-neutral-900 mb-0.5">
                  {cat.title}
                </h3>
                <p className="text-xs text-neutral-600">{cat.items}</p>
              </div>

              {/* Category Image */}
              <div className="w-full h-36 mb-6 overflow-hidden rounded-xl flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating Arrow Button */}
              <div className="absolute bottom-5 right-5 z-10">
                <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-300">
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
