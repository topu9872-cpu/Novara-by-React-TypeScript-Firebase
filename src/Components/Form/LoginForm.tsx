import { useState, useRef, useEffect } from "react";
import { FaGoogle, FaFacebookF, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa6";
import { NavLink } from "react-router";
import gsap from "gsap";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const formElementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Entrance Animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );

      if (formElementsRef.current) {
        gsap.fromTo(
          formElementsRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out", delay: 0.2 }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f7f8f6] px-4 py-12 font-sans">
      <div
        ref={cardRef}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-neutral-100 opacity-0"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <NavLink to="/" className="inline-block text-3xl font-extrabold tracking-tight text-emerald-900 mb-2">
            Novara
          </NavLink>
          <p className="text-sm text-neutral-500 font-medium">
            Enter your credentials to access your account
          </p>
        </div>

        <div ref={formElementsRef}>
          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3.5 mb-6">
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 py-3 px-4 border border-neutral-200/80 rounded-2xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all active:scale-95"
            >
              <FaGoogle className="text-red-500 text-sm" />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 py-3 px-4 border border-neutral-200/80 rounded-2xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all active:scale-95"
            >
              <FaFacebookF className="text-blue-600 text-sm" />
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="grow border-t border-neutral-100"></div>
            <span className="px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
              Or with email
            </span>
            <div className="grow border-t border-neutral-100"></div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3.5 bg-neutral-50/70 border border-neutral-200/80 rounded-2xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-900 focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                  Password
                </label>
                <NavLink
                  to="/forgot-password"
                  className="text-xs font-semibold text-emerald-900 hover:underline"
                >
                  Forgot password?
                </NavLink>
              </div>

              {/* Password Field with Hide/Show Toggle */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 pr-12 bg-neutral-50/70 border border-neutral-200/80 rounded-2xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-900 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-4 px-4 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/10 active:scale-[0.99]"
            >
              Sign In <FaArrowRight className="text-xs" />
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-xs text-neutral-500 mt-8 font-medium">
            Don't have an account?{" "}
            <NavLink to="/register" className="font-bold text-emerald-900 hover:underline">
              Sign up
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  );
}