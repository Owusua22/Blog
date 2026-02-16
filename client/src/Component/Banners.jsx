import React from "react"
import { Link } from "react-router-dom"
import { ChevronRight, BookOpen, Mic, Book, BookPlusIcon, BookOpenIcon, BookTemplateIcon, BookCheck } from "lucide-react"

const Hero = () => {
  return (
    <section className="relative w-full min-h-[50vh] bg-[#0B1D3A] flex items-center overflow-hidden">
      {/* ===== BACKGROUND ELEMENTS ===== */}

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071222] via-[#0B1D3A] to-[#1B3A5C]"></div>

      {/* Dot Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C5A34E 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      ></div>

      {/* Decorative Circles */}
      <div className="absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full border border-[#C5A34E]/5 hidden lg:block"></div>
      <div className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full border border-[#C5A34E]/[0.03] hidden lg:block"></div>
      <div className="absolute -left-32 -bottom-32 w-[450px] h-[450px] rounded-full border border-[#C5A34E]/5 hidden lg:block"></div>

      {/* Left Accent Line */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-gradient-to-b from-transparent via-[#C5A34E]/20 to-transparent hidden lg:block"></div>

      {/* Corner Accents */}
      <div className="absolute top-10 right-10 w-24 h-24 border-t border-r border-[#C5A34E]/15 hidden lg:block"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 border-b border-l border-[#C5A34E]/15 hidden lg:block"></div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-4 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ===== LEFT COLUMN — TEXT ===== */}
          <div className="max-w-xl">
            {/* Subtitle Tag */}
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-px bg-gradient-to-r from-[#C5A34E] to-transparent"></span>
              <span className="font-['Inter',sans-serif] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A34E]">
                Former Speaker of Parliament
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-['Cormorant_Garamond',serif] text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
              Hon. Mike
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C5A34E] to-[#E2C96E]">
                Oquaye
              </span>
            </h1>

            {/* Gold Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-[#C5A34E] to-[#E2C96E]"></div>
              <div className="w-2 h-2 rotate-45 border border-[#C5A34E]/50"></div>
            </div>

            {/* Description */}
            <p className="font-['Source_Serif_Pro',serif] text-lg sm:text-xl text-[#BCCCDC] leading-relaxed mb-10">
              A lifetime dedicated to democracy, governance, and the
              progress of the Republic of Ghana. Sharing insights on
              parliamentary affairs, leadership, and nation building.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-4 md:mb-1">
              <Link
                to="/articles"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-[11px] sm:text-[12px] font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm hover:from-[#D4B555] hover:to-[#E2C96E] shadow-[0_4px_14px_rgba(197,163,78,0.3)] hover:shadow-[0_6px_20px_rgba(197,163,78,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" />
                Read Articles
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                to="/publications"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-transparent border border-[#C5A34E]/40 text-[#C5A34E] text-[11px] sm:text-[12px] font-['Inter',sans-serif] font-semibold uppercase tracking-[0.15em] rounded-sm hover:bg-[#C5A34E]/10 hover:border-[#C5A34E] transition-all duration-300"
              >
                <BookCheck className="w-4 h-4" />
                View Publications
              </Link>
            </div>

         
          </div>

          {/* ===== RIGHT COLUMN — VISUAL ===== */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Outer Ring */}
            <div className="absolute w-[420px] h-[420px] rounded-full border border-[#C5A34E]/10 animate-[spin_60s_linear_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#C5A34E]/30"></div>
            </div>

            {/* Inner Ring */}
            <div className="absolute w-[340px] h-[340px] rounded-full border border-[#1B3A5C]"></div>

            {/* Monogram Circle */}
            <div className="relative w-72 h-72 rounded-full bg-gradient-to-br from-[#1B3A5C] to-[#0B1D3A] border border-[#C5A34E]/20 flex items-center justify-center shadow-[0_0_80px_rgba(197,163,78,0.1)]">
              {/* Inner Glow */}
              <div className="absolute inset-4 rounded-full border border-[#C5A34E]/10"></div>

              {/* Monogram */}
              <div className="text-center">
                <span className="font-['Cormorant_Garamond',serif] text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#C5A34E] to-[#E2C96E]">
                  MO
                </span>
                <div className="w-12 h-px bg-[#C5A34E]/30 mx-auto mt-2"></div>
                <p className="font-['Inter',sans-serif] text-[8px] uppercase tracking-[0.35em] text-[#627D98] mt-3">
                  Speaker of Parliament
                </p>
                <p className="font-['Cormorant_Garamond',serif] text-lg text-[#C5A34E]/60 mt-1">
                2017-2021
                </p>
              </div>
            </div>

       

            {/* Bottom Left Card */}
            <div className="absolute -bottom-4 left-0 bg-[#1B3A5C]/80 backdrop-blur-sm border border-[#334E68] rounded-sm px-5 py-3.5 shadow-lg">
              <p className="font-['Inter',sans-serif] text-[9px] uppercase tracking-[0.2em] text-[#627D98] mb-1">
                Nation
              </p>
              <p className="font-['Cormorant_Garamond',serif] text-sm font-semibold text-white">
                Republic of Ghana 🇬🇭
              </p>
            </div>

          </div>
        </div>
      </div>

     

   
    </section>
  )
}

export default Hero