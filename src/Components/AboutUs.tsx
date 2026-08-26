import { useEffect, useRef } from "react";
import { NavLink } from "react-router";
import { FaArrowRight, FaShieldHeart, FaLeaf} from "react-icons/fa6";
import gsap from "gsap";
import { Sofa } from "lucide-react";

export default function AboutUs() {
  const headerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // Story Section Stagger Animation
      if (storyRef.current) {
        gsap.fromTo(
          storyRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }

      // Stats Animation
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.4,
          }
        );
      }

      // Values Section Stagger Animation
      if (valuesRef.current) {
        gsap.fromTo(
          valuesRef.current.children,
          { opacity: 0, scale: 0.95, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: valuesRef.current,
              start: "top 80%",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#f7f8f6] min-h-screen text-neutral-900 font-sans">
      
      {/* Hero Header */}
      <section ref={headerRef} className="max-w-7xl mx-auto px-4 pt-20 pb-12 text-center opacity-0">
        <span className="text-xs font-bold text-emerald-900 uppercase tracking-widest bg-emerald-100/60 px-3.5 py-1.5 rounded-full inline-block mb-4">
          About Novara
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 max-w-3xl mx-auto mb-6 leading-tight">
          Crafting spaces that feel like home.
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-medium">
          At Novara, we believe furniture is more than just an object in a room—it’s the foundation of your daily life, comfort, and timeless memories.
        </p>
      </section>

      {/* Statistics Banner */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 text-center shadow-sm opacity-0">
            <span className="block text-3xl font-extrabold text-emerald-900 mb-1">12+</span>
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Years Experience</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 text-center shadow-sm opacity-0">
            <span className="block text-3xl font-extrabold text-emerald-900 mb-1">50k+</span>
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Homes Furnished</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 text-center shadow-sm opacity-0">
            <span className="block text-3xl font-extrabold text-emerald-900 mb-1">100%</span>
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Sustainable Wood</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 text-center shadow-sm opacity-0">
            <span className="block text-3xl font-extrabold text-emerald-900 mb-1">4.9★</span>
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Customer Rating</span>
          </div>
        </div>
      </section>

      {/* Our Story / Split Image Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div ref={storyRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Content */}
          <div className="space-y-6 opacity-0">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              Designed for modern living, built to last generations.
            </h2>
            <p className="text-neutral-600 leading-relaxed font-medium">
              Founded with a passion for minimalist design and high-end craftsmanship, Novara bridges the gap between aesthetic beauty and everyday functionality. Every chair, table, and sofa we offer goes through rigorous design thinking and material selection.
            </p>
            <p className="text-neutral-600 leading-relaxed font-medium">
              We partner with sustainable artisans who share our core vision: creating ethical, timeless furniture that adapts seamlessly to your evolving lifestyle.
            </p>
            <div className="pt-4">
              <NavLink
                to="/Collections"
                className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-bold px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-900/10"
              >
                Explore Collection <FaArrowRight className="text-xs" />
              </NavLink>
            </div>
          </div>

          {/* Right: Featured Imagery Grid */}
          <div className="grid grid-cols-2 gap-4 opacity-0">
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden shadow-sm h-64 bg-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
                  alt="Living Room Setup"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-sm h-40 bg-emerald-900 p-6 flex flex-col justify-center text-white">
                <span className="text-2xl font-extrabold mb-1">Handcrafted</span>
                <span className="text-xs text-emerald-200 font-medium">Precision joinery & finish</span>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-3xl overflow-hidden shadow-sm h-40 bg-neutral-900 p-6 flex flex-col justify-center text-white">
                <span className="text-2xl font-extrabold mb-1">Timeless</span>
                <span className="text-xs text-neutral-400 font-medium">Modern aesthetic appeal</span>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-sm h-64 bg-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=600&auto=format&fit=crop"
                  alt="Bedroom Setup"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Core Values Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
            What Drives Our Process
          </h2>
          <p className="text-sm text-neutral-500 font-medium">
            Core pillars that guide everything we create and deliver straight to your doorstep.
          </p>
        </div>

        <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Value 1 */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] opacity-0">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-900 mb-6">
              <FaShieldHeart className="text-xl" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Unmatched Quality</h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-medium">
              We use premium solid woods, durable performance fabrics, and reinforced frames designed to withstand real everyday life.
            </p>
          </div>

          {/* Value 2 */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] opacity-0">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-900 mb-6">
              <FaLeaf className="text-xl" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Sustainable Living</h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-medium">
              Eco-conscious sourcing is at our heart. Our materials are responsibly harvested with zero-waste packaging protocols.
            </p>
          </div>

          {/* Value 3 */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] opacity-0">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-900 mb-6">
              <Sofa className="text-xl" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Thoughtful Design</h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-medium">
              Every curve and angle is meticulously balanced to ensure your space looks sophisticated while maintaining supreme comfort.
            </p>
          </div>

        </div>
      </section>

      {/* Customer Promise Section */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="bg-emerald-900 text-white rounded-[3rem] p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest bg-emerald-800 px-3.5 py-1.5 rounded-full inline-block">
              The Novara Promise
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to transform your living spaces?
            </h2>
            <p className="text-emerald-100/80 text-sm font-medium leading-relaxed">
              Enjoy white-glove assembly, 30-day trial periods, and expert design guidance on every order.
            </p>
          </div>
          <div>
            <NavLink
              to="/shop"
              className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-emerald-900 text-sm font-bold px-8 py-4 rounded-2xl transition-all shadow-xl"
            >
              Start Shopping <FaArrowRight className="text-xs" />
            </NavLink>
          </div>
        </div>
      </section>

    </div>
  );
}