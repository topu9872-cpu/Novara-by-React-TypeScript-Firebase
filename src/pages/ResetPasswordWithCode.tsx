import React, { useState, useRef, useEffect } from "react";
import { sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { KeyRound, Mail, ShieldCheck, ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import gsap from "gsap";

interface Props {
  onBackToLogin?: () => void;
}

export const ResetPasswordWithCode: React.FC<Props> = ({ onBackToLogin }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [email, setEmail] = useState("");
  
  // 6-digit code array state
  const [codeArr, setCodeArr] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setVerifiedEmail] = useState("");

  // GSAP Content Ref for smooth staggered transitions
  const contentRef = useRef<HTMLDivElement>(null);

  // Smooth staggered GSAP animation on step change
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: "power2.out" }
      );
    }
  }, [step]);

  const handleBack = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate("/login");
    }
  };

  // Handle 6-digit code changes and auto-focus next
  const handleCodeChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newCodeArr = [...codeArr];
    newCodeArr[index] = value.substring(value.length - 1);
    setCodeArr(newCodeArr);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !codeArr[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (pastedData.length === 6 && !isNaN(Number(pastedData))) {
      const digits = pastedData.split("");
      setCodeArr(digits);
      inputRefs.current[5]?.focus();
    }
  };

  // Step 1: Send the reset email trigger
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Please enter your email address.");

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setStep("code");
      toast.success("Verification code sent to your email!");
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to send code. Please check the email address.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code and set new password
  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = codeArr.join("");
    
    if (fullCode.length < 6 || !newPassword.trim()) {
      return toast.error("Please enter all 6 digits and your new password.");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    try {
      setLoading(true);
      
      const emailVal = await verifyPasswordResetCode(auth, fullCode);
      setVerifiedEmail(emailVal);

      await confirmPasswordReset(auth, fullCode, newPassword);

      setStep("success");
      toast.success("Password updated successfully!");
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/invalid-action-code") {
        toast.error("Invalid or expired verification code.");
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50">
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-xl max-w-md w-full relative">
        
        {/* Animated Inner Container */}
        <div ref={contentRef} className="space-y-6">

          {/* Back Button */}
          {step !== "success" && (
            <button
              onClick={() => {
                if (step === "code") setStep("email");
                else handleBack();
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <ArrowLeft size={15} />
              <span>{step === "code" ? "Back to email" : "Back to login"}</span>
            </button>
          )}

          {/* STEP 1: Enter Email */}
          {step === "email" && (
            <>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <KeyRound size={22} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Forgot Password?</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Enter your email address and we'll send you a verification code to reset your password.
                </p>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3 rounded-xl font-medium text-xs shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2 cursor-pointer"
                >
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  Send Verification Code
                </button>
              </form>
            </>
          )}

          {/* STEP 2: Input 6-Digit Code & New Password */}
          {step === "code" && (
            <>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Enter Verification Code</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  We sent a 6-digit code to <span className="font-semibold text-neutral-800">{email}</span>.
                </p>
              </div>

              <form onSubmit={handleVerifyAndReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase mb-2 text-center">
                    Enter 6-Digit Code
                  </label>
                  <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleCodePaste}>
                    {codeArr.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(e.target.value, idx)}
                        onKeyDown={(e) => handleCodeKeyDown(e, idx)}
                        className="w-11 h-12 text-center bg-neutral-50 border border-neutral-200 rounded-xl text-base font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      className="w-full pl-4 pr-10 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3 rounded-xl font-medium text-xs shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2 cursor-pointer"
                >
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  Reset Password
                </button>
              </form>
            </>
          )}

          {/* STEP 3: Success Screen */}
          {step === "success" && (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-neutral-800">Password Reset Complete!</p>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Your password has been successfully updated. You can now log in with your new credentials.
                </p>
              </div>
              <button
                onClick={handleBack}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-semibold shadow-sm transition-colors mt-2 cursor-pointer"
              >
                Proceed to Login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};