import { useEffect, useRef, useState } from "react";
import { FaLocationDot, FaPhone, FaEnvelope, FaPaperPlane, FaCheck, FaCalendar, FaXmark } from "react-icons/fa6";
import gsap from "gsap";

const consultationTypes = [
  { id: "bespoke", title: "Bespoke Furniture Mapping", duration: "45 mins", price: "Free" },
  { id: "full-interior", title: "Full Interior Architecture", duration: "60 mins", price: "$150" },
  { id: "material", title: "Material & Fabric Selection", duration: "30 mins", price: "Free" },
];

const availableSlots = [
  "10:00 AM – 11:00 AM",
  "02:00 PM – 03:00 PM",
  "04:30 PM – 05:30 PM",
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [ , setSelectedService] = useState(consultationTypes[0]);
  const [ , setSelectedTime] = useState(availableSlots[0]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const bookingBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
        );
      }

      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.8, delay: 0.3, ease: "power3.out" }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Smooth animation when opening the inline booking drawer
  useEffect(() => {
    if (isBookingOpen && bookingBoxRef.current) {
      gsap.fromTo(
        bookingBoxRef.current,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [isBookingOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  return (
    <div className="bg-[#f7f8f6] min-h-screen py-16 px-4 font-sans text-neutral-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div ref={containerRef} className="text-center max-w-2xl mx-auto mb-16 opacity-0">
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest bg-emerald-100/60 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 mb-3">
            Let's craft your space together.
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base font-medium">
            Have a question about our bespoke furniture, design consultations, or order tracking? Our studio is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Contact Information & Interactive Consultation Banner */}
          <div ref={infoRef} className="lg:col-span-5 space-y-6 opacity-0">
            <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">
                Studio Headquarters
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-900 flex items-center justify-center shrink-0 mt-1">
                    <FaLocationDot className="text-sm" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Visit Us</h4>
                    <p className="text-sm font-semibold text-neutral-800 leading-snug">
                      442 Nordic Avenue, Suite 300<br />
                      Copenhagen, Denmark
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-900 flex items-center justify-center shrink-0 mt-1">
                    <FaPhone className="text-sm" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Direct Line</h4>
                    <p className="text-sm font-semibold text-neutral-800">
                      +45 35 25 60 00
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-900 flex items-center justify-center shrink-0 mt-1">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Email Inquiries</h4>
                    <p className="text-sm font-semibold text-neutral-800">
                      studio@novara-design.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Consultation Banner / Inline Widget */}
            <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-md relative overflow-hidden transition-all duration-300">
              {!isBookingOpen ? (
                <>
                  <h4 className="text-base font-bold mb-2">Book a Private Consultation</h4>
                  <p className="text-xs text-emerald-100 leading-relaxed mb-4">
                    Work directly with our lead interior architects for custom space mapping and material matching.
                  </p>
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold underline cursor-pointer hover:text-emerald-200 transition-colors bg-transparent border-none p-0 text-white"
                  >
                    Schedule a session &rarr;
                  </button>
                </>
              ) : (
                <div ref={bookingBoxRef} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <FaCalendar className="text-emerald-300 text-xs" /> Instant Consultation Booking
                    </h4>
                    <button
                      onClick={() => {
                        setIsBookingOpen(false);
                        setBookingSuccess(false);
                      }}
                      className="w-7 h-7 rounded-full bg-emerald-800 text-emerald-200 flex items-center justify-center hover:bg-emerald-700 transition-colors"
                    >
                      <FaXmark className="text-xs" />
                    </button>
                  </div>

                  {bookingSuccess ? (
                    <div className="bg-emerald-800/80 p-4 rounded-2xl text-center space-y-2">
                      <div className="w-8 h-8 bg-white text-emerald-900 rounded-full flex items-center justify-center mx-auto text-sm font-bold">
                        <FaCheck />
                      </div>
                      <h5 className="text-xs font-bold text-white">Session Reserved!</h5>
                      <p className="text-[11px] text-emerald-200">We've locked in your slot and sent a calendar invite to your email.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-200 uppercase tracking-wider mb-1">Select Service</label>
                        <select
                          onChange={(e) => setSelectedService(consultationTypes.find(s => s.id === e.target.value) || consultationTypes[0])}
                          className="w-full bg-emerald-950/60 border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-300"
                        >
                          {consultationTypes.map((item) => (
                            <option key={item.id} value={item.id} className="bg-emerald-900 text-white">
                              {item.title} ({item.duration})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-emerald-200 uppercase tracking-wider mb-1">Select Time Slot</label>
                        <select
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full bg-emerald-950/60 border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-300"
                        >
                          {availableSlots.map((slot) => (
                            <option key={slot} value={slot} className="bg-emerald-900 text-white">
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-white text-emerald-900 font-bold py-2.5 rounded-xl text-xs hover:bg-emerald-50 transition-colors shadow-sm"
                      >
                        Confirm Booking
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Interactive Contact Form */}
          <div ref={formRef} className="lg:col-span-7 opacity-0">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Send a Message
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium mb-8">
                Fill out the form below and our design team will get back to you within 24 hours.
              </p>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-900/10 rounded-2xl p-8 text-center space-y-3 animate-fadeIn my-12">
                  <div className="w-12 h-12 bg-emerald-900 text-white rounded-full flex items-center justify-center mx-auto text-lg shadow-md">
                    <FaCheck />
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900">Message Sent Successfully!</h4>
                  <p className="text-xs text-neutral-600 max-w-sm mx-auto font-medium">
                    Thank you for reaching out to Novara. One of our design coordinators will review your inquiry shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="name"
                        className="w-full bg-[#f7f8f6] border border-neutral-200/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-emerald-900 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="email"
                        className="w-full bg-[#f7f8f6] border border-neutral-200/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-emerald-900 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                      Subject / Inquiry Type
                    </label>
                    <select
                      className="w-full bg-[#f7f8f6] border border-neutral-200/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-emerald-900 transition-colors"
                    >
                      <option>General Studio Question</option>
                      <option>Bespoke Furniture Order</option>
                      <option>Interior Design Consultation</option>
                      <option>Order Tracking & Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                      Your Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your project, custom furniture needs, or questions..."
                      className="w-full bg-[#f7f8f6] border border-neutral-200/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-emerald-900 transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-emerald-950/10 flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    Send Message <FaPaperPlane className="text-xs" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}