import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import honImage from "../assets/hon.jpg"

const AboutStrip = () => {
  return (
    <section className="relative bg-[#F4F1EB] overflow-hidden">
      {/* Top Gold Line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0">
              {/* Background Accent Frame */}
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#C5A34E]/20 rounded-sm"></div>

              {/* Main Image */}
              <div className="relative w-full h-full rounded-sm overflow-hidden shadow-[0_20px_60px_rgba(11,29,58,0.3)]">
                <img
                  src={honImage}
                  alt="Hon. Professor Aaron Mike Oquaye - Former Speaker of Parliament, Republic of Ghana"
                  className="w-full h-full object-cover object-top"
                />

                {/* Subtle Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A]/40 via-transparent to-transparent"></div>

                {/* Bottom Name Tag */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0B1D3A]/80 to-transparent">
                  <p className="font-['Cormorant_Garamond',serif] text-xl font-bold text-white">
                    Hon. Mike Oquaye
                  </p>
                  <p className="font-['Inter',sans-serif] text-[9px] uppercase tracking-[0.25em] text-[#C5A34E] mt-1">
                    Former Speaker of Parliament
                  </p>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-4 right-4 w-10 h-10 border-t border-r border-[#C5A34E]/30"></div>
                <div className="absolute bottom-4 left-4 w-10 h-10 border-b border-l border-[#C5A34E]/30"></div>
              </div>

              {/* Experience Badge */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-[#C5A34E] to-[#D4B555] rounded-sm px-6 py-4 shadow-[0_8px_30px_rgba(197,163,78,0.3)] z-10">
                <p className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#0B1D3A]">
                  30+
                </p>
                <p className="font-['Inter',sans-serif] text-[9px] uppercase tracking-[0.2em] text-[#0B1D3A]/70">
                  Years of Service
                </p>
              </div>

              {/* Side Accent */}
              <div className="absolute -left-8 top-1/4 bottom-1/4 w-[2px] bg-gradient-to-b from-transparent via-[#C5A34E]/30 to-transparent hidden lg:block"></div>
            </div>
          </div>

          {/* Right — Text Content */}
          <div>
            {/* Section Label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-px bg-[#C5A34E]"></span>
              <span className="font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A34E]">
                About
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1D3A] leading-tight mb-6">
              A Legacy of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C5A34E] to-[#A88A3D]">
                Public Service
              </span>
            </h2>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-[2px] bg-gradient-to-r from-[#C5A34E] to-transparent"></div>
              <div className="w-1.5 h-1.5 rotate-45 border border-[#C5A34E]/40"></div>
            </div>

            {/* Description */}
            <p className="font-['Source_Serif_Pro',serif] text-lg text-[#486581] leading-relaxed mb-6">
              Hon. Professor Aaron Mike Oquaye is a distinguished
              statesman, legal luminary, and scholar who has dedicated
              over three decades to the service of Ghana's democracy
              and governance.
            </p>

            <p className="font-['Source_Serif_Pro',serif] text-base text-[#627D98] leading-relaxed mb-8">
              Having served as the Speaker of the Parliament of Ghana,
              Member of Parliament, and in various diplomatic capacities,
              his contributions to the nation's democratic institutions
              remain invaluable.
            </p>

            {/* Key Points */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                "Speaker of Parliament",
                "Member of Parliament",
                "Legal Scholar & Author",
                "Diplomatic Service",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rotate-45 bg-[#C5A34E]"></div>
                  <span className="font-['Inter',sans-serif] text-sm text-[#334E68]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/biography"
              className="group inline-flex items-center gap-2 font-['Inter',sans-serif] text-[12px] font-semibold uppercase tracking-[0.15em] text-[#C5A34E] hover:text-[#A88A3D] transition-colors duration-300"
            >
              Read Full Biography
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutStrip