import { useEffect, useRef, useState } from "react";
import { FaBagShopping, FaXmark, FaTrash, FaArrowRight } from "react-icons/fa6";
import gsap from "gsap";
import { useCart, type CartItem } from "../ContextProvider";

const initialProducts = [
  {
    id: 1,
    title: "Astrid Solid Oak Dining Table",
    category: "Dining",
    price: 1250,
    formattedPrice: "$1,250",
    image:
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80",
    description:
      "Sustainably harvested European white oak with softly rounded edges.",
    inStock: true,
  },
  {
    id: 2,
    title: "Nordic Lounge Armchair",
    category: "Living",
    price: 820,
    formattedPrice: "$820",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80",
    description: "Textured organic wool bouclé with sculpted walnut armrests.",
    inStock: true,
  },
  {
    id: 3,
    title: "Minimalist Brass Pendant Light",
    category: "Lighting",
    price: 340,
    formattedPrice: "$340",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
    description: "Hand-spun brushed brass fixture casting a warm ambient glow.",
    inStock: true,
  },
  {
    id: 4,
    title: "Symphony Walnut Credenza",
    category: "Storage",
    price: 1690,
    formattedPrice: "$1,690",
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
    description:
      "Seamless soft-close slatted tambour doors and cable management.",
    inStock: false,
  },
  {
    id: 5,
    title: "Kobenhavn Ceramic Coffee Table",
    category: "Living",
    price: 650,
    formattedPrice: "$650",
    image:
      "https://images.unsplash.com/photo-1533779283484-8ab4940aa78f?auto=format&fit=crop&w=600&q=80",
    description: "Stoneware-glazed tabletop paired with blackened steel legs.",
    inStock: true,
  },
  {
    id: 6,
    title: "Atelier Ash Wood Bookshelf",
    category: "Storage",
    price: 980,
    formattedPrice: "$980",
    image:
      "https://images.unsplash.com/photo-1594623930572-300a3011d9ae?auto=format&fit=crop&w=600&q=80",
    description:
      "Open-back modular shelving unit keeping rooms airy and bright.",
    inStock: true,
  },
  {
    id: 7,
    title: "Elysian Linen Sofa 3-Seater",
    category: "Living",
    price: 1850,
    formattedPrice: "$1,850",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    description:
      "Deep plush feather-down cushions upholstered in Belgian linen.",
    inStock: true,
  },
  {
    id: 8,
    title: "Solstice Terrazzo Side Table",
    category: "Living",
    price: 410,
    formattedPrice: "$410",
    image:
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=600&q=80",
    description:
      "Custom poured Italian terrazzo top with architectural iron base.",
    inStock: true,
  },
];

export default function Collections() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeQuickViewId, setActiveQuickViewId] = useState<number | null>(
    null,
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Consume context safely with full flexibility for different provider patterns
  const context = useCart() as unknown as {
    cart?: CartItem[];
    setCart?: React.Dispatch<React.SetStateAction<CartItem[]>>;
    addToCart?: (product: CartItem) => void;
    removeFromCart?: (id: string | number) => void;
    toggleCartItem?: (product: CartItem) => void;
  };
  const cartItems = context?.cart || [];

  // Safe handler supporting multiple Context shapes
  const handleToggleCart = (productData: (typeof initialProducts)[0]) => {
    const targetId = productData.id;

    // Map local mock product shape to match standard CartItem shape
    const productItem: CartItem = {
      id: productData.id,
      name: productData.title,
      price: productData.price,
      image: productData.image,
      quantity: 1,
    };

    const isAlreadyAdded = cartItems.some(
      (item) => Number(item.id || item.id) === Number(targetId),
    );

    if (typeof context?.toggleCartItem === "function") {
      context.toggleCartItem(productItem);
    } else if (
      isAlreadyAdded &&
      typeof context?.removeFromCart === "function"
    ) {
      context.removeFromCart(targetId);
    } else if (!isAlreadyAdded && typeof context?.addToCart === "function") {
      context.addToCart(productItem);
    } else if (typeof context?.setCart === "function") {
      context.setCart((prev: CartItem[] = []): CartItem[] => {
        if (isAlreadyAdded) {
          return prev.filter(
            (item) => Number(item.id || item.id) !== Number(targetId),
          );
        } else {
          return [...prev, productItem];
        }
      });
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );

      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 25, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.2,
          },
        );
      }
    });

    return () => ctx.revert();
  }, [activeCategory]);

  // Drawer Animation
  useEffect(() => {
    if (isCartOpen && drawerRef.current) {
      gsap.fromTo(
        drawerRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.4, ease: "power3.out" },
      );
    }
  }, [isCartOpen]);

  const categories = ["All", "Living", "Dining", "Storage", "Lighting"];

  const filteredProducts =
    activeCategory === "All"
      ? initialProducts
      : initialProducts.filter((p) => p.category === activeCategory);

  const toggleQuickView = (id: number) => {
    setActiveQuickViewId(activeQuickViewId === id ? null : id);
  };

  const cartProducts = cartItems;
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );

  return (
    <div className="bg-[#f7f8f6] min-h-screen py-16 px-4 font-sans text-neutral-900 relative">
      <div className="max-w-7xl mx-auto">
        {/* Top Navbar / Floating Bag Trigger */}
        <div className="flex justify-between items-center mb-10">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Novara Studio &mdash; Catalog
          </span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-white border top-60 fixed z-50 border-neutral-200/80 px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-neutral-50 transition-colors shadow-sm cursor-pointer"
          >
            <FaBagShopping className="text-emerald-900" />
            <span>Bag</span>
            <span className="w-5 h-5 bg-emerald-900 text-white rounded-full flex items-center justify-center text-[10px]">
              {cartItems.length}
            </span>
          </button>
        </div>

        {/* Header */}
        <div
          ref={containerRef}
          className="text-center max-w-2xl mx-auto mb-10 opacity-0"
        >
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest bg-emerald-100/60 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Curated Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 mb-3">
            Collections & Bespoke Pieces.
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base font-medium">
            Explore heritage-quality furniture designed to harmonize with
            natural light and organic aesthetics.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveQuickViewId(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-emerald-900 text-white shadow-md shadow-emerald-900/10 scale-105"
                  : "bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Display */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => {
            const isQuickView = activeQuickViewId === product.id;
            const isAdded = cartItems.some(
              (item) => Number(item.id || item.id) === Number(product.id),
            );

            return (
              <div
                key={product.id}
                className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between opacity-0 ${
                  isQuickView
                    ? "border-emerald-900 ring-2 ring-emerald-900/10 sm:col-span-2 md:col-span-2 lg:col-span-2"
                    : "border-neutral-100"
                }`}
              >
                <div>
                  {/* Image Header */}
                  <div className="h-44 overflow-hidden bg-neutral-200 relative group">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[10px] font-bold text-neutral-900 px-2.5 py-0.5 rounded-full shadow-sm">
                      {product.category}
                    </span>

                    {product.inStock ? (
                      <span className="absolute top-3 right-3 bg-emerald-50 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        In Stock
                      </span>
                    ) : (
                      <span className="absolute top-3 right-3 bg-neutral-100 text-neutral-500 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        Made to Order
                      </span>
                    )}
                  </div>

                  {/* Content Body */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                        {product.title}
                      </h3>
                    </div>
                    <div className="text-sm font-extrabold text-emerald-900 mb-2">
                      {product.formattedPrice}
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed font-medium line-clamp-2">
                      {product.description}
                    </p>

                    {isQuickView && (
                      <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2 animate-fadeIn">
                        <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-900/10 space-y-1">
                          <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                            Studio Specs
                          </p>
                          <p className="text-[11px] text-neutral-700 font-medium">
                            Hand-inspected natural materials. White-glove home
                            delivery and 5-year warranty included.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleQuickView(product.id)}
                    className="flex-1 text-center text-xs font-bold px-3 py-2 rounded-xl bg-neutral-100 text-neutral-800 hover:bg-neutral-200 transition-all cursor-pointer"
                  >
                    {isQuickView ? "Close" : "Details"}
                  </button>

                  <button
                    onClick={() => handleToggleCart(product)}
                    className={`flex-1 text-center text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                      isAdded
                        ? "bg-emerald-900 text-white shadow-sm"
                        : "bg-emerald-900 hover:bg-emerald-800 text-white shadow-sm shadow-emerald-950/10"
                    }`}
                  >
                    {isAdded ? "Saved" : "Add"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shopping Bag Slide-over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div
            ref={drawerRef}
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
                <div className="flex items-center gap-2">
                  <FaBagShopping className="text-emerald-900 text-sm" />
                  <h3 className="text-base font-bold text-neutral-900">
                    Your Selection Bag ({cartItems.length})
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <FaXmark className="text-xs" />
                </button>
              </div>

              {/* Drawer Items List */}
              {cartProducts.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <div className="w-12 h-12 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
                    <FaBagShopping />
                  </div>
                  <p className="text-sm font-bold text-neutral-800">
                    Your bag is currently empty
                  </p>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Explore our curated collection and add bespoke pieces to
                    your design list.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartProducts.map((item, idx) => {
                    const originalProduct = initialProducts.find(
                      (p) => Number(p.id) === Number(item.id || item.id),
                    );

                    return (
                      <div
                        key={`${item.id || item.id}-${idx}`}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-[#f7f8f6] border border-neutral-100"
                      >
                        <img
                          src={item.image || originalProduct?.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-neutral-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs font-extrabold text-emerald-900 mt-0.5">
                            ${Number(item.price || 0).toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (originalProduct) {
                              handleToggleCart(originalProduct);
                            } else if (
                              typeof context?.removeFromCart === "function"
                            ) {
                              context.removeFromCart(item.id || item.id!);
                            }
                          }}
                          className="w-7 h-7 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {cartProducts.length > 0 && (
              <div className="pt-6 border-t border-neutral-100 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-500">
                    Subtotal Estimate
                  </span>
                  <span className="font-extrabold text-neutral-900">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() =>
                    alert("Proceeding to secure studio checkout...")
                  }
                  className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-950/10 cursor-pointer"
                >
                  Proceed to Checkout <FaArrowRight className="text-[10px]" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
