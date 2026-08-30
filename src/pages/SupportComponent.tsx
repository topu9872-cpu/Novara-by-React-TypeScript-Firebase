import React, { useState } from "react";
import { 
  HelpCircle, 
  Mail, 
  MessageSquare, 
  Send, 
  ChevronDown, 
  Loader2, 
  CheckCircle2, 
  PhoneCall 
} from "lucide-react";
import { toast } from "sonner";
import { type User } from "firebase/auth";

interface Props {
  currentUser?: User | null;
}

const FAQ_ITEMS = [
  {
    question: "How can I track my order status?",
    answer: "You can track your order in real-time by navigating to the Orders section in your profile dashboard. Select your active order to view its shipment status and tracking code."
  },
  {
    question: "What is your refund and return policy?",
    answer: "We offer a 30-day hassle-free return policy. Items must be unused, in original packaging, and submitted with your proof of purchase."
  },
  {
    question: "How do I change or reset my password?",
    answer: "You can update your password under Settings > Security. If you forgot your password, click 'Forgot Password' on the login screen to receive a reset link via email."
  },
  {
    question: "What payment methods are supported?",
    answer: "We accept all major debit and credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay."
  }
];

export const SupportComponent: React.FC<Props> = ({ currentUser }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First open by default
  const [category, setCategory] = useState("General Query");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      return toast.error("Please fill in both the subject and message fields.");
    }

    try {
      setLoading(true);

      // Simulate API call / Firestore save delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      toast.success("Support ticket submitted successfully!");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4 sm:p-6 pb-16">
      {/* Top Banner Header */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-sm space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
          <HelpCircle size={22} className="text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">How can we help you today?</h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
          Browse our frequently asked questions or submit a ticket directly to our support team.
        </p>
      </div>

      {/* Quick Contact Info Cards (2 cards now) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Mail size={18} />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-neutral-800">Email Support</p>
            <p className="text-[11px] text-neutral-500">Response within 24h</p>
            <p className="text-xs font-semibold text-emerald-600 pt-1">support@example.com</p>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <PhoneCall size={18} />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-neutral-800">Direct Line</p>
            <p className="text-[11px] text-neutral-500">Mon - Fri (9am - 6pm)</p>
            <p className="text-xs font-semibold text-emerald-600 pt-1">+1 (800) 123-4567</p>
          </div>
        </div>
      </div>

      {/* Main Grid: FAQs & Ticket Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: FAQ Accordion (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-emerald-600" />
            <h3 className="text-sm font-bold text-neutral-900">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white border border-neutral-100 rounded-2xl shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-semibold text-neutral-800 hover:text-emerald-600 transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-neutral-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-emerald-600" : ""
                    }`} 
                  />
                </button>
                
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-0 text-xs text-neutral-500 leading-relaxed border-t border-neutral-50 animate-in fade-in duration-200">
                    <p className="pt-3">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Ticket Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <Send size={18} className="text-emerald-600" />
            <h3 className="text-sm font-bold text-neutral-900">Send us a message</h3>
          </div>

          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-xs">
            {!isSubmitted ? (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-neutral-500 uppercase mb-1.5">
                    Topic / Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                  >
                    <option value="General Query">General Query</option>
                    <option value="Orders & Shipping">Orders & Shipping</option>
                    <option value="Payments & Billing">Payments & Billing</option>
                    <option value="Account Settings">Account Settings</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-neutral-500 uppercase mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of issue"
                    required
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-neutral-500 uppercase mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how we can help you..."
                    required
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3 rounded-xl font-medium text-xs shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  Submit Ticket
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-neutral-800">Ticket Submitted!</p>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Thank you! We'll reply to <span className="font-semibold text-neutral-800">{currentUser?.email || "your email"}</span> within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-2.5 rounded-xl text-xs font-semibold transition-colors mt-2"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};