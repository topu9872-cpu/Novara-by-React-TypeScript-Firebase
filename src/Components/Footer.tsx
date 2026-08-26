import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  brandName?: string;
  brandTagline?: string;
  shopLinks?: FooterLink[];
  companyLinks?: FooterLink[];
  customerServiceLinks?: FooterLink[];
  copyrightText?: string;
}

export const Footer: React.FC<FooterProps> = ({
  brandName = "Novara",
  brandTagline = "Bringing style, comfort & quality\ntogether for your home.",
  shopLinks = [
    { label: "All Products", href: "#" },
    { label: "Living Room", href: "#" },
    { label: "Bedroom", href: "#" },
    { label: "Dining Room", href: "#" },
    { label: "Office Room", href: "#" },
  ],
  companyLinks = [
    { label: "About Us", href: "#" },
    { label: "Our Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "FAQs", href: "#" },
  ],
  customerServiceLinks = [
    { label: "Shipping Policy", href: "#" },
    { label: "Returns & Refunds", href: "#" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
  copyrightText = `© ${new Date().getFullYear()} Novara. All rights reserved.`
}) => {
  const footerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (containerRef.current) {
        // Grab all elements with the animate-item class across the entire footer
        const animatableItems = containerRef.current.querySelectorAll('.animate-item');

        gsap.fromTo(
          animatableItems,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05, // Smooth sequential one-by-one waterfall effect
            ease: "power3.out",
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="w-full mt-6 bg-[#0F302A] text-white pt-16 pb-8 px-6 md:px-16">
      <div ref={containerRef} className="max-w-7xl mx-auto">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col items-start space-y-4">
            <h2 className="animate-item text-3xl font-bold tracking-wider flex items-center opacity-0">
              {brandName}<span className="text-amber-400 text-4xl leading-none ml-0.5">.</span>
            </h2>
            <p className="animate-item text-gray-300 text-sm md:text-base whitespace-pre-line leading-relaxed max-w-sm opacity-0">
              {brandTagline}
            </p>
            
            {/* Social Media Icons */}
            <div className="animate-item flex space-x-3 pt-2 opacity-0">
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white text-[#0F302A] flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white text-[#0F302A] flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-white text-[#0F302A] flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="Youtube" className="w-9 h-9 rounded-full bg-white text-[#0F302A] flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="flex flex-col space-y-3">
            <h3 className="animate-item font-semibold text-lg text-white mb-2 opacity-0">Shop</h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link, idx) => (
                <li key={idx} className="animate-item opacity-0">
                  <a href={link.href} className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="flex flex-col space-y-3">
            <h3 className="animate-item font-semibold text-lg text-white mb-2 opacity-0">Company</h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link, idx) => (
                <li key={idx} className="animate-item opacity-0">
                  <a href={link.href} className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Links */}
          <div className="flex flex-col space-y-3">
            <h3 className="animate-item font-semibold text-lg text-white mb-2 opacity-0">Customer Service</h3>
            <ul className="space-y-2.5">
              {customerServiceLinks.map((link, idx) => (
                <li key={idx} className="animate-item opacity-0">
                  <a href={link.href} className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs md:text-sm text-gray-400 gap-4">
          <p className="animate-item opacity-0">{copyrightText}</p>
          <div className="animate-item flex items-center space-x-2 opacity-0">
            <div className="bg-white px-2.5 py-1 rounded text-blue-700 font-bold tracking-tighter text-xs shadow">VISA</div>
            <div className="bg-white px-2 py-1 rounded text-blue-900 font-semibold text-xs shadow">PayPal</div>
            <div className="bg-white px-2 py-1 rounded text-xs shadow flex items-center space-x-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block -ml-1"></span>
            </div>
            <div className="bg-white px-2 py-1 rounded text-blue-600 font-bold text-xs shadow">GPay</div>
            <div className="bg-white px-2 py-1 rounded text-blue-500 font-bold text-xs shadow">Klarna</div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;