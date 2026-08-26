import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { toast } from 'sonner';

interface NewsletterBannerProps {
  onSubscribe?: (email: string) => void;
  title?: string;
  placeholderText?: string;
  buttonText?: string;
}

// --- Component Definition ---
const Subscribe: React.FC<NewsletterBannerProps> = ({
  onSubscribe,
  title = "Stay Updated With\nOur Latest Offers!",
  placeholderText = "Enter your email",
  buttonText = "Subscribe"
}) => {
  // State to manage the input field
  const [email, setEmail] = useState<string>('');

  // Refs for GSAP animation targets
  const containerRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate container scale/fade in slightly
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      // Animate left side content (Text and Form) sliding from left
      gsap.fromTo(
        leftContentRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.9, delay: 0.2, ease: 'power3.out' }
      );

      // Animate right side image container sliding from right
      gsap.fromTo(
        rightContentRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.9, delay: 0.3, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert(); // Cleanup GSAP context on unmount
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
       toast.success('Thsnks for suscribeing')
      if (onSubscribe) {
        onSubscribe(email);
       
      } else {
        console.log('Subscribed with email:', email);
      }
      setEmail('');
    }
  };

  return (
    <div className='mx-6'>
      <div 
        ref={containerRef}
        className="w-full max-w-7xl mx-auto bg-[#0F302A] rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-xl"
      >
        
        {/* Left Content: Title and Form */}
        <div ref={leftContentRef} className="z-10 flex flex-col items-start w-full md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-snug whitespace-pre-line mb-6">
            {title}
          </h2>
          
          <form 
            onSubmit={handleSubmit}
            className="flex items-center bg-white rounded-full p-1.5 w-full max-w-md shadow-inner"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholderText}
              required
              className="grow px-4 py-2 text-gray-700 bg-transparent focus:outline-none text-sm md:text-base placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-[#0F302A] text-white font-medium px-6 py-2.5 rounded-full hover:bg-[#154238] transition-colors text-sm md:text-base shadow-md"
            >
              {buttonText}
            </button>
          </form>
        </div>

        {/* Right Content: Image with a background color wrapper */}
        <div ref={rightContentRef} className="z-10 flex items-end justify-center md:justify-end w-full md:w-1/2 bg-[#17463E] rounded-2xl p-4">
          <img 
            src="/assets/Gemini_Generated_Image_brzhyrbrzhyrbrzh-removebg-preview.png" 
            alt="Lamp and Plant Decor" 
            className="max-h-48 md:max-h-56 w-80 object-cover object-center"
          />
        </div>

        {/* Background ambient lighting effect */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Subscribe;