import { useEffect, useRef, useState } from "react";
import { FaArrowRight, FaClock, FaXmark, FaCheck } from "react-icons/fa6";
import gsap from "gsap";

const initialBlogPosts = [
  {
    id: 1,
    title: "The Art of Minimalist Living: Creating Calm in Every Room",
    excerpt: "Discover how stripping away non-essentials transforms your living space into a sanctuary of peace.",
    fullContent: "In our fast-paced contemporary routines, homes perform multiple functions: an office, a resting haven, and a personal sanctuary. When spaces are crowded with visual clutter, our mental bandwidth follows suit. True minimalism isn't about empty rooms; it's about curating objects that carry deep utility, emotional resonance, and immaculate craftsmanship.",
    category: "Design Philosophy",
    readTime: "4 min read",
    date: "May 14, 2026",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Choosing the Right Wood Finish for Your Dining Space",
    excerpt: "From warm walnut to airy white oak—learn how to select tones that complement your lighting.",
    fullContent: "Wood finish is more than an aesthetic preference; it dictates how your furniture responds to daily sunlight, moisture, and wear. Walnut offers rich, dark tones with natural oils that age gracefully, while white oak provides a brighter, modern Scandinavian appeal with high durability against everyday dents.",
    category: "Craftsmanship",
    readTime: "5 min read",
    date: "May 08, 2026",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "Maximizing Natural Light in Compact Urban Apartments",
    excerpt: "Smart furniture placement and reflective surface strategies that make small spaces feel expansive.",
    fullContent: "Positioning low-profile seating away from window frames and incorporating strategic mirrors can double the visual volume of small urban rooms. Pairing this with light-toned oak or ash furniture bounces morning rays across your entire living area.",
    category: "Interior Tips",
    readTime: "3 min read",
    date: "Apr 29, 2026",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "Sustainable Living: Why Solid Wood Outlasts Fast Furniture",
    excerpt: "An inside look at eco-conscious forestry partnerships and why investing in heritage pieces saves resources.",
    fullContent: "Fast furniture utilizes pressed particle board with short lifespans, contributing heavily to landfill waste. Solid hardwood furniture, harvested through zero-waste forestry protocols, can be refinished and passed down across generations, proving both eco-friendly and economically wise.",
    category: "Sustainability",
    readTime: "6 min read",
    date: "Apr 21, 2026",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    title: "Designing Ergonomic Workspaces Without Losing Aesthetics",
    excerpt: "How to blend professional productivity gear seamlessly into your home interior palette.",
    fullContent: "Working from home doesn't mean your living room needs to look like a corporate cubicle. By utilizing matte-black accents, warm wood desktop surfaces, and cable-managed credenzas, you can maintain a sophisticated living environment while supporting all-day comfort.",
    category: "Interior Tips",
    readTime: "4 min read",
    date: "Apr 15, 2026",
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    title: "The Psychology of Color: Setting Moods with Neutral Tones",
    excerpt: "Explore how muted earth tones, soft greens, and warm creams establish a grounded atmosphere.",
    fullContent: "Colors dictate our psychological state upon entering a room. Deep emerald accents combined with neutral stone palettes ground the space, promoting tranquility, focus, and effortless relaxation after a demanding workday.",
    category: "Design Philosophy",
    readTime: "5 min read",
    date: "Apr 02, 2026",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleReadArticleClick = (id: number) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
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
            stagger: 0.06,
            ease: "power2.out",
            delay: 0.2,
          }
        );
      }
    });

    return () => ctx.revert();
  }, [activeCategory]);

  const categories = ["All", "Design Philosophy", "Craftsmanship", "Interior Tips", "Sustainability"];

  const filteredPosts =
    activeCategory === "All"
      ? initialBlogPosts
      : initialBlogPosts.filter((post) => post.category === activeCategory);

  return (
    <div className="bg-[#f7f8f6] min-h-screen py-16 px-4 font-sans text-neutral-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div ref={containerRef} className="text-center max-w-2xl mx-auto mb-10 opacity-0">
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest bg-emerald-100/60 px-3 py-1.5 rounded-full inline-block mb-3">
            The Novara Journal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 mb-3">
            Stories & design insights.
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base font-medium">
            Explore expert advice on crafting thoughtful spaces and modern interior aesthetics.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedPostId(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? "bg-emerald-900 text-white shadow-md shadow-emerald-900/10 scale-105"
                  : "bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 6-Card Grid Layout (3 Columns) */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const isExpanded = expandedPostId === post.id;
            return (
              <div
                key={post.id}
                className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between opacity-0 ${
                  isExpanded ? "border-emerald-900 ring-2 ring-emerald-900/10 lg:col-span-2 md:col-span-2" : "border-neutral-100"
                }`}
              >
                <div>
                  {/* Image Header */}
                  <div className="h-44 overflow-hidden bg-neutral-200 relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[10px] font-bold text-neutral-900 px-2.5 py-1 rounded-full shadow-sm">
                      {post.category}
                    </span>
                    {isExpanded && (
                      <span className="absolute top-3 right-3 bg-emerald-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <FaCheck className="text-[8px]" /> Reading Now
                      </span>
                    )}
                  </div>
                  
                  {/* Content Body */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-medium mb-2">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FaClock className="text-[9px]" /> {post.readTime}
                      </span>
                    </div>
                    
                    <h3 className="text-base font-bold text-neutral-900 mb-2 leading-snug">
                      {post.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Inline Expanded Full Content */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
                        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium bg-emerald-50/50 p-4 rounded-2xl border border-emerald-900/10">
                          {post.fullContent}
                        </p>
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                          <span>Novara Editorial Insight</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 pb-6 pt-0 flex items-center justify-between">
                  <button
                    onClick={() => handleReadArticleClick(post.id)}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                      isExpanded
                        ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                        : "bg-emerald-900 text-white hover:bg-emerald-800 shadow-sm shadow-emerald-950/10"
                    }`}
                  >
                    {isExpanded ? (
                      <>
                        Close <FaXmark className="text-[9px]" />
                      </>
                    ) : (
                      <>
                        Read Article <FaArrowRight className="text-[9px]" />
                      </>
                    )}
                  </button>

                  {isExpanded && (
                    <span className="text-[10px] font-semibold text-emerald-900 animate-pulse">
                      Active View
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}