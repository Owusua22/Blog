import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { adminLogin } from "../../redux/slice/userSlice"
import { useNavigate, Link } from "react-router-dom"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  LogIn,
} from "lucide-react"

const AdminLoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { admin, loading, error } = useSelector((state) => state.user)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (admin) {
      navigate("/admin")
    }
  }, [admin, navigate])

  const validate = () => {
    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const result = await dispatch(
      adminLogin({ email: formData.email, password: formData.password })
    )

    if (result.meta.requestStatus === "fulfilled") {
      setFormData({ email: "", password: "" })
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1D3A] flex relative overflow-hidden">
      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071222] via-[#0B1D3A] to-[#1B3A5C]"></div>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C5A34E 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      ></div>

      {/* Decorative Elements */}
      <div className="absolute -left-40 -top-40 w-[500px] h-[500px] rounded-full border border-[#C5A34E]/5 hidden lg:block"></div>
      <div className="absolute -right-40 -bottom-40 w-[600px] h-[600px] rounded-full border border-[#C5A34E]/[0.03] hidden lg:block"></div>
      <div className="absolute top-8 right-8 w-20 h-20 border-t border-r border-[#C5A34E]/10 hidden lg:block"></div>
      <div className="absolute bottom-8 left-8 w-20 h-20 border-b border-l border-[#C5A34E]/10 hidden lg:block"></div>

      {/* ===== LEFT PANEL (Desktop) ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center px-12">
        <div className="relative max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A34E] to-[#E2C96E] flex items-center justify-center shadow-[0_4px_14px_rgba(197,163,78,0.3)]">
              <span className="text-[#0B1D3A] font-bold text-lg font-['Cormorant_Garamond',serif]">
                MO
              </span>
            </div>
            <div>
              <span className="text-white text-xl font-bold font-['Cormorant_Garamond',serif] leading-tight group-hover:text-[#C5A34E] transition-colors duration-300 block">
                Hon. Mike Oquaye
              </span>
              <span className="text-[#627D98] text-[9px] font-['Inter',sans-serif] uppercase tracking-[0.2em]">
                Admin Portal
              </span>
            </div>
          </Link>

          {/* Heading */}
          <h1 className="font-['Cormorant_Garamond',serif] text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Welcome back to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C5A34E] to-[#E2C96E]">
              Admin Portal
            </span>
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[2px] bg-gradient-to-r from-[#C5A34E] to-transparent"></div>
            <div className="w-1.5 h-1.5 rotate-45 border border-[#C5A34E]/40"></div>
          </div>

          <p className="font-['Source_Serif_Pro',serif] text-base text-[#9FB3C8] leading-relaxed mb-10">
            Sign in to your admin account to manage articles,
            publications, and content on the official website of
            Hon. Mike Oquaye.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              "Manage articles & publications",
              "Upload media & banners",
              "Edit biography & content",
              "Full admin dashboard access",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#C5A34E]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-[#C5A34E]" />
                </div>
                <span className="font-['Inter',sans-serif] text-sm text-[#829AB1]">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL — FORM ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-12 relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A34E] to-[#E2C96E] flex items-center justify-center">
                <span className="text-[#0B1D3A] font-bold text-sm font-['Cormorant_Garamond',serif]">
                  MO
                </span>
              </div>
              <span className="text-white text-lg font-bold font-['Cormorant_Garamond',serif] group-hover:text-[#C5A34E] transition-colors duration-300">
                Hon. Mike Oquaye
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-sm p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-[#C5A34E]/10 border border-[#C5A34E]/20 flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-6 h-6 text-[#C5A34E]" />
              </div>

              <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="font-['Inter',sans-serif] text-sm text-[#627D98]">
                Sign in to your admin account
              </p>
            </div>

            {/* ===== FORM ===== */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Server Error */}
              {error && (
                <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-sm flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="font-['Inter',sans-serif] text-xs text-red-400">
                    {error.message || error}
                  </p>
                </div>
              )}

              {/* Email */}
              <div className="mb-4">
                <label className="block font-['Inter',sans-serif] text-[10px] font-semibold uppercase tracking-[0.15em] text-[#627D98] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#627D98]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@mikeoquaye.com"
                    className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border rounded-sm font-['Inter',sans-serif] text-sm text-white placeholder-[#486581] focus:outline-none focus:ring-1 transition-all duration-300 ${
                      errors.email
                        ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/30"
                        : "border-white/10 focus:border-[#C5A34E] focus:ring-[#C5A34E]/30"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-red-400">
                    <AlertCircle className="w-3 h-3" />
                    <span className="font-['Inter',sans-serif] text-[11px]">
                      {errors.email}
                    </span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block font-['Inter',sans-serif] text-[10px] font-semibold uppercase tracking-[0.15em] text-[#627D98] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#627D98]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full pl-11 pr-12 py-3.5 bg-white/5 border rounded-sm font-['Inter',sans-serif] text-sm text-white placeholder-[#486581] focus:outline-none focus:ring-1 transition-all duration-300 ${
                      errors.password
                        ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/30"
                        : "border-white/10 focus:border-[#C5A34E] focus:ring-[#C5A34E]/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#627D98] hover:text-[#C5A34E] transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-red-400">
                    <AlertCircle className="w-3 h-3" />
                    <span className="font-['Inter',sans-serif] text-[11px]">
                      {errors.password}
                    </span>
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-[11px] font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm hover:from-[#D4B555] hover:to-[#E2C96E] shadow-[0_4px_14px_rgba(197,163,78,0.3)] hover:shadow-[0_6px_20px_rgba(197,163,78,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0B1D3A]/30 border-t-[#0B1D3A] rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="font-['Inter',sans-serif] text-[10px] text-[#627D98] uppercase tracking-[0.15em]">
                  or
                </span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Register Link */}
              <Link
                to="/admin/register"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 text-white text-[11px] font-['Inter',sans-serif] font-semibold uppercase tracking-[0.15em] rounded-sm hover:bg-white/10 hover:border-[#C5A34E]/30 transition-all duration-300"
              >
                Don't have an account? Sign Up
              </Link>
            </form>
          </div>

          {/* Back to Site */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="font-['Inter',sans-serif] text-[11px] text-[#627D98] hover:text-[#C5A34E] transition-colors duration-300 uppercase tracking-[0.1em]"
            >
              ← Back to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage