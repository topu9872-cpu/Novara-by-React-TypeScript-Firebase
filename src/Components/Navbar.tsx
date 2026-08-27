import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
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
  const navbarRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Consume cart state safely from ContextProvider
  const context = useCart() as { cart?: number[] };
  const cart = context?.cart || [];

  // Initial load animation for Navbar elements
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

  // Smooth GSAP animation for mobile dropdown menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, height: 0 },
        { opacity: 1, height: "auto", duration: 0.3, ease: "power2.out" },
      );
    }
  }, [isMobileMenuOpen]);

  const user = auth.currentUser;
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await logout();
    navigate("/login");
    toast.info("signout successfully !");
  };
console.log(user)
  return (
    <header
      ref={navbarRef}
      className="w-full bg-linear-to-r from-white to-amber-50 sticky top-0 z-50"
    >
      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 py-5">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="anim-nav-item opacity-0 md:hidden text-gray-800 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Logo */}
        <div className="anim-nav-item opacity-0 flex items-center">
          <NavLink
            to="/"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            Novara<span className="text-[#0d2322]">.</span>
          </NavLink>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `anim-nav-item opacity-0 text-[15px] font-medium transition-colors duration-200 pb-1   text-nowrap ${
                  isActive
                    ? "text-emerald-600 font-bold  "
                    : "text-gray-400 hover:text-emerald-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Icons */}
        <div className="anim-nav-item opacity-0 flex items-center gap-2 text-gray-900">
         
          {user ?
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
                {/* User Info Header */}
                <div className="px-3 py-3 border-b border-neutral-100 mb-1">
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Signed in as
                  </p>
                  <p className="text-xs font-bold text-emerald-700 truncate mt-0.5">{user.displayName}</p>
                </div>

                {/* Links */}
                <div className="space-y-0.5 py-1">
                  <li>
                    <NavLink
                      to=""
                      className="flex items-center gap-3 text-xs font-semibold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900 rounded-xl px-3 py-2.5 transition-all"
                    >
                      <FaUser className="text-emerald-800 text-sm" />
                      <span>Profile</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to=""
                      className="flex items-center gap-3 text-xs font-semibold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900 rounded-xl px-3 py-2.5 transition-all"
                    >
                      <FaGear className="text-emerald-800 text-sm" />
                      <span>Settings</span>
                    </NavLink>
                  </li>
                </div>

                <div className="my-1 border-t border-neutral-100"></div>

                {/* Logout Action */}
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
          :<div>
            <NavLink className='bg-emerald-800 text-white btn'  to={'/login'}>Login</NavLink>
            </div>}
             <button
            aria-label="Search"
            className="hover:opacity-75 hover:bg-emerald-100  btn btn-ghost btn-circle avatar transition-opacity"
          >
            <Search className="w-5 h-5 text-emerald-700" />
          </button>
          <NavLink
            to="/Collections"
            aria-label="Cart"
            className="hover:opacity-75 hover:bg-emerald-100 btn btn-ghost btn-circle avatar transition-opacity relative flex items-center"
          >
            <FaBagShopping className="text-emerald-800 w-5 h-5" />
            <span className="absolute top-0 right-0 bg-emerald-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cart.length || 0}
            </span>
          </NavLink>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden overflow-hidden bg-white border-b border-gray-200 px-6 py-4 space-y-3"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }: any) =>
                `block text-base font-medium py-2 ${
                  isActive
                    ? "text-[#0d2322] font-semibold pl-2 border-l-4 border-[#0d2322]"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
