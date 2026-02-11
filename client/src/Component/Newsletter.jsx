import React, { useState } from "react"
import { Send, CheckCircle, AlertCircle } from "lucide-react"

const Newsletter = () => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setStatus("error")
      setMessage("Please enter your email address.")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error")
      setMessage("Please enter a valid email address.")
      return
    }

    setStatus("loading")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStatus("success")
      setMessage("Thank you for subscribing!")
      setEmail("")
      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 5000)
    } catch {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  return (
    <section className="relative bg-[#0B1D3A] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#071222] via-[#0B1D3A] to-[#1B3A5C]"></div>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C5A34E 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      ></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left — Text */}
          <div className="text-center lg:text-left lg:max-w-md flex-shrink-0">
            <div className="flex items-center gap-3 mb-3 justify-center lg:justify-start">
              <span className="w-8 h-px bg-[#C5A34E]"></span>
              <span className="font-['Inter',sans-serif] text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A34E]">
                Stay Informed
              </span>
            </div>

            <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-white leading-tight">
              Subscribe to the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A34E] to-[#E2C96E]">
                Newsletter
              </span>
            </h2>

            <p className="font-['Source_Serif_Pro',serif] text-sm text-[#9FB3C8] mt-2 hidden sm:block">
              Get the latest articles and insights delivered to your inbox.
            </p>
          </div>

          {/* Right — Form */}
          <div className="w-full lg:max-w-xl">
            {status === "success" ? (
              <div className="flex items-center gap-3 bg-[#1B3A5C]/50 border border-[#C5A34E]/20 rounded-sm px-5 py-4">
                <div className="w-10 h-10 rounded-full bg-[#C5A34E]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#C5A34E]" />
                </div>
                <div>
                  <p className="font-['Cormorant_Garamond',serif] text-base font-bold text-white">
                    Successfully Subscribed!
                  </p>
                  <p className="font-['Inter',sans-serif] text-[11px] text-[#9FB3C8]">
                    {message}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (status === "error") {
                          setStatus("idle")
                          setMessage("")
                        }
                      }}
                      placeholder="Enter your email address"
                      disabled={status === "loading"}
                      className={`w-full px-4 py-3.5 bg-[#1B3A5C]/50 backdrop-blur-sm border rounded-sm font-['Inter',sans-serif] text-sm text-white placeholder-[#627D98] focus:outline-none focus:border-[#C5A34E] focus:ring-1 focus:ring-[#C5A34E]/30 transition-all duration-300 ${
                        status === "error"
                          ? "border-red-400/50"
                          : "border-[#334E68]"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-6 py-3.5 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-[11px] font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm hover:from-[#D4B555] hover:to-[#E2C96E] shadow-[0_4px_14px_rgba(197,163,78,0.3)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:w-auto w-full flex-shrink-0"
                  >
                    {status === "loading" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#0B1D3A]/30 border-t-[#0B1D3A] rounded-full animate-spin"></div>
                        Subscribing
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Subscribe
                      </>
                    )}
                  </button>
                </div>

                {/* Error */}
                {status === "error" && (
                  <div className="flex items-center gap-2 mt-2 text-red-400">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="font-['Inter',sans-serif] text-[11px]">
                      {message}
                    </span>
                  </div>
                )}

              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Gold Line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A34E]/20 to-transparent"></div>
    </section>
  )
}

export default Newsletter