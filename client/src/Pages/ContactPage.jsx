import React, { useState, useRef } from "react"
import { Link } from "react-router-dom"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User,
  FileText,
  Globe,
  ArrowRight,
  Facebook,
  Linkedin,
} from "lucide-react"
import Navbar from "../Component/Navbar"
import Footer from "../Component/Footer"

const ContactPage = () => {
  const formRef = useRef(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
  })

  const [formStatus, setFormStatus] = useState("idle") // idle | loading | success | error
  const [formMessage, setFormMessage] = useState("")
  const [errors, setErrors] = useState({})

  // Categories for inquiries
  const categories = [
    { value: "", label: "Select a category" },
    { value: "general", label: "General Inquiry" },
    { value: "speaking", label: "Speaking Engagement" },
    { value: "media", label: "Media & Press" },
    { value: "academic", label: "Academic Collaboration" },
    { value: "political", label: "Political Affairs" },
    { value: "other", label: "Other" },
  ]

  // Contact info
  const contactInfo = [
    {
      icon: MapPin,
      title: "Office Address",
      lines: ["Parliament House", "Accra, Ghana"],
      accent: true,
    },
    {
      icon: Phone,
      title: "Phone",
      lines: ["+233 (0) 30 000 0000", "+233 (0) 24 000 0000"],
      link: "tel:+233300000000",
    },
    {
      icon: Mail,
      title: "Email",
      lines: ["contact@mikeoquaye.com", "info@mikeoquaye.com"],
      link: "mailto:contact@mikeoquaye.com",
    },
    {
      icon: Clock,
      title: "Office Hours",
      lines: ["Monday – Friday", "9:00 AM – 5:00 PM GMT"],
    },
  ]

  // Social links
  const socialLinks = [
    {
      name: "Facebook",
      url: "#",
      icon: Facebook,
    },
    {
      name: "Twitter / X",
      url: "#",
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "#",
      icon: Linkedin,
    },
    {
      name: "YouTube",
      url: "#",
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
          <polygon points="9.545,15.568 15.818,12 9.545,8.432" fill="#0B1D3A" />
        </svg>
      ),
    },
  ]

  // FAQ items
  const faqItems = [
    {
      question: "How can I invite Hon. Mike Oquaye for a speaking engagement?",
      answer:
        "Please fill out the contact form with 'Speaking Engagement' as the category, including the event details, date, and location. Our team will review and respond within 48 hours.",
    },
    {
      question: "How can I access published works and research papers?",
      answer:
        "Visit our Publications page to view and download available works. For specific academic papers, please contact us directly.",
    },
    {
      question: "Is Hon. Mike Oquaye available for media interviews?",
      answer:
        "For media inquiries, please select 'Media & Press' in the contact form or email us directly. Include your media outlet, topic, and preferred timeline.",
    },
    {
      question: "How can I stay updated on new articles and speeches?",
      answer:
        "Subscribe to our newsletter at the bottom of the homepage to receive updates directly in your inbox.",
    },
  ]

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required"
    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to first error
      const firstError = formRef.current?.querySelector(".border-red-400")
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    setFormStatus("loading")

    try {
      // Replace with your actual API call
      // await axios.post("/api/contact", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setFormStatus("success")
      setFormMessage(
        "Your message has been sent successfully! We'll get back to you within 48 hours."
      )
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "",
        message: "",
      })

      // Reset after 8 seconds
      setTimeout(() => {
        setFormStatus("idle")
        setFormMessage("")
      }, 8000)
    } catch (err) {
      setFormStatus("error")
      setFormMessage(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      )
    }
  }

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen bg-[#F4F1EB]">
      <Navbar />

      {/* ===== PAGE HEADER ===== */}
      <section className="relative bg-[#0B1D3A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#071222] via-[#0B1D3A] to-[#1B3A5C]"></div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #C5A34E 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        ></div>

        <div className="absolute top-8 right-8 w-20 h-20 border-t border-r border-[#C5A34E]/15 hidden lg:block"></div>
        <div className="absolute bottom-8 left-8 w-20 h-20 border-b border-l border-[#C5A34E]/15 hidden lg:block"></div>

     <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 md:py-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <Link
                to="/"
                className="font-['Inter',sans-serif] text-[11px] uppercase tracking-[0.15em] text-[#627D98] hover:text-[#C5A34E] transition-colors duration-300"
              >
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-[#334E68]" />
              <span className="font-['Inter',sans-serif] text-[11px] uppercase tracking-[0.15em] text-[#C5A34E]">
                Contact
              </span>
            </div>

            <div className="w-16 h-16 rounded-full bg-[#1B3A5C] border border-[#334E68] flex items-center justify-center mx-auto mb-8">
              <MessageSquare className="w-7 h-7 text-[#C5A34E]" />
            </div>

            <h1 className="font-['Cormorant_Garamond',serif] text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Get in Touch
            </h1>

            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent mx-auto mb-6"></div>

            <p className="font-['Source_Serif_Pro',serif] text-base sm:text-lg text-[#9FB3C8] max-w-xl mx-auto">
              For inquiries, speaking engagements, media requests, or
              any other correspondence.
            </p>
          </div>
        </div>

        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent opacity-40"></div>
      </section>

      {/* ===== CONTACT CARDS ===== */}
      <section className="relative -mt-10 sm:-mt-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group bg-white rounded-sm p-5 sm:p-6 shadow-[0_4px_20px_rgba(11,29,58,0.1)] hover:shadow-[0_10px_40px_rgba(11,29,58,0.15)] transition-all duration-500 hover:-translate-y-1 border-t-2 border-transparent hover:border-[#C5A34E]"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-[#0B1D3A] flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-[#C5A34E] group-hover:to-[#D4B555] transition-all duration-500">
                  <info.icon className="w-5 h-5 text-[#C5A34E] group-hover:text-[#0B1D3A] transition-colors duration-500" />
                </div>

                {/* Title */}
                <h3 className="font-['Cormorant_Garamond',serif] text-lg font-bold text-[#0B1D3A] mb-2">
                  {info.title}
                </h3>

                {/* Lines */}
                {info.lines.map((line, i) =>
                  info.link ? (
                    <a
                      key={i}
                      href={i === 0 ? info.link : undefined}
                      className="block font-['Inter',sans-serif] text-sm text-[#627D98] hover:text-[#C5A34E] transition-colors duration-300 leading-relaxed"
                    >
                      {line}
                    </a>
                  ) : (
                    <p
                      key={i}
                      className="font-['Inter',sans-serif] text-sm text-[#627D98] leading-relaxed"
                    >
                      {line}
                    </p>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT — FORM + MAP ===== */}
      <section className="relative py-8  md:py-14">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C5A34E]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 hidden lg:block"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* ===== LEFT — CONTACT FORM ===== */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-sm shadow-[0_1px_3px_rgba(11,29,58,0.08)] p-6 sm:p-8 md:p-10">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-px bg-[#C5A34E]"></span>
                    <span className="font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A34E]">
                      Send a Message
                    </span>
                  </div>
                  <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-[#0B1D3A] mb-2">
                    We'd Love to Hear
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A34E] to-[#A88A3D]">
                      {" "}
                      From You
                    </span>
                  </h2>
                  <p className="font-['Source_Serif_Pro',serif] text-sm text-[#627D98]">
                    Fill out the form below and we'll respond within 48 hours.
                  </p>
                </div>

                {/* ===== SUCCESS STATE ===== */}
                {formStatus === "success" ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6 animate-bounce">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#0B1D3A] mb-3">
                      Message Sent!
                    </h3>
                    <p className="font-['Source_Serif_Pro',serif] text-base text-[#627D98] max-w-md mx-auto">
                      {formMessage}
                    </p>
                    <button
                      onClick={() => {
                        setFormStatus("idle")
                        setFormMessage("")
                      }}
                      className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#0B1D3A] text-white text-[11px] font-['Inter',sans-serif] font-semibold uppercase tracking-[0.15em] rounded-sm hover:bg-[#1B3A5C] transition-all duration-300"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  /* ===== CONTACT FORM ===== */
                  <form ref={formRef} onSubmit={handleSubmit} noValidate>
                    <div className="grid sm:grid-cols-2 gap-5 mb-5">
                      {/* Name */}
                      <div>
                        <label className="block font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#334E68] mb-2">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#829AB1]" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className={`w-full pl-11 pr-4 py-3.5 bg-[#F4F1EB] border rounded-sm font-['Inter',sans-serif] text-sm text-[#0B1D3A] placeholder-[#829AB1] focus:outline-none focus:ring-1 transition-all duration-300 ${
                              errors.name
                                ? "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                                : "border-[#D4CFC7] focus:border-[#C5A34E] focus:ring-[#C5A34E]/30"
                            }`}
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-red-500">
                            <AlertCircle className="w-3 h-3" />
                            <span className="font-['Inter',sans-serif] text-[11px]">
                              {errors.name}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#334E68] mb-2">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#829AB1]" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className={`w-full pl-11 pr-4 py-3.5 bg-[#F4F1EB] border rounded-sm font-['Inter',sans-serif] text-sm text-[#0B1D3A] placeholder-[#829AB1] focus:outline-none focus:ring-1 transition-all duration-300 ${
                              errors.email
                                ? "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                                : "border-[#D4CFC7] focus:border-[#C5A34E] focus:ring-[#C5A34E]/30"
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-red-500">
                            <AlertCircle className="w-3 h-3" />
                            <span className="font-['Inter',sans-serif] text-[11px]">
                              {errors.email}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#334E68] mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#829AB1]" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+233 00 000 0000"
                            className="w-full pl-11 pr-4 py-3.5 bg-[#F4F1EB] border border-[#D4CFC7] rounded-sm font-['Inter',sans-serif] text-sm text-[#0B1D3A] placeholder-[#829AB1] focus:outline-none focus:border-[#C5A34E] focus:ring-1 focus:ring-[#C5A34E]/30 transition-all duration-300"
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#334E68] mb-2">
                          Category
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#829AB1] pointer-events-none" />
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3.5 bg-[#F4F1EB] border border-[#D4CFC7] rounded-sm font-['Inter',sans-serif] text-sm text-[#0B1D3A] focus:outline-none focus:border-[#C5A34E] focus:ring-1 focus:ring-[#C5A34E]/30 transition-all duration-300 appearance-none cursor-pointer"
                          >
                            {categories.map((cat) => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="mb-5">
                      <label className="block font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#334E68] mb-2">
                        Subject <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What is this regarding?"
                        className={`w-full px-4 py-3.5 bg-[#F4F1EB] border rounded-sm font-['Inter',sans-serif] text-sm text-[#0B1D3A] placeholder-[#829AB1] focus:outline-none focus:ring-1 transition-all duration-300 ${
                          errors.subject
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                            : "border-[#D4CFC7] focus:border-[#C5A34E] focus:ring-[#C5A34E]/30"
                        }`}
                      />
                      {errors.subject && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-red-500">
                          <AlertCircle className="w-3 h-3" />
                          <span className="font-['Inter',sans-serif] text-[11px]">
                            {errors.subject}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                      <label className="block font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#334E68] mb-2">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                        rows={6}
                        className={`w-full px-4 py-3.5 bg-[#F4F1EB] border rounded-sm font-['Inter',sans-serif] text-sm text-[#0B1D3A] placeholder-[#829AB1] focus:outline-none focus:ring-1 transition-all duration-300 resize-none ${
                          errors.message
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                            : "border-[#D4CFC7] focus:border-[#C5A34E] focus:ring-[#C5A34E]/30"
                        }`}
                      ></textarea>
                      <div className="flex items-center justify-between mt-1.5">
                        {errors.message ? (
                          <p className="flex items-center gap-1.5 text-red-500">
                            <AlertCircle className="w-3 h-3" />
                            <span className="font-['Inter',sans-serif] text-[11px]">
                              {errors.message}
                            </span>
                          </p>
                        ) : (
                          <span></span>
                        )}
                        <span className="font-['Inter',sans-serif] text-[10px] text-[#829AB1]">
                          {formData.message.length} / 2000
                        </span>
                      </div>
                    </div>

                    {/* Error Message */}
                    {formStatus === "error" && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="font-['Inter',sans-serif] text-sm text-red-600">
                          {formMessage}
                        </p>
                      </div>
                    )}

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <button
                        type="submit"
                        disabled={formStatus === "loading"}
                        className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-[11px] font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm hover:from-[#D4B555] hover:to-[#E2C96E] shadow-[0_4px_14px_rgba(197,163,78,0.3)] hover:shadow-[0_6px_20px_rgba(197,163,78,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      >
                        {formStatus === "loading" ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#0B1D3A]/30 border-t-[#0B1D3A] rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </button>

                      <p className="font-['Inter',sans-serif] text-[10px] text-[#829AB1]">
                        <span className="text-red-400">*</span> Required fields
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* ===== RIGHT — SIDEBAR ===== */}
            <div className="lg:col-span-2 space-y-6">
              {/* ===== MAP / LOCATION ===== */}
              <div className="bg-white rounded-sm shadow-[0_1px_3px_rgba(11,29,58,0.08)] overflow-hidden">
                {/* Map */}
                <div className="relative h-48 sm:h-56 bg-gradient-to-br from-[#0B1D3A] to-[#1B3A5C] overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.9977977891714!2d-0.18780102538944088!3d5.556023933361682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd7!2sParliament%20House%20of%20Ghana!5e0!3m2!1sen!2sgh!4v1700000000000!5m2!1sen!2sgh"
                    className="w-full h-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location"
                  ></iframe>

                  {/* Map Overlay Pin */}
                  <div className="absolute top-3 left-3 bg-[#0B1D3A]/80 backdrop-blur-sm rounded-sm px-3 py-2 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A34E]" />
                    <span className="font-['Inter',sans-serif] text-[10px] text-white uppercase tracking-[0.1em]">
                      Parliament House
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="p-5">
                  <h4 className="font-['Cormorant_Garamond',serif] text-lg font-bold text-[#0B1D3A] mb-2">
                    Visit Our Office
                  </h4>
                  <p className="font-['Inter',sans-serif] text-sm text-[#627D98] leading-relaxed mb-4">
                    Parliament House, Accra, Ghana
                  </p>
                  <a
                    href="https://maps.google.com/?q=Parliament+House+Ghana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#C5A34E] hover:text-[#A88A3D] transition-colors duration-300"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Get Directions
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              </div>

              {/* ===== SOCIAL LINKS ===== */}
              <div className="bg-white rounded-sm shadow-[0_1px_3px_rgba(11,29,58,0.08)] p-5 sm:p-6">
                <h4 className="font-['Cormorant_Garamond',serif] text-lg font-bold text-[#0B1D3A] mb-4 flex items-center gap-2">
                  <div className="w-6 h-[2px] bg-[#C5A34E]"></div>
                  Connect With Us
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-3 rounded-sm bg-[#F4F1EB] hover:bg-[#0B1D3A] transition-all duration-300"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#0B1D3A] group-hover:bg-[#C5A34E] flex items-center justify-center transition-all duration-300">
                        <social.icon className="w-4 h-4 text-[#C5A34E] group-hover:text-[#0B1D3A] transition-colors duration-300" />
                      </div>
                      <span className="font-['Inter',sans-serif] text-xs font-medium text-[#334E68] group-hover:text-white transition-colors duration-300">
                        {social.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* ===== QUICK RESPONSE NOTE ===== */}
              <div className="bg-gradient-to-br from-[#0B1D3A] to-[#1B3A5C] rounded-sm p-6 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #C5A34E 1px, transparent 0)`,
                    backgroundSize: "20px 20px",
                  }}
                ></div>

                <div className="absolute top-3 right-3 w-8 h-8 border-t border-r border-[#C5A34E]/20"></div>

                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#C5A34E]/10 flex items-center justify-center mb-4">
                    <Clock className="w-5 h-5 text-[#C5A34E]" />
                  </div>
                  <h4 className="font-['Cormorant_Garamond',serif] text-lg font-bold text-white mb-2">
                    Quick Response
                  </h4>
                  <p className="font-['Source_Serif_Pro',serif] text-sm text-[#9FB3C8] leading-relaxed">
                    We aim to respond to all inquiries within
                    <span className="text-[#C5A34E] font-semibold">
                      {" "}
                      48 hours
                    </span>
                    . For urgent matters, please call us directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="relative bg-[#0B1D3A] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #C5A34E 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        ></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20 md:py-28">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="w-10 h-px bg-[#C5A34E]"></span>
              <span className="font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A34E]">
                Common Questions
              </span>
              <span className="w-10 h-px bg-[#C5A34E]"></span>
            </div>

            <h2 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>

            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent mx-auto"></div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3 sm:space-y-4">
            {faqItems.map((faq, index) => (
              <div
                key={index}
                className={`bg-[#1B3A5C]/30 backdrop-blur-sm border rounded-sm overflow-hidden transition-all duration-500 ${
                  openFaq === index
                    ? "border-[#C5A34E]/30"
                    : "border-[#1B3A5C] hover:border-[#334E68]"
                }`}
              >
                {/* Question */}
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="w-full flex items-start sm:items-center justify-between gap-4 p-5 sm:p-6 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 transition-all duration-500 ${
                        openFaq === index
                          ? "bg-[#C5A34E] text-[#0B1D3A]"
                          : "bg-[#0B1D3A] text-[#C5A34E]"
                      }`}
                    >
                      <span className="font-['Inter',sans-serif] text-[10px] font-bold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h4
                      className={`font-['Cormorant_Garamond',serif] text-lg font-semibold transition-colors duration-300 ${
                        openFaq === index ? "text-[#C5A34E]" : "text-white"
                      }`}
                    >
                      {faq.question}
                    </h4>
                  </div>

                  <ChevronRight
                    className={`w-5 h-5 text-[#627D98] flex-shrink-0 transition-transform duration-500 ${
                      openFaq === index ? "rotate-90 text-[#C5A34E]" : ""
                    }`}
                  />
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[68px] sm:pl-[76px]">
                    <div className="w-8 h-px bg-[#C5A34E]/30 mb-4"></div>
                    <p className="font-['Source_Serif_Pro',serif] text-sm sm:text-base text-[#9FB3C8] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More Questions CTA */}
          <div className="text-center mt-10 sm:mt-12">
            <p className="font-['Source_Serif_Pro',serif] text-base text-[#9FB3C8] mb-6">
              Can't find what you're looking for?
            </p>
            <button
              onClick={() => {
                formRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }}
              className="group inline-flex items-center gap-2 px-8 py-4 border border-[#C5A34E]/40 text-[#C5A34E] text-[11px] font-['Inter',sans-serif] font-semibold uppercase tracking-[0.15em] rounded-sm hover:bg-[#C5A34E]/10 hover:border-[#C5A34E] transition-all duration-300"
            >
              <MessageSquare className="w-4 h-4" />
              Send Us a Message
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ContactPage