import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import gsap from 'gsap';

interface NavItem {
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/collections' },
  { label: 'About Us', to: '/about-us' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Initial load animation for Navbar elements
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.anim-nav-item',
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
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
        { opacity: 1, height: 'auto', duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [isMobileMenuOpen]);

  return (
    <header ref={navbarRef} className="w-full  bg-linear-to-r from-white to-amber-50  sticky top-0 z-50">
      {/* Top Announcement / Accent Bar */}
      <div className="anim-nav-item opacity-0 w-full bg-[#0d2322] text-white text-xs py-1.5 px-6 lg:px-12 flex justify-between items-center">
        <span className="tracking-wide opacity-90">Free Shipping & Returns Available</span>
        <span className="tracking-wide opacity-90 hidden sm:inline">24/7 Customer Support</span>
      </div>

      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 py-5">
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="anim-nav-item opacity-0 md:hidden text-gray-800 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <div className="anim-nav-item opacity-0 flex items-center">
          <NavLink to="/" className="text-2xl font-bold tracking-tight text-gray-900">
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
                `anim-nav-item opacity-0 text-sm font-medium transition-colors duration-200 pb-1 ${
                  isActive
                    ? 'text-gray-900 font-semibold border-b-2 border-[#0d2322]'
                    : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Icons */}
        <div className="anim-nav-item opacity-0 flex items-center gap-5 text-gray-900">
          <button aria-label="Search" className="hover:opacity-75 transition-opacity">
            <Search className="w-5 h-5 text-gray-700" />
          </button>
          <button aria-label="Account" className="hover:opacity-75 transition-opacity">
            <User className="w-5 h-5 text-gray-700" />
          </button>
          <button aria-label="Cart" className="hover:opacity-75 transition-opacity relative">
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-[#0d2322] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden overflow-hidden bg-white border-b border-gray-200 px-6 py-4 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }: any) =>
                `block text-base font-medium py-2 ${
                  isActive
                    ? 'text-[#0d2322] font-semibold pl-2 border-l-4 border-[#0d2322]'
                    : 'text-gray-600 hover:text-gray-900'
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