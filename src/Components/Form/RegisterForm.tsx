import { useState, useRef, useEffect } from "react";
import {
  FaGoogle,
  FaFacebookF,
  FaGithub,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaXmark,
} from "react-icons/fa6";
import { NavLink, useLocation, useNavigate } from "react-router";
import gsap from "gsap";
import type { User } from "../../types/User";
import { toast } from "sonner";
import { facebookLogin, githubLogin, googleLogin, signUp } from "../../services/auth";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
const [authError, setAuthError] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);
  const formElementsRef = useRef<HTMLDivElement>(null);

  // Live validation checks
  const isMinLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    // GSAP Entrance Animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
      );

      if (formElementsRef.current) {
        gsap.fromTo(
          formElementsRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.2,
          },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as unknown as User;

    if (!formData.email) {
      toast.error("Please enter your email", {
        style: {
          background: "#DC2626",
          color: "#FFFFFF",
          border: "1px solid #B91C1C",
        },
      });
      return;
    }

    if (!isMinLength || !hasSpecialChar) {
      toast.error("Please meet all password requirements", {
        style: {
          background: "#DC2626",
          color: "#FFFFFF",
          border: "1px solid #B91C1C",
        },
      });
      return;
    }

    try {
      const user = await signUp(
        formData.name!,
        formData.email,
        formData.password,
      );

      toast.success(`Welcome ${user.displayName}`);
      navigate(from, { replace: true });
      e.currentTarget.reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

const handleGoogleLogin = async () => {
  setAuthError("");

  try {
    await googleLogin();

    navigate(from, {
      replace: true,
    });
  } catch (error: any) {
    console.error("GOOGLE ERROR:", error);

    if (
      error.code ===
      "auth/account-exists-with-different-credential"
    ) {
      setAuthError(
        "An account with this email already exists. Please sign in using your existing Google, Facebook, GitHub, or email account."
      );
      return;
    }

    if (error.code === "auth/popup-closed-by-user") {
      setAuthError(
        "The Google sign-in window was closed before the sign-in was completed."
      );
      return;
    }

    if (error.code === "auth/popup-blocked") {
      setAuthError(
        "The sign-in popup was blocked by your browser. Please allow popups and try again."
      );
      return;
    }

    setAuthError(
      "We couldn't sign you in with Google. Please try again."
    );
  }
};

const handleFacebookLogin = async () => {
  setAuthError("");

  try {
    await facebookLogin();

    navigate(from, {
      replace: true,
    });
  } catch (error: any) {
    console.error("FACEBOOK ERROR:", error);

    if (
      error.code ===
      "auth/account-exists-with-different-credential"
    ) {
      setAuthError(
        "An account with this email already exists. Please sign in using your existing Google, Facebook, GitHub, or email account."
      );
      return;
    }

    if (error.code === "auth/popup-closed-by-user") {
      setAuthError(
        "The Facebook sign-in window was closed before the sign-in was completed."
      );
      return;
    }

    if (error.code === "auth/popup-blocked") {
      setAuthError(
        "The sign-in popup was blocked by your browser. Please allow popups and try again."
      );
      return;
    }

    setAuthError(
      "We couldn't sign you in with Facebook. Please try again."
    );
  }
};
const handleGitHubLogin = async () => {
  setAuthError("");

  try {
    await githubLogin();

    navigate(from, {
      replace: true,
    });
  } catch (error: any) {
    console.error("GITHUB ERROR:", error);

    if (
      error.code ===
      "auth/account-exists-with-different-credential"
    ) {
      setAuthError(
        "An account with this email already exists. Please sign in using your existing Google, Facebook, or email account."
      );
      return;
    }

    setAuthError(
      "We couldn't sign you in with GitHub. Please try again."
    );
  }
};

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f7f8f6] px-4 py-12 font-sans">
      <div
        ref={cardRef}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-neutral-100 opacity-0"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <NavLink
            to="/"
            className="inline-block text-3xl font-extrabold tracking-tight text-emerald-900 mb-2"
          >
            Novara
          </NavLink>
          <p className="text-sm text-neutral-500 font-medium">
            Create an account to start shopping
          </p>
        </div>

        <div ref={formElementsRef}>
          {/* Social Signups */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-3 border border-neutral-200/80 rounded-2xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all active:scale-95"
            >
              <FaGoogle className="text-red-500 text-sm" />
              Google
            </button>
            <button
              onClick={handleFacebookLogin}
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-3 border border-neutral-200/80 rounded-2xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all active:scale-95"
            >
              <FaFacebookF className="text-blue-600 text-sm" />
              Facebook
            </button>
            <button
              onClick={handleGitHubLogin}
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-3 border border-neutral-200/80 rounded-2xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all active:scale-95"
            >
              <FaGithub className="text-neutral-900 text-sm" />
              GitHub
            </button>
          </div>
   {authError && (
  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
    <p className="text-sm font-semibold text-red-700">
      Sign-in failed
    </p>

    <p className="mt-1 text-sm text-red-600">
      {authError}
    </p>
  </div>
)}
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="grow border-t border-neutral-100"></div>
            <span className="px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
              Or with email
            </span>
            <div className="grow border-t border-neutral-100"></div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                name="name"
                placeholder="enter your fullname"
                className="w-full px-4 py-3.5 bg-neutral-50/70 border border-neutral-200/80 rounded-2xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-900 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                name="email"
                placeholder="enter your email"
                className="w-full px-4 py-3.5 bg-neutral-50/70 border border-neutral-200/80 rounded-2xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-900 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1.5 uppercase tracking-wider">
                Password
              </label>

              {/* Password Field with Hide/Show Toggle */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="w-full px-4 py-3.5 pr-12 bg-neutral-50/70 border border-neutral-200/80 rounded-2xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-900 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-base" />
                  ) : (
                    <FaEye className="text-base" />
                  )}
                </button>
              </div>

              {/* Real-time Requirement Checklist */}
              {password.length > 0 && (
                <div className="mt-2.5 space-y-1 px-1 transition-all">
                  <div
                    className={`flex items-center gap-2 text-xs font-medium transition-colors ${isMinLength ? "text-emerald-600" : "text-neutral-400"}`}
                  >
                    {isMinLength ? (
                      <FaCheck className="text-[10px]" />
                    ) : (
                      <FaXmark className="text-[10px]" />
                    )}
                    <span>At least 8 characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 text-xs font-medium transition-colors ${hasSpecialChar ? "text-emerald-600" : "text-neutral-400"}`}
                  >
                    {hasSpecialChar ? (
                      <FaCheck className="text-[10px]" />
                    ) : (
                      <FaXmark className="text-[10px]" />
                    )}
                    <span>Includes a special character (!@#$%...)</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-4 px-4 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/10 active:scale-[0.99]"
            >
              Create Account <FaArrowRight className="text-xs" />
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-xs text-neutral-500 mt-8 font-medium">
            Already have an account?{" "}
            <button
              className="font-bold text-emerald-900 hover:underline hover:text-blue-500"
              onClick={() =>
                navigate("/login", {
                  state: location.state,
                })
              }
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}