// components/admin/AccessCodeGate.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Lock,
  AlertCircle,
  ArrowRight,
  KeyRound,
} from "lucide-react";

const AccessCodeGate = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  // If already verified, redirect to login
  useEffect(() => {
    const accessGranted =
      sessionStorage.getItem("adminAccessGranted") === "true";
    const accessTime = parseInt(
      sessionStorage.getItem("adminAccessTime") || "0",
      10
    );
    const EXPIRY = 24 * 60 * 60 * 1000;

    if (accessGranted && Date.now() - accessTime < EXPIRY) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      setError("Please enter the access code");
      triggerShake();
      return;
    }

    setLoading(true);
    setError("");

    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Compare against env variable
    const ADMIN_CODE = import.meta.env.VITE_ADMIN_ACCESS_CODE;

    if (code.trim() === ADMIN_CODE) {
      sessionStorage.setItem("adminAccessGranted", "true");
      sessionStorage.setItem("adminAccessTime", Date.now().toString());
      navigate("/admin/login");
    } else {
      setError("Invalid access code. Access denied.");
      setCode("");
      triggerShake();
      inputRef.current?.focus();
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B1D3A] flex relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071222] via-[#0B1D3A] to-[#1B3A5C]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #C5A34E 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative */}
      <div className="absolute -left-40 -top-40 w-[500px] h-[500px] rounded-full border border-[#C5A34E]/5 hidden lg:block" />
      <div className="absolute -right-40 -bottom-40 w-[600px] h-[600px] rounded-full border border-[#C5A34E]/[0.03] hidden lg:block" />
      <div className="absolute top-8 right-8 w-20 h-20 border-t border-r border-[#C5A34E]/10 hidden lg:block" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-b border-l border-[#C5A34E]/10 hidden lg:block" />

      {/* Content */}
      <div className="w-full flex items-center justify-center px-4 py-12 relative">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A34E] to-[#E2C96E] flex items-center justify-center shadow-[0_4px_14px_rgba(197,163,78,0.3)]">
                <span className="text-[#0B1D3A] font-bold text-lg font-['Cormorant_Garamond',serif]">
                  MO
                </span>
              </div>
            </div>
          </div>

          {/* Card */}
          <div
            className={`bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-sm p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] ${
              shake ? "animate-shake" : ""
            }`}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[#C5A34E]/10 border border-[#C5A34E]/20 flex items-center justify-center mx-auto mb-4 relative">
                <Shield className="w-7 h-7 text-[#C5A34E]" />
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0B1D3A] border border-[#C5A34E]/30 flex items-center justify-center">
                  <Lock className="w-2.5 h-2.5 text-[#C5A34E]" />
                </div>
              </div>

              <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-white mb-2">
                Restricted Area
              </h2>
              <p className="font-['Inter',sans-serif] text-sm text-[#627D98]">
                Enter the admin access code to continue
              </p>
            </div>

            {/* Warning */}
            <div className="mb-6 p-3 bg-[#C5A34E]/5 border border-[#C5A34E]/10 rounded-sm flex items-start gap-3">
              <Shield className="w-4 h-4 text-[#C5A34E] flex-shrink-0 mt-0.5" />
              <p className="font-['Inter',sans-serif] text-[11px] text-[#829AB1] leading-relaxed">
                This area is restricted to authorized administrators only.
                Unauthorized access attempts will be logged.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-sm flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="font-['Inter',sans-serif] text-xs text-red-400">
                    {error}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <label className="block font-['Inter',sans-serif] text-[10px] font-semibold uppercase tracking-[0.15em] text-[#627D98] mb-2">
                  Access Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#627D98]" />
                  <input
                    ref={inputRef}
                    type="password"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter access code"
                    className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border rounded-sm font-['Inter',sans-serif] text-sm text-white placeholder-[#486581] focus:outline-none focus:ring-1 transition-all duration-300 tracking-widest ${
                      error
                        ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/30"
                        : "border-white/10 focus:border-[#C5A34E] focus:ring-[#C5A34E]/30"
                    }`}
                    autoComplete="off"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-[11px] font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm hover:from-[#D4B555] hover:to-[#E2C96E] shadow-[0_4px_14px_rgba(197,163,78,0.3)] hover:shadow-[0_6px_20px_rgba(197,163,78,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0B1D3A]/30 border-t-[#0B1D3A] rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Verify Access
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Back */}
          <div className="text-center mt-6">
            <a
              href="/"
              className="font-['Inter',sans-serif] text-[11px] text-[#627D98] hover:text-[#C5A34E] transition-colors duration-300 uppercase tracking-[0.1em]"
            >
              ← Back to Website
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AccessCodeGate;