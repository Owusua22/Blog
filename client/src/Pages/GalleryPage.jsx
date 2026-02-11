import React, { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchBanners } from "../redux/slice/bannerSlice"
import { Link } from "react-router-dom"
import {
  Search,
  ChevronRight,
  ChevronLeft,
  X,
  Camera,
  ZoomIn,
  Download,
  Share2,
  Grid3X3,
  LayoutGrid,
  Facebook,
  Linkedin,
  Link2,
  Check,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
} from "lucide-react"
import Navbar from "../Component/Navbar"
import Footer from "../Component/Footer"

const ITEMS_PER_PAGE = 12

// =========================================
// LIGHTBOX COMPONENT
// =========================================
const Lightbox = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [showInfo, setShowInfo] = useState(true)

  const current = images[currentIndex]

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
      if (e.key === "i") setShowInfo((p) => !p)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose, onPrev, onNext])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  // Touch swipe
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (Math.abs(distance) > 50) {
      if (distance > 0) onNext()
      else onPrev()
    }
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const title = current?.title || "Gallery Image"

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    }

    if (platform === "copy") {
      navigator.clipboard.writeText(current?.image?.url || url)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
      return
    }

    window.open(urls[platform], "_blank", "width=600,height=400")
  }

  const handleDownload = () => {
    if (current?.image?.url) {
      const link = document.createElement("a")
      link.href = current.image.url
      link.download = `${current.title || "gallery-image"}.jpg`
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (!current) return null

  return (
    <div className="fixed inset-0 z-[200] bg-[#0B1D3A]/95 backdrop-blur-md flex flex-col">
      {/* ===== TOP BAR ===== */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
        {/* Left — Counter */}
        <div className="flex items-center gap-3">
          <span className="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-bold text-[#C5A34E]">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span className="w-6 h-px bg-[#627D98]"></span>
          <span className="font-['Inter',sans-serif] text-xs text-[#627D98]">
            {String(images.length).padStart(2, "0")}
          </span>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zoom */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-300"
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="hidden sm:flex w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 items-center justify-center transition-all duration-300"
            aria-label="Download"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Share */}
          <div className="relative group">
            <button
              className="hidden sm:flex w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 items-center justify-center transition-all duration-300"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Share Dropdown */}
            <div className="absolute right-0 top-12 bg-[#1B3A5C] border border-[#334E68] rounded-sm p-2 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              {[
                { name: "Facebook", platform: "facebook", icon: Facebook },
                {
                  name: "Twitter / X",
                  platform: "twitter",
                  icon: () => (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                { name: "LinkedIn", platform: "linkedin", icon: Linkedin },
                {
                  name: linkCopied ? "Copied!" : "Copy Link",
                  platform: "copy",
                  icon: linkCopied ? Check : Link2,
                },
              ].map((item) => (
                <button
                  key={item.platform}
                  onClick={() => handleShare(item.platform)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-white/70 hover:text-[#C5A34E] hover:bg-white/5 rounded-sm transition-all duration-300"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-['Inter',sans-serif] text-xs">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 flex items-center justify-center transition-all duration-300"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ===== IMAGE AREA ===== */}
      <div
        className="flex-1 relative flex items-center justify-center px-4 sm:px-16 py-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Prev Button */}
        <button
          onClick={onPrev}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-300"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Image */}
        <div
          className={`relative max-w-full max-h-full transition-all duration-500 ${
            isZoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={current.image?.url}
            alt={current.title || "Gallery image"}
            className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-300"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* ===== BOTTOM INFO BAR ===== */}
      <div
        className={`flex-shrink-0 transition-all duration-500 ${
          showInfo
            ? "max-h-40 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 sm:px-6 py-4 bg-[#071222]/50 backdrop-blur-sm border-t border-white/5">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-['Cormorant_Garamond',serif] text-lg sm:text-xl font-bold text-white">
                {current.title}
              </h3>
              {current.link && (
                <a
                  href={current.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-['Inter',sans-serif] text-[11px] text-[#C5A34E] hover:text-[#E2C96E] transition-colors duration-300"
                >
                  View related →
                </a>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-[10px] font-['Inter',sans-serif] font-bold uppercase tracking-[0.12em] rounded-sm"
              >
                <Download className="w-3.5 h-3.5 inline mr-1.5" />
                Save
              </button>
              <button
                onClick={() => handleShare("copy")}
                className={`px-4 py-2 border text-[10px] font-['Inter',sans-serif] font-medium uppercase tracking-[0.12em] rounded-sm transition-all duration-300 ${
                  linkCopied
                    ? "border-green-500 text-green-400"
                    : "border-white/20 text-white/70"
                }`}
              >
                {linkCopied ? (
                  <Check className="w-3.5 h-3.5 inline mr-1" />
                ) : (
                  <Link2 className="w-3.5 h-3.5 inline mr-1" />
                )}
                {linkCopied ? "Copied" : "Share"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== THUMBNAIL STRIP ===== */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-3 bg-[#071222]/80 border-t border-white/5 overflow-x-auto">
        <div className="flex items-center gap-2 justify-center min-w-max">
          {images.map((img, index) => (
            <button
              key={img._id}
              onClick={() => {
                // We need to calculate the proper index for onNext/onPrev
                const diff = index - currentIndex
                if (diff > 0) for (let i = 0; i < diff; i++) onNext()
                if (diff < 0) for (let i = 0; i < Math.abs(diff); i++) onPrev()
              }}
              className={`w-12 h-9 sm:w-16 sm:h-12 rounded-sm overflow-hidden flex-shrink-0 transition-all duration-300 ${
                index === currentIndex
                  ? "ring-2 ring-[#C5A34E] opacity-100 scale-110"
                  : "opacity-40 hover:opacity-70"
              }`}
            >
              {img.image?.url && (
                <img
                  src={img.image.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// =========================================
// MAIN GALLERY PAGE
// =========================================
const GalleryPage = () => {
  const dispatch = useDispatch()
  const { banners = [], loading, error } = useSelector(
    (state) => state.banners
  )

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState("masonry") // masonry | grid
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    dispatch(fetchBanners())
  }, [dispatch])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Filter banners with images
  const filteredImages = useMemo(() => {
    let result = banners.filter((b) => b.image?.url)

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((b) =>
        (b.title || "").toLowerCase().includes(query)
      )
    }

    return result.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  }, [banners, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE)
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Lightbox handlers
  const openLightbox = (index) => {
    const globalIndex =
      (currentPage - 1) * ITEMS_PER_PAGE + index
    setLightboxIndex(globalIndex)
  }

  const closeLightbox = () => setLightboxIndex(null)

  const nextImage = () => {
    setLightboxIndex((prev) =>
      prev < filteredImages.length - 1 ? prev + 1 : 0
    )
  }

  const prevImage = () => {
    setLightboxIndex((prev) =>
      prev > 0 ? prev - 1 : filteredImages.length - 1
    )
  }

  // Page numbers
  const getPageNumbers = () => {
    const pages = []
    const max = 5
    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i)
      pages.push("...")
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1)
      pages.push("...")
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push("...")
      for (let i = currentPage - 1; i <= currentIndex + 1; i++) pages.push(i)
      pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  // Masonry column assignment
  const getMasonryColumns = () => {
    const cols = [[], [], []]
    paginatedImages.forEach((img, index) => {
      cols[index % 3].push({ ...img, originalIndex: index })
    })
    return cols
  }

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
                Gallery
              </span>
            </div>

            <div className="w-16 h-16 rounded-full bg-[#1B3A5C] border border-[#334E68] flex items-center justify-center mx-auto mb-8">
              <Camera className="w-7 h-7 text-[#C5A34E]" />
            </div>

            <h1 className="font-['Cormorant_Garamond',serif] text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Photo Gallery
            </h1>

            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent mx-auto mb-6"></div>

            <p className="font-['Source_Serif_Pro',serif] text-base sm:text-lg text-[#9FB3C8] max-w-xl mx-auto">
              A visual journey through the distinguished career and
              public service of Hon. Mike Oquaye.
            </p>
          </div>
        </div>

        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent opacity-40"></div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="relative">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 md:py-16">
          {/* ===== TOOLBAR ===== */}
          <div className="bg-white rounded-sm shadow-[0_1px_3px_rgba(11,29,58,0.08)] p-4 sm:p-6 mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
              {/* Search */}
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#627D98]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search photos..."
                  className="w-full pl-11 pr-10 py-3 bg-[#F4F1EB] border border-[#D4CFC7] rounded-sm font-['Inter',sans-serif] text-sm text-[#0B1D3A] placeholder-[#829AB1] focus:outline-none focus:border-[#C5A34E] focus:ring-1 focus:ring-[#C5A34E]/30 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#829AB1] hover:text-[#0B1D3A]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-3">
                <span className="font-['Inter',sans-serif] text-[10px] uppercase tracking-[0.1em] text-[#829AB1] hidden sm:inline">
                  View:
                </span>
                <div className="flex bg-[#F4F1EB] border border-[#D4CFC7] rounded-sm overflow-hidden">
                  <button
                    onClick={() => setViewMode("masonry")}
                    className={`p-3 transition-all duration-300 ${
                      viewMode === "masonry"
                        ? "bg-[#0B1D3A] text-[#C5A34E]"
                        : "text-[#829AB1] hover:text-[#0B1D3A]"
                    }`}
                    aria-label="Masonry view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-[#0B1D3A] text-[#C5A34E]"
                        : "text-[#829AB1] hover:text-[#0B1D3A]"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Count */}
            <div className="mt-4 pt-4 border-t border-[#F4F1EB]">
              <p className="font-['Inter',sans-serif] text-[11px] text-[#829AB1] uppercase tracking-[0.1em]">
                <span className="text-[#0B1D3A] font-semibold">
                  {filteredImages.length}
                </span>{" "}
                photos
                {searchQuery && (
                  <span className="text-[#C5A34E]">
                    {" "}
                    matching "{searchQuery}"
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* ===== LOADING ===== */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className={`bg-[#D4CFC7] rounded-sm animate-pulse ${
                    i % 3 === 0 ? "h-64 sm:h-80" : "h-48 sm:h-64"
                  }`}
                ></div>
              ))}
            </div>
          )}

          {/* ===== ERROR ===== */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[#0B1D3A] flex items-center justify-center mx-auto mb-6">
                <Camera className="w-7 h-7 text-[#C5A34E]" />
              </div>
              <h3 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#0B1D3A] mb-3">
                Unable to Load Gallery
              </h3>
              <p className="font-['Inter',sans-serif] text-sm text-[#627D98] mb-6">
                {error?.message || "Something went wrong."}
              </p>
              <button
                onClick={() => dispatch(fetchBanners())}
                className="px-8 py-3 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-xs font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ===== EMPTY ===== */}
          {!loading && !error && filteredImages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[#0B1D3A] flex items-center justify-center mx-auto mb-6">
                {searchQuery ? (
                  <Search className="w-7 h-7 text-[#C5A34E]" />
                ) : (
                  <Camera className="w-7 h-7 text-[#C5A34E]" />
                )}
              </div>
              <h3 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#0B1D3A] mb-3">
                {searchQuery ? "No Photos Found" : "Gallery Coming Soon"}
              </h3>
              <p className="font-['Source_Serif_Pro',serif] text-base text-[#627D98]">
                {searchQuery
                  ? `No photos match "${searchQuery}".`
                  : "Photos will be added soon."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-xs font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* ===== MASONRY VIEW ===== */}
          {!loading &&
            !error &&
            filteredImages.length > 0 &&
            viewMode === "masonry" && (
              <div className="columns-2 sm:columns-3 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
                {paginatedImages.map((banner, index) => (
                  <div
                    key={banner._id}
                    className="break-inside-avoid group cursor-pointer relative rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(11,29,58,0.08)] hover:shadow-[0_10px_40px_rgba(11,29,58,0.15)] transition-all duration-500"
                    onClick={() => openLightbox(index)}
                  >
                    {/* Image */}
                    <img
                      src={banner.image.url}
                      alt={banner.title || "Gallery image"}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A]/80 via-[#0B1D3A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 sm:p-5">
                      {/* Zoom Icon */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>

                      {/* Title */}
                      <div>
                        <h4 className="font-['Cormorant_Garamond',serif] text-base sm:text-lg font-bold text-white leading-snug line-clamp-2">
                          {banner.title}
                        </h4>
                        {banner.createdAt && (
                          <p className="font-['Inter',sans-serif] text-[9px] sm:text-[10px] text-[#C5A34E] mt-1 uppercase tracking-[0.1em]">
                            {formatDate(banner.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-white/0 group-hover:border-white/30 transition-all duration-500"></div>
                  </div>
                ))}
              </div>
            )}

          {/* ===== GRID VIEW ===== */}
          {!loading &&
            !error &&
            filteredImages.length > 0 &&
            viewMode === "grid" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {paginatedImages.map((banner, index) => (
                  <div
                    key={banner._id}
                    className="group cursor-pointer relative aspect-square rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(11,29,58,0.08)] hover:shadow-[0_10px_40px_rgba(11,29,58,0.15)] transition-all duration-500"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={banner.image.url}
                      alt={banner.title || "Gallery image"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 sm:p-4">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>

                      <h4 className="font-['Cormorant_Garamond',serif] text-sm sm:text-base font-bold text-white line-clamp-2">
                        {banner.title}
                      </h4>
                    </div>

                    {/* Number Badge */}
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#0B1D3A]/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="font-['Inter',sans-serif] text-[8px] font-bold text-[#C5A34E]">
                        {String(
                          (currentPage - 1) * ITEMS_PER_PAGE + index + 1
                        ).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* ===== PAGINATION ===== */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-10 sm:mt-14">
              <div className="h-px bg-gradient-to-r from-transparent via-[#D4CFC7] to-transparent mb-8 sm:mb-10"></div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <p className="font-['Inter',sans-serif] text-[11px] text-[#829AB1] uppercase tracking-[0.1em]">
                  Page{" "}
                  <span className="text-[#0B1D3A] font-semibold">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="text-[#0B1D3A] font-semibold">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.max(p - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm border border-[#D4CFC7] flex items-center justify-center text-[#627D98] hover:border-[#C5A34E] hover:text-[#C5A34E] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {getPageNumbers().map((page, i) =>
                    page === "..." ? (
                      <span
                        key={`d-${i}`}
                        className="w-9 h-9 flex items-center justify-center text-[#829AB1] text-sm"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page)
                          window.scrollTo({ top: 400, behavior: "smooth" })
                        }}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-sm font-['Inter',sans-serif] text-xs sm:text-sm font-medium transition-all duration-300 ${
                          currentPage === page
                            ? "bg-[#0B1D3A] text-[#C5A34E] shadow-md"
                            : "border border-[#D4CFC7] text-[#627D98] hover:border-[#C5A34E] hover:text-[#C5A34E]"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm border border-[#D4CFC7] flex items-center justify-center text-[#627D98] hover:border-[#C5A34E] hover:text-[#C5A34E] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="hidden sm:block w-20"></div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== LIGHTBOX ===== */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

      <Footer />
    </div>
  )
}

export default GalleryPage