import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { NavLink } from "react-router";
import { FaArrowRight } from "react-icons/fa";
import { db } from "../../firebase/firebase";

interface Product {
  category?: string;
  image?: string;
  images?: string[];
}

interface Category {
  title: string;
  items: string;
  image: string;
  bg: string;
}

const backgrounds = [
  "bg-[#e5ede9]",
  "bg-[#e5eaf2]",
  "bg-[#f8ede3]",
  "bg-[#f1f1f1]",
  "bg-[#f8ede3]",
];

export default function ShopByCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "Products")).then((snap) => {
      const map = new Map<string, Product[]>();
      snap.docs.forEach((doc) => {
        const p = doc.data() as Product;
        if (p.category)
          map.set(p.category, [...(map.get(p.category) || []), p]);
      });
      setCategories(
        [...map].slice(0, 5).map(([title, products], i) => ({
          title,
          items: `${products.length}+ items`,
          image: products[0]?.image || "",
          bg: backgrounds[i % backgrounds.length],
        })),
      );
      setLoading(false);
    });
  }, []);
  return (
    <section className="mx-4">
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-neutral-900">
            Shop By Category
          </h2>

          <NavLink
            to="/shop"
            className="text-sm font-semibold text-neutral-800 hover:text-neutral-600 flex items-center gap-1 transition-colors"
          >
            View All
            <FaArrowRight className="text-xs" />
          </NavLink>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-64 rounded-3xl bg-neutral-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Categories */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {categories.map((cat, index) => (
              <NavLink
                key={cat.title}
                to={`/shop?category=${encodeURIComponent(cat.title)}`}
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
                <div className="w-full h-36 mb-6 overflow-hidden rounded-xl flex items-center justify-center bg-white/30">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-sm text-neutral-500">No image</div>
                  )}
                </div>

                {/* Arrow */}
                <div className="absolute bottom-5 right-5 z-10">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-300">
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        )}

        {/* No categories */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-10 text-neutral-500">
            No categories available.
          </div>
        )}
      </div>
    </section>
  );
}
