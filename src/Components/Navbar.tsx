import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import { Search, User, Menu, X } from "lucide-react";
import gsap from "gsap";
import {
  FaArrowRightFromBracket,
  FaBagShopping,
  FaGear,
  FaUser,
} from "react-icons/fa6";
import { useCart } from "../ContextProvider";
import { toast } from "sonner";
import { logout } from "../services/auth";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";

interface NavItem {
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/Collections" },
  { label: "About Us", to: "/about-us" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const navbarRef = useRef<HTMLDivElement>(null);
  const mobileSidebarRef = useRef<HTMLDivElement>(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  
  const navigate = useNavigate();
  
  const context = useCart() as { cart?: number[] };
  const cart = context?.cart || [];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".anim-nav-item",
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
      );
    }, navbarRef);

    return () => ctx.revert();
  }, []);

  // Smooth entry animation for the compact mobile panel
  useEffect(() => {
    if (isMobileMenuOpen && mobileSidebarRef.current) {
      gsap.fromTo(
        mobileSidebarRef.current,
        { opacity: 0, scale: 0.95, y: -10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/login");
      toast.info("Signed out successfully!");
    } catch (error) {
      toast.error("Failed to sign out.");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    params.set("page", "1"); // Reset pagination on search change
    setSearchParams(params);

    // If user is searching from any page other than shop, redirect them to /shop
    if (window.location.pathname !== "/shop") {
      navigate(`/shop?${params.toString()}`);
    }
  };

  return (
    <header
      ref={navbarRef}
      className="w-full bg-linear-to-r from-white to-amber-50 sticky top-0 z-50 shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 py-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="anim-nav-item opacity-0 md:hidden text-gray-800 focus:outline-none p-1"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="anim-nav-item opacity-0 flex items-center">
          <NavLink
            to="/"
            className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900"
          >
            Novara<span className="text-[#0d2322]">.</span>
          </NavLink>
        </div>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `anim-nav-item opacity-0 text-[15px] font-medium transition-colors duration-200 pb-1 text-nowrap ${
                  isActive
                    ? "text-emerald-600 font-bold"
                    : "text-gray-500 hover:text-emerald-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="anim-nav-item opacity-0 flex items-center gap-1 sm:gap-3 text-gray-900">
          {/* Direct Search Bar with Toggle */}
          <div className="flex items-center relative">
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showSearch ? "w-32 sm:w-52 opacity-100 mr-1" : "w-0 opacity-0"
              }`}
            >
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={handleSearchChange}
                className="input input-bordered input-sm w-full bg-white text-neutral-900"
              />
            </div>

            <button
              onClick={() => setShowSearch(!showSearch)}
              className="btn btn-ghost btn-circle hover:bg-emerald-100"
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5 text-emerald-700" />
            </button>
          </div>

          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost hover:bg-emerald-100 btn-circle avatar"
              >
                <User className="w-5 h-5 text-emerald-700" />
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-white rounded-2xl z-1 mt-3 w-60 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-neutral-100"
              >
                <div className="px-3 py-3 border-b border-neutral-100 mb-1">
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Signed in as
                  </p>
                  <p className="text-xs font-bold text-emerald-700 truncate mt-0.5">
                    {user.displayName || user.email}
                  </p>
                </div>

                <div className="space-y-0.5 py-1">
                  <li>
                    <NavLink
                      to="/profile"
                      className="flex items-center gap-3 text-xs font-semibold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900 rounded-xl px-3 py-2.5 transition-all"
                    >
                      <FaUser className="text-emerald-800 text-sm" />
                      <span>Profile</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/settings"
                      className="flex items-center gap-3 text-xs font-semibold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900 rounded-xl px-3 py-2.5 transition-all"
                    >
                      <FaGear className="text-emerald-800 text-sm" />
                      <span>Settings</span>
                    </NavLink>
                  </li>
                </div>

                <div className="my-1 border-t border-neutral-100"></div>

                <div className="py-1">
                  <li>
                    <button
                      onClick={handleSignOut}
                      type="button"
                      className="w-full flex items-center gap-3 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl px-3 py-2.5 transition-all text-left"
                    >
                      <FaArrowRightFromBracket className="text-red-500 text-sm" />
                      Logout
                    </button>
                  </li>
                </div>
              </ul>
            </div>
          ) : (
            <div className="hidden sm:block">
              <NavLink className="bg-emerald-800 text-white btn btn-sm px-4" to="/login">
                Login
              </NavLink>
            </div>
          )}

          <NavLink
            to="/cart"
            aria-label="Cart"
            className="hover:opacity-75 hover:bg-emerald-100 btn btn-ghost btn-circle avatar transition-opacity relative flex items-center justify-center"
          >
            <FaBagShopping className="text-emerald-800 w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute top-1 right-1 bg-emerald-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </NavLink>
        </div>
      </div>

      {/* Compact Mobile Floating Dropdown / Sidebar Box */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full px-4 py-3 z-50">
          <div
            ref={mobileSidebarRef}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 space-y-2 max-h-[75vh] overflow-y-auto"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-sm font-medium py-2.5 px-4 rounded-xl transition-colors ${
                    isActive
                      ? "text-emerald-700 bg-emerald-50 font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {!user && (
              <div className="pt-2 border-t border-gray-100 mt-2">
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-emerald-800 text-white btn btn-sm text-center block py-2"
                >
                  Login
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;