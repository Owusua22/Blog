import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchBiographies } from "../redux/slice/biographySlice"
import { Link } from "react-router-dom"
import {
  ChevronRight,
  BookOpen,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Globe,
  Users,
  Scale,
  Heart,
  ArrowRight,
  ChevronDown,
  Quote,
} from "lucide-react"
import Navbar from "../Component/Navbar"
import Footer from "../Component/Footer"

// =========================================
// SECTION ICON MAPPER
// =========================================
const getSectionIcon = (sectionName) => {
  const name = (sectionName || "").toLowerCase()
  if (name.includes("education") || name.includes("academic"))
    return GraduationCap
  if (name.includes("career") || name.includes("profession"))
    return Briefcase
  if (name.includes("award") || name.includes("honor"))
    return Award
  if (name.includes("politic") || name.includes("parliament") || name.includes("government"))
    return Scale
  if (name.includes("international") || name.includes("diplomat"))
    return Globe
  if (name.includes("family") || name.includes("personal"))
    return Heart
  if (name.includes("member") || name.includes("association"))
    return Users
  return BookOpen
}

// =========================================
// TABLE OF CONTENTS COMPONENT
// =========================================
const TableOfContents = ({ sections, activeSection, onSectionClick }) => {
  return (
    <div className="bg-white rounded-sm shadow-[0_1px_3px_rgba(11,29,58,0.08)] p-6 sticky top-24">
      <h4 className="font-['Cormorant_Garamond',serif] text-lg font-bold text-[#0B1D3A] mb-4 flex items-center gap-2">
        <div className="w-6 h-[2px] bg-[#C5A34E]"></div>
        Contents
      </h4>

      <nav className="space-y-1">
        {sections.map((section, index) => {
          const Icon = getSectionIcon(section.name)
          return (
            <button
              key={index}
              onClick={() => onSectionClick(index)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all duration-300 group ${
                activeSection === index
                  ? "bg-[#0B1D3A] text-[#C5A34E]"
                  : "text-[#627D98] hover:bg-[#F4F1EB] hover:text-[#0B1D3A]"
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  activeSection === index
                    ? "text-[#C5A34E]"
                    : "text-[#829AB1] group-hover:text-[#C5A34E]"
                }`}
              />
              <span className="font-['Inter',sans-serif] text-[11px] font-medium uppercase tracking-[0.1em] line-clamp-1">
                {section.name}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

// =========================================
// TIMELINE ITEM COMPONENT
// =========================================
const TimelineItem = ({ item, index, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const isLong = (item.content || "").length > 200

  return (
    <div className={`relative pl-8 sm:pl-10 ${!isLast ? "pb-8 sm:pb-10" : ""}`}>
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[11px] sm:left-[13px] top-6 bottom-0 w-[2px] bg-gradient-to-b from-[#C5A34E]/30 to-[#D4CFC7]/20"></div>
      )}

      {/* Timeline Dot */}
      <div className="absolute left-0 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-[#C5A34E] flex items-center justify-center shadow-[0_2px_8px_rgba(197,163,78,0.2)] z-10">
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#C5A34E]"></div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-sm shadow-[0_1px_3px_rgba(11,29,58,0.06)] hover:shadow-[0_4px_16px_rgba(11,29,58,0.1)] border border-transparent hover:border-[#C5A34E]/10 transition-all duration-500 p-5 sm:p-6 group">
        {/* Date Badge */}
        {item.date && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B1D3A]/5 rounded-sm mb-3">
            <Calendar className="w-3 h-3 text-[#C5A34E]" />
            <span className="font-['Inter',sans-serif] text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0B1D3A]">
              {item.date}
            </span>
          </div>
        )}

        {/* Heading */}
        {item.heading && (
          <h4 className="font-['Cormorant_Garamond',serif] text-lg sm:text-xl font-bold text-[#0B1D3A] mb-2 leading-snug group-hover:text-[#C5A34E] transition-colors duration-300">
            {item.heading}
          </h4>
        )}

        {/* Divider */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-[1.5px] bg-[#C5A34E]/40"></div>
          <div className="w-1 h-1 rotate-45 border border-[#C5A34E]/30"></div>
        </div>

        {/* Content */}
        {item.content && (
          <>
            <p
              className={`font-['Source_Serif_Pro',serif] text-sm sm:text-base text-[#486581] leading-relaxed ${
                !isExpanded && isLong ? "line-clamp-4" : ""
              }`}
            >
              {item.content}
            </p>

            {isLong && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1.5 mt-3 font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#C5A34E] hover:text-[#A88A3D] transition-colors duration-300"
              >
                {isExpanded ? "Show Less" : "Read More"}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// =========================================
// MAIN BIOGRAPHY PAGE
// =========================================
const BiographyPage = () => {
  const dispatch = useDispatch()
  const { items: biographies = [], loading, error } = useSelector(
    (state) => state.biography
  )

  const [activeSection, setActiveSection] = useState(0)
  const [showMobileToc, setShowMobileToc] = useState(false)
  const sectionRefs = useRef([])

  useEffect(() => {
    dispatch(fetchBiographies())
  }, [dispatch])

  // Get the first (main) biography
  const biography = biographies[0]

  // Scroll to section
  const scrollToSection = (index) => {
    setActiveSection(index)
    setShowMobileToc(false)
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200

      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const top = ref.offsetTop
          const bottom = top + ref.offsetHeight
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveSection(index)
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [biography])

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F1EB]">
        <Navbar />

        {/* Header Skeleton */}
        <section className="relative bg-[#0B1D3A] py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid lg:grid-cols-3 gap-12 items-center">
              <div className="flex justify-center">
                <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#1B3A5C] animate-pulse"></div>
              </div>
              <div className="lg:col-span-2 text-center lg:text-left animate-pulse">
                <div className="w-40 h-3 bg-[#1B3A5C] rounded-full mb-6 mx-auto lg:mx-0"></div>
                <div className="w-80 h-10 bg-[#1B3A5C] rounded-full mb-4 mx-auto lg:mx-0"></div>
                <div className="w-60 h-10 bg-[#1B3A5C] rounded-full mb-6 mx-auto lg:mx-0"></div>
                <div className="w-16 h-0.5 bg-[#C5A34E]/30 mx-auto lg:mx-0 mb-6"></div>
                <div className="w-full h-4 bg-[#1B3A5C] rounded-full mb-3"></div>
                <div className="w-3/4 h-4 bg-[#1B3A5C] rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Skeleton */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="grid lg:grid-cols-4 gap-10">
            <div className="hidden lg:block">
              <div className="bg-white rounded-sm p-6 animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-full h-10 bg-[#D4CFC7] rounded-sm mb-2"
                  ></div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="mb-12">
                  <div className="w-48 h-6 bg-[#D4CFC7] rounded-full mb-6"></div>
                  {[1, 2].map((j) => (
                    <div
                      key={j}
                      className="bg-white rounded-sm p-6 mb-4"
                    >
                      <div className="w-24 h-3 bg-[#D4CFC7] rounded-full mb-3"></div>
                      <div className="w-64 h-5 bg-[#D4CFC7] rounded-full mb-3"></div>
                      <div className="w-full h-3 bg-[#D4CFC7] rounded-full mb-2"></div>
                      <div className="w-3/4 h-3 bg-[#D4CFC7] rounded-full"></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    )
  }

  // ===== ERROR =====
  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F1EB]">
        <Navbar />
        <section className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center px-6">
            <div className="w-20 h-20 rounded-full bg-[#0B1D3A] flex items-center justify-center mx-auto mb-8">
              <BookOpen className="w-9 h-9 text-[#C5A34E]" />
            </div>
            <h2 className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#0B1D3A] mb-4">
              Unable to Load Biography
            </h2>
            <p className="font-['Source_Serif_Pro',serif] text-base text-[#627D98] mb-8">
              {error?.message || "Something went wrong."}
            </p>
            <button
              onClick={() => dispatch(fetchBiographies())}
              className="px-8 py-3 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-xs font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm"
            >
              Try Again
            </button>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  // ===== EMPTY =====
  if (!biography) {
    return (
      <div className="min-h-screen bg-[#F4F1EB]">
        <Navbar />
        <section className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center px-6">
            <div className="w-20 h-20 rounded-full bg-[#0B1D3A] flex items-center justify-center mx-auto mb-8">
              <BookOpen className="w-9 h-9 text-[#C5A34E]" />
            </div>
            <h2 className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#0B1D3A] mb-4">
              Biography Coming Soon
            </h2>
            <p className="font-['Source_Serif_Pro',serif] text-base text-[#627D98]">
              The biography will be available soon.
            </p>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  const sections = biography.sections || []

  // ===== MAIN RENDER =====
  return (
    <div className="min-h-screen bg-[#F4F1EB]">
      <Navbar />

      {/* ===== HERO HEADER ===== */}
      <section className="relative bg-[#0B1D3A] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#071222] via-[#0B1D3A] to-[#1B3A5C]"></div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #C5A34E 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        ></div>

        {/* Corner Accents */}
        <div className="absolute top-8 right-8 w-20 h-20 border-t border-r border-[#C5A34E]/15 hidden lg:block"></div>
        <div className="absolute bottom-8 left-8 w-20 h-20 border-b border-l border-[#C5A34E]/15 hidden lg:block"></div>

        {/* Decorative Circles */}
        <div className="absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full border border-[#C5A34E]/5 hidden lg:block"></div>

       <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 md:py-10">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-10">
            <Link
              to="/"
              className="font-['Inter',sans-serif] text-[11px] uppercase tracking-[0.15em] text-[#627D98] hover:text-[#C5A34E] transition-colors duration-300"
            >
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-[#334E68]" />
            <span className="font-['Inter',sans-serif] text-[11px] uppercase tracking-[0.15em] text-[#C5A34E]">
              Biography
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 lg:gap-16 items-center">
            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Outer Ring */}
                <div className="absolute -inset-3 sm:-inset-4 rounded-full border border-[#C5A34E]/20"></div>
                <div className="absolute -inset-6 sm:-inset-8 rounded-full border border-[#C5A34E]/10 hidden sm:block"></div>

                {/* Image */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-[#C5A34E]/30 shadow-[0_0_60px_rgba(197,163,78,0.15)]">
                  {biography.profileImage?.url ? (
                    <img
                      src={biography.profileImage.url}
                      alt={biography.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1B3A5C] to-[#0B1D3A] flex items-center justify-center">
                      <span className="font-['Cormorant_Garamond',serif] text-6xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#C5A34E] to-[#E2C96E]">
                        MO
                      </span>
                    </div>
                  )}
                </div>

                {/* Experience Badge */}
                <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 bg-gradient-to-br from-[#C5A34E] to-[#D4B555] rounded-full w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center shadow-[0_4px_14px_rgba(197,163,78,0.3)]">
                  <span className="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-bold text-[#0B1D3A] leading-none">
                    30+
                  </span>
                  <span className="font-['Inter',sans-serif] text-[6px] sm:text-[7px] uppercase tracking-[0.15em] text-[#0B1D3A]/70">
                    Years
                  </span>
                </div>
              </div>
            </div>

            {/* Bio Info */}
            <div className="lg:col-span-2 text-center lg:text-left">
              {/* Label */}
              <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                <span className="w-10 h-px bg-[#C5A34E]"></span>
                <span className="font-['Inter',sans-serif] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A34E]">
                  Biography
                </span>
              </div>

              {/* Title */}
              <h1 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {biography.title || "Hon. Mike Oquaye"}
              </h1>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
                <div className="w-16 h-[2px] bg-gradient-to-r from-[#C5A34E] to-[#E2C96E]"></div>
                <div className="w-2 h-2 rotate-45 border border-[#C5A34E]/50"></div>
              </div>

              {/* Description */}
              <p className="font-['Source_Serif_Pro',serif] text-base sm:text-lg text-[#BCCCDC] leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
                Distinguished statesman, legal luminary, scholar, and
                former Speaker of the Parliament of the Republic of Ghana.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto lg:mx-0">
                {[
                  { value: sections.length, label: "Chapters" },
                  {
                    value: sections.reduce(
                      (acc, s) => acc + (s.items?.length || 0),
                      0
                    ),
                    label: "Milestones",
                  },
                  { value: "Ghana", label: "Nation" },
                ].map((stat, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <p className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-[#C5A34E]">
                      {stat.value}
                    </p>
                    <p className="font-['Inter',sans-serif] text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-[#627D98] mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent opacity-40"></div>
      </section>

      {/* ===== MOBILE TABLE OF CONTENTS ===== */}
      {sections.length > 0 && (
        <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-[#D4CFC7] shadow-sm">
          <button
            onClick={() => setShowMobileToc(!showMobileToc)}
            className="w-full flex items-center justify-between px-6 py-3"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-[#C5A34E]" />
              <span className="font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.15em] text-[#0B1D3A]">
                {sections[activeSection]?.name || "Contents"}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#627D98] transition-transform duration-300 ${
                showMobileToc ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Mobile TOC Dropdown */}
          {showMobileToc && (
            <div className="border-t border-[#F4F1EB] px-4 py-3 bg-[#FAF9F7] max-h-[50vh] overflow-auto">
              {sections.map((section, index) => {
                const Icon = getSectionIcon(section.name)
                return (
                  <button
                    key={index}
                    onClick={() => scrollToSection(index)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all duration-300 ${
                      activeSection === index
                        ? "bg-[#0B1D3A] text-[#C5A34E]"
                        : "text-[#627D98] hover:bg-[#F4F1EB]"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-['Inter',sans-serif] text-[11px] font-medium uppercase tracking-[0.1em]">
                      {section.name}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <section className="relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C5A34E]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 hidden lg:block"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-12 md:py-16">
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-10">
            {/* ===== DESKTOP TABLE OF CONTENTS ===== */}
            <div className="hidden lg:block">
              <TableOfContents
                sections={sections}
                activeSection={activeSection}
                onSectionClick={scrollToSection}
              />
            </div>

            {/* ===== SECTIONS CONTENT ===== */}
            <div className="lg:col-span-3">
              {sections.map((section, sIndex) => {
                const Icon = getSectionIcon(section.name)

                return (
                  <div
                    key={sIndex}
                    ref={(el) => (sectionRefs.current[sIndex] = el)}
                    className="mb-12 sm:mb-16 scroll-mt-24"
                  >
                    {/* Section Header */}
                    <div className="flex items-center gap-4 mb-8">
                      {/* Icon */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0B1D3A] flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5A34E]" />
                      </div>

                      <div className="flex-1">
                        {/* Section Number */}
                        <span className="font-['Inter',sans-serif] text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A34E]">
                          Chapter {String(sIndex + 1).padStart(2, "0")}
                        </span>

                        {/* Section Name */}
                        <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-[#0B1D3A] leading-tight">
                          {section.name}
                        </h2>
                      </div>
                    </div>

                    {/* Gold Line */}
                    <div className="flex items-center gap-3 ml-6 sm:ml-7 mb-8">
                      <div className="w-12 h-[2px] bg-gradient-to-r from-[#C5A34E] to-transparent"></div>
                      <div className="w-1.5 h-1.5 rotate-45 border border-[#C5A34E]/40"></div>
                      <div className="flex-1 h-px bg-[#D4CFC7]/50"></div>
                    </div>

                    {/* Timeline Items */}
                    {section.items && section.items.length > 0 ? (
                      <div className="ml-2 sm:ml-4">
                        {section.items.map((item, iIndex) => (
                          <TimelineItem
                            key={iIndex}
                            item={item}
                            index={iIndex}
                            isLast={iIndex === section.items.length - 1}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="ml-6 sm:ml-7 text-[#829AB1]">
                        <p className="font-['Source_Serif_Pro',serif] text-sm italic">
                          Details coming soon.
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* ===== END QUOTE ===== */}
              <div className="mt-8 sm:mt-12 bg-[#0B1D3A] rounded-sm p-8 sm:p-12 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #C5A34E 1px, transparent 0)`,
                    backgroundSize: "24px 24px",
                  }}
                ></div>

                <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-[#C5A34E]/15"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-[#C5A34E]/15"></div>

                <div className="relative text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1B3A5C] flex items-center justify-center mx-auto mb-6">
                    <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5A34E]" />
                  </div>

                  <blockquote className="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl md:text-3xl font-medium text-white italic leading-relaxed mb-8 max-w-2xl mx-auto">
                    "A life dedicated to the service of one's nation is a
                    life well lived."
                  </blockquote>

                  <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="w-8 h-px bg-[#C5A34E]"></span>
                    <div className="w-2 h-2 rotate-45 bg-[#C5A34E]"></div>
                    <span className="w-8 h-px bg-[#C5A34E]"></span>
                  </div>

                  <p className="font-['Cormorant_Garamond',serif] text-lg font-bold text-[#C5A34E]">
                    {biography.title || "Hon. Mike Oquaye"}
                  </p>
                  <p className="font-['Inter',sans-serif] text-[10px] uppercase tracking-[0.2em] text-[#627D98] mt-1">
                    Former Speaker of Parliament
                  </p>
                </div>
              </div>

              {/* ===== CTA ===== */}
              <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/articles"
                  className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-[11px] font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm hover:from-[#D4B555] hover:to-[#E2C96E] shadow-[0_4px_14px_rgba(197,163,78,0.3)] transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Articles
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <Link
                  to="/publications"
                  className="group inline-flex items-center gap-2.5 px-8 py-4 border border-[#C5A34E]/40 text-[#C5A34E] text-[11px] font-['Inter',sans-serif] font-semibold uppercase tracking-[0.15em] rounded-sm hover:bg-[#C5A34E]/10 hover:border-[#C5A34E] transition-all duration-300"
                >
                  View Publications
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default BiographyPage