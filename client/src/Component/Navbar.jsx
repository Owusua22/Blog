import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, ChevronRight } from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Detect scroll for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const toggleMenu = () => setIsOpen(!isOpen)

  const links = [
    { name: "Home", path: "/" },
    { name: "Biography", path: "/biography" },
    { name: "Articles", path: "/articles" },
    {name: "Publications", path: "/publications"},

    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* ===== TOP BAR ===== */}
      <div className="bg-[#071222] text-[#9FB3C8] hidden md:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center h-8 text-xs tracking-widest uppercase">
          <p className="font-sans">
            Former Speaker of Parliament — Republic of Ghana
          </p>
          <div className="flex items-center gap-6">
            <a
              href="mailto:contact@mikeocquaye.com"
              className="hover:text-[#C5A34E] transition-colors duration-300"
            >
              contact@mikeocquaye.com
            </a>
            <span className="w-px h-4 bg-[#334E68]"></span>
            <div className="flex items-center gap-4">
              {/* Social Icons */}
              <a
                href="#"
                className="hover:text-[#C5A34E] transition-colors duration-300"
                aria-label="Twitter"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-[#C5A34E] transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-[#C5A34E] transition-colors duration-300"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                  <polygon points="9.545,15.568 15.818,12 9.545,8.432" fill="#071222" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN NAVBAR ===== */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0B1D3A]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(11,29,58,0.3)]"
            : "bg-[#0B1D3A]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">

            {/* ===== LOGO ===== */}
            <Link to="/" className="flex items-center gap-3 group">
              {/* Monogram / Crest */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C5A34E] to-[#E2C96E] flex items-center justify-center shadow-[0_2px_10px_rgba(197,163,78,0.3)] group-hover:shadow-[0_2px_15px_rgba(197,163,78,0.5)] transition-shadow duration-300">
                <span className="text-[#0B1D3A] font-bold text-lg font-['Cormorant_Garamond',serif]">
                  MO
                </span>
              </div>

              {/* Name & Title */}
              <div className="flex flex-col">
                <span className="text-white text-lg font-bold font-['Cormorant_Garamond',serif] leading-tight tracking-wide group-hover:text-[#C5A34E] transition-colors duration-300">
                  Hon. Mike Ocquaye
                </span>
                <span className="text-[#627D98] text-[10px] font-['Inter',sans-serif] uppercase tracking-[0.2em] leading-tight hidden sm:block">
                  Former Speaker of Parliament
                </span>
              </div>
            </Link>

            {/* ===== DESKTOP MENU ===== */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 text-[13px] font-['Inter',sans-serif] font-medium uppercase tracking-[0.15em] transition-colors duration-300
                    ${
                      isActive(link.path)
                        ? "text-[#C5A34E]"
                        : "text-[#9FB3C8] hover:text-white"
                    }
                  `}
                >
                  {link.name}

                  {/* Active Indicator */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#C5A34E] transition-all duration-300 ${
                      isActive(link.path) ? "w-6" : "w-0"
                    }`}
                  ></span>

                  {/* Hover Indicator */}
                  {!isActive(link.path) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#C5A34E]/50 group-hover:w-4 hover:w-4 transition-all duration-300"></span>
                  )}
                </Link>
              ))}

              {/* Divider */}
              <span className="w-px h-8 bg-[#334E68] mx-3"></span>

             
            </div>

            {/* ===== MOBILE MENU BUTTON ===== */}
            <button
              onClick={toggleMenu}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-[#C5A34E] hover:text-white transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <span
                className={`absolute transition-all duration-300 ${
                  isOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                }`}
              >
                <Menu className="w-6 h-6" />
              </span>
              <span
                className={`absolute transition-all duration-300 ${
                  isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                }`}
              >
                <X className="w-6 h-6" />
              </span>
            </button>
          </div>
        </div>

        {/* ===== GOLD ACCENT LINE ===== */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent opacity-40"></div>
      </nav>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* ===== MOBILE MENU PANEL ===== */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#0B1D3A] z-50 lg:hidden transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1B3A5C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A34E] to-[#E2C96E] flex items-center justify-center">
              <span className="text-[#0B1D3A] font-bold text-base font-['Cormorant_Garamond',serif]">
                MO
              </span>
            </div>
            <div>
              <p className="text-white font-['Cormorant_Garamond',serif] font-bold text-base">
                Hon. Mike Ocquaye
              </p>
              <p className="text-[#627D98] text-[9px] font-['Inter',sans-serif] uppercase tracking-[0.2em]">
                Former Speaker
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#627D98] hover:text-white transition-colors duration-300"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu Links */}
        <div className="py-6 px-4">
          {links.map((link, index) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-4 py-4 rounded-sm mb-1 transition-all duration-300 group
                ${
                  isActive(link.path)
                    ? "bg-[#1B3A5C] text-[#C5A34E] border-l-2 border-[#C5A34E]"
                    : "text-[#9FB3C8] hover:bg-[#1B3A5C]/50 hover:text-white border-l-2 border-transparent"
                }
              `}
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <span className="font-['Inter',sans-serif] text-sm font-medium uppercase tracking-[0.12em]">
                {link.name}
              </span>
              <ChevronRight
                className={`w-4 h-4 transition-all duration-300 ${
                  isActive(link.path)
                    ? "text-[#C5A34E] translate-x-0"
                    : "text-[#334E68] group-hover:text-[#627D98] group-hover:translate-x-1"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Mobile Menu Divider */}
        <div className="px-8">
          <div className="h-px bg-gradient-to-r from-[#1B3A5C] via-[#C5A34E]/30 to-[#1B3A5C]"></div>
        </div>

        {/* Mobile Login Button */}
        <div className="p-6">
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center px-6 py-3.5 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-[12px] font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm hover:from-[#D4B555] hover:to-[#E2C96E] shadow-[0_4px_14px_rgba(197,163,78,0.3)] transition-all duration-300"
          >
            Login to Dashboard
          </Link>
        </div>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#1B3A5C]">
          {/* Social Icons */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-[#1B3A5C] flex items-center justify-center text-[#627D98] hover:bg-[#C5A34E] hover:text-[#0B1D3A] transition-all duration-300"
              aria-label="Twitter"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-[#1B3A5C] flex items-center justify-center text-[#627D98] hover:bg-[#C5A34E] hover:text-[#0B1D3A] transition-all duration-300"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-[#1B3A5C] flex items-center justify-center text-[#627D98] hover:bg-[#C5A34E] hover:text-[#0B1D3A] transition-all duration-300"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                <polygon points="9.545,15.568 15.818,12 9.545,8.432" fill="#1B3A5C" />
              </svg>
            </a>
          </div>
      
        </div>
      </div>
    </>
  )
}

export default Navbar