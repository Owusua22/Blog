import React, { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPublications } from "../redux/slice/publicationSlice"
import {
  Search,
  Download,
  Eye,
  FileText,
  Calendar,
  ChevronRight,
  X,
  BookOpen,
  Grid3X3,
  List,
  SlidersHorizontal,
  ExternalLink,
  ChevronLeft,
  Info,
  Loader2,
  RefreshCw,
  Maximize2,
  Minimize2,
  ArrowLeft,
} from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "../Component/Navbar"
import Footer from "../Component/Footer"

const ITEMS_PER_PAGE = 9

// =========================================
// INLINE PDF VIEWER COMPONENT
// =========================================
const InlinePDFViewer = ({ publication, onClose, formatDate, getFileSize, onDownload }) => {
  const [pdfLoading, setPdfLoading] = useState(true)
  const [pdfError, setPdfError] = useState(false)
  const [viewerType, setViewerType] = useState("google")
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Reset on publication change
  useEffect(() => {
    setPdfLoading(true)
    setPdfError(false)
    setViewerType("google")
  }, [publication?._id])

  // Lock body scroll
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isFullscreen])

  // Escape key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [isFullscreen, onClose])

  const getPdfUrl = (url) => {
    switch (viewerType) {
      case "google":
        return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
      case "office":
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
      case "direct":
        return url
      default:
        return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
    }
  }

  const handleLoad = () => {
    setPdfLoading(false)
    setPdfError(false)
  }

  const handleError = () => {
    setPdfLoading(false)
    setPdfError(true)
  }

  const retryLoad = () => {
    setPdfLoading(true)
    setPdfError(false)
    // Force re-mount by toggling viewer
    const current = viewerType
    setViewerType("")
    setTimeout(() => setViewerType(current), 50)
  }

  const switchViewer = (type) => {
    setViewerType(type)
    setPdfLoading(true)
    setPdfError(false)
  }

  const containerClass = isFullscreen
    ? "fixed inset-0 z-[100] bg-white flex flex-col"
    : "bg-white rounded-sm shadow-[0_4px_20px_rgba(11,29,58,0.1)] border border-[#E8E4DC] overflow-hidden flex flex-col"

  return (
    <div className={containerClass} style={{ animation: "fadeInUp 0.5s ease-out" }}>
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-[#0B1D3A] to-[#122B4D] flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-200 flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h3
              className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {publication.title}
            </h3>
            <div className="flex items-center gap-2 text-[#627D98]">
              <span
                className="text-[9px] sm:text-[10px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {formatDate(publication.createdAt)}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#334E68]" />
              <span
                className="text-[9px] sm:text-[10px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {getFileSize(publication)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-200"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Download */}
          <button
            onClick={() => onDownload(publication)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
            style={{
              fontFamily: "'Inter', sans-serif",
              background: "linear-gradient(135deg, #C5A34E, #D4B555)",
              color: "#0B1D3A",
            }}
          >
            <Download className="w-3 h-3" />
            Download
          </button>

          {/* Mobile download */}
          <a
            href={publication.file?.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="sm:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #C5A34E, #D4B555)",
              color: "#0B1D3A",
            }}
          >
            <Download className="w-3.5 h-3.5" />
          </a>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500/80 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ===== VIEWER TOOLBAR ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 sm:px-6 py-2.5 bg-[#FAF9F7] border-b border-[#E8E4DC] flex-shrink-0">
        {/* Viewer switcher */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          <span
            className="text-[9px] font-semibold uppercase tracking-widest text-[#829AB1] mr-1.5 flex-shrink-0 hidden sm:inline"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Viewer:
          </span>
          {[
            { key: "google", label: "Google Docs" },
            { key: "office", label: "Office Online" },
            { key: "direct", label: "Browser PDF" },
          ].map((v) => (
            <button
              key={v.key}
              onClick={() => switchViewer(v.key)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-sm text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 flex-shrink-0 ${
                viewerType === v.key
                  ? "bg-[#0B1D3A] text-[#C5A34E] shadow-sm"
                  : "bg-white border border-[#E8E4DC] text-[#829AB1] hover:border-[#C5A34E] hover:text-[#C5A34E]"
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={retryLoad}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider bg-white border border-[#E8E4DC] text-[#829AB1] hover:border-[#C5A34E] hover:text-[#C5A34E] transition-all duration-200"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reload</span>
          </button>

          {publication.file?.url && (
            <a
              href={publication.file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider bg-white border border-[#E8E4DC] text-[#829AB1] hover:border-[#C5A34E] hover:text-[#C5A34E] transition-all duration-200"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">New Tab</span>
            </a>
          )}
        </div>
      </div>

      {/* ===== PDF IFRAME AREA ===== */}
      <div
        className="relative flex-1 bg-[#525659]"
        style={{ minHeight: isFullscreen ? "0" : "600px" }}
      >
        {/* Loading overlay */}
        {pdfLoading && (
          <div className="absolute inset-0 bg-[#FAF9F7] flex flex-col items-center justify-center z-10">
            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-full border-4 border-[#E8E4DC]" />
              <div className="w-14 h-14 rounded-full border-4 border-transparent border-t-[#C5A34E] animate-spin absolute inset-0" />
            </div>
            <p
              className="text-sm font-semibold text-[#0B1D3A] mb-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Loading document...
            </p>
            <p
              className="text-xs text-[#829AB1]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Using {viewerType === "google" ? "Google Docs" : viewerType === "office" ? "Office Online" : "browser"} viewer
            </p>
          </div>
        )}

        {/* Error overlay */}
        {pdfError && (
          <div className="absolute inset-0 bg-[#FAF9F7] flex flex-col items-center justify-center z-10 px-6">
            <div className="w-14 h-14 rounded-full bg-[#0B1D3A]/5 border border-[#0B1D3A]/10 flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-[#829AB1]" />
            </div>
            <p
              className="text-sm font-semibold text-[#0B1D3A] mb-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Unable to load document
            </p>
            <p
              className="text-xs text-[#829AB1] mb-5 text-center max-w-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              The viewer couldn't display this PDF. Try switching viewers or download the file.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => {
                  if (viewerType === "google") switchViewer("office")
                  else if (viewerType === "office") switchViewer("direct")
                  else switchViewer("google")
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest bg-[#0B1D3A] text-white hover:bg-[#1B3A5C] transition-all duration-200"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Another Viewer
              </button>
              <button
                onClick={() => onDownload(publication)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all duration-200"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background: "linear-gradient(135deg, #C5A34E, #D4B555)",
                  color: "#0B1D3A",
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>
        )}

        {/* Iframe */}
        {viewerType && publication.file?.url && (
          <iframe
            key={`${publication._id}-${viewerType}`}
            src={getPdfUrl(publication.file.url)}
            className="w-full h-full border-0"
            style={{ minHeight: isFullscreen ? "calc(100vh - 120px)" : "600px" }}
            title={`PDF - ${publication.title}`}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>

      {/* ===== FOOTER ===== */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#FAF9F7] border-t border-[#E8E4DC] flex-shrink-0">
        <p
          className="text-[9px] sm:text-[10px] text-[#829AB1]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {viewerType === "google" && "Powered by Google Docs Viewer"}
          {viewerType === "office" && "Powered by Microsoft Office Online"}
          {viewerType === "direct" && "Using browser's built-in PDF viewer"}
        </p>
        <a
          href={publication.file?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] sm:text-[10px] font-semibold text-[#C5A34E] hover:underline transition-all duration-200"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Open in new tab →
        </a>
      </div>
    </div>
  )
}

// =========================================
// MOBILE PDF FALLBACK
// =========================================
const MobilePDFFallback = ({ publication, onDownload, formatDate, getFileSize }) => {
  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-md mx-auto">
        <div className="relative bg-gradient-to-br from-[#0B1D3A] to-[#1B3A5C] rounded-sm p-8 sm:p-12 mb-2 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(197,163,78,0.1) 20px, rgba(197,163,78,0.1) 21px)`,
            }}
          />
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[#C5A34E]/20" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-[#C5A34E]/20" />

          <div className="relative text-center">
            <div className="w-24 h-32 bg-white/10 backdrop-blur-sm rounded-sm border border-white/20 flex flex-col items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-[#C5A34E] mb-2" />
              <span className="font-['Inter',sans-serif] text-[9px] uppercase tracking-[0.2em] text-white/60">
                PDF Document
              </span>
            </div>
            <h4 className="font-['Cormorant_Garamond',serif] text-xl font-bold text-white mb-2">
              {publication.title}
            </h4>
            <div className="flex items-center justify-center gap-3 text-[#627D98]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-[#C5A34E]" />
                <span className="font-['Inter',sans-serif] text-[10px]">
                  {formatDate(publication.createdAt)}
                </span>
              </div>
              <span className="w-1 h-1 rounded-full bg-[#334E68]" />
              <span className="font-['Inter',sans-serif] text-[10px]">
                {getFileSize(publication)}
              </span>
            </div>
          </div>
        </div>

        {publication.description && (
          <div className="mb-6 bg-[#F4F1EB] rounded-sm p-4 border-l-2 border-[#C5A34E]">
            <p className="font-['Source_Serif_Pro',serif] text-sm text-[#486581] leading-relaxed">
              {publication.description}
            </p>
          </div>
        )}

        <div className="mb-6 bg-[#0B1D3A]/5 rounded-sm p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C5A34E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Info className="w-4 h-4 text-[#C5A34E]" />
            </div>
            <div>
              <p className="font-['Inter',sans-serif] text-xs font-semibold text-[#334E68] mb-1">
                View on Your Device
              </p>
              <p className="font-['Inter',sans-serif] text-[11px] text-[#627D98] leading-relaxed">
                For the best mobile reading experience, download the PDF or open it directly in your browser.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onDownload(publication)}
            className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-[12px] font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm shadow-[0_4px_14px_rgba(197,163,78,0.3)]"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>

          {publication.file?.url && (
            <>
              <a
                href={publication.file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#0B1D3A] text-white text-[12px] font-['Inter',sans-serif] font-semibold uppercase tracking-[0.15em] rounded-sm hover:bg-[#1B3A5C] transition-all duration-300"
              >
                <ExternalLink className="w-5 h-5 text-[#C5A34E]" />
                Open in Browser
              </a>
              <a
                href={`https://docs.google.com/gview?url=${encodeURIComponent(publication.file.url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 border border-[#D4CFC7] text-[#334E68] text-[12px] font-['Inter',sans-serif] font-medium uppercase tracking-[0.15em] rounded-sm hover:border-[#C5A34E] hover:text-[#C5A34E] transition-all duration-300"
              >
                <Eye className="w-5 h-5" />
                View with Google Docs
              </a>
            </>
          )}
        </div>

        <p className="text-center font-['Inter',sans-serif] text-[10px] text-[#829AB1] mt-6">
          Tip: Downloaded PDFs can be viewed in any PDF reader app
        </p>
      </div>
    </div>
  )
}

// =========================================
// MAIN PUBLICATIONS PAGE
// =========================================
const PublicationsPage = () => {
  const dispatch = useDispatch()
  const { publications = [], loading, error } = useSelector(
    (state) => state.publications
  )

  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewPublication, setViewPublication] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    dispatch(fetchPublications())
  }, [dispatch])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortBy])

  // When viewing inline, scroll to top
  useEffect(() => {
    if (viewPublication && !isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [viewPublication, isMobile])

  // Lock body scroll on mobile modal
  useEffect(() => {
    if (viewPublication && isMobile) {
      document.body.style.overflow = "hidden"
    } else if (!viewPublication) {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [viewPublication, isMobile])

  // Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setViewPublication(null)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  // =========================================
  // HELPERS
  // =========================================
  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatShortDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getFileSize = (pub) => {
    if (pub.fileSize) {
      const mb = (pub.fileSize / (1024 * 1024)).toFixed(1)
      return `${mb} MB`
    }
    return "PDF"
  }

  const handleDownload = (pub) => {
    if (pub.file?.url) {
      const link = document.createElement("a")
      link.href = pub.file.url
      link.download = `${pub.title || "publication"}.pdf`
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleView = (pub) => {
    setViewPublication(pub)
  }

  const handleCloseViewer = () => {
    setViewPublication(null)
  }

  // =========================================
  // FILTER & SORT
  // =========================================
  const filteredPublications = useMemo(() => {
    let result = [...publications]
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (pub) =>
          (pub.title || "").toLowerCase().includes(query) ||
          (pub.description || "").toLowerCase().includes(query)
      )
    }
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case "a-z":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""))
        break
      case "z-a":
        result.sort((a, b) => (b.title || "").localeCompare(a.title || ""))
        break
      default:
        break
    }
    return result
  }, [publications, searchQuery, sortBy])

  // =========================================
  // PAGINATION
  // =========================================
  const totalPages = Math.ceil(filteredPublications.length / ITEMS_PER_PAGE)
  const paginatedPublications = filteredPublications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

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
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
      pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  // =========================================
  // RENDER
  // =========================================
  return (
    <div className="min-h-screen bg-[#F4F1EB]">
      <Navbar />

      {/* ===== PAGE HEADER ===== */}
      <section className="relative bg-[#0B1D3A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#071222] via-[#0B1D3A] to-[#1B3A5C]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #C5A34E 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-8 right-8 w-20 h-20 border-t border-r border-[#C5A34E]/15 hidden lg:block" />
        <div className="absolute bottom-8 left-8 w-20 h-20 border-b border-l border-[#C5A34E]/15 hidden lg:block" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 md:py-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Link
                to="/"
                className="font-['Inter',sans-serif] text-[11px] uppercase tracking-[0.15em] text-[#627D98] hover:text-[#C5A34E] transition-colors duration-300"
              >
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-[#334E68]" />
              <span className="font-['Inter',sans-serif] text-[11px] uppercase tracking-[0.15em] text-[#C5A34E]">
                Publications
              </span>
            </div>

            <div className="w-16 h-16 rounded-full bg-[#1B3A5C] border border-[#334E68] flex items-center justify-center mx-auto mb-8">
              <BookOpen className="w-7 h-7 text-[#C5A34E]" />
            </div>

            <h1 className="font-['Cormorant_Garamond',serif] text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Publications
            </h1>

            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent mx-auto mb-6" />

            <p className="font-['Source_Serif_Pro',serif] text-base sm:text-lg text-[#9FB3C8] max-w-xl mx-auto">
              Explore published works, research papers, and official documents by Hon. Mike Oquaye.
            </p>
          </div>
        </div>

        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent opacity-40" />
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C5A34E]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 hidden lg:block" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 md:py-16">
          {/* ===== INLINE PDF VIEWER (Desktop) ===== */}
          {viewPublication && !isMobile && (
            <div className="mb-10" style={{ animation: "fadeInUp 0.5s ease-out" }}>
              <InlinePDFViewer
                publication={viewPublication}
                onClose={handleCloseViewer}
                formatDate={formatDate}
                getFileSize={getFileSize}
                onDownload={handleDownload}
              />
            </div>
          )}

          {/* ===== TOOLBAR ===== */}
          <div className="bg-white rounded-sm shadow-[0_1px_3px_rgba(11,29,58,0.08)] p-4 sm:p-6 mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#627D98]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search publications..."
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

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#627D98] pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-44 pl-10 pr-4 py-3 bg-[#F4F1EB] border border-[#D4CFC7] rounded-sm font-['Inter',sans-serif] text-sm text-[#0B1D3A] focus:outline-none focus:border-[#C5A34E] appearance-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="a-z">Title A–Z</option>
                    <option value="z-a">Title Z–A</option>
                  </select>
                </div>

                <div className="flex bg-[#F4F1EB] border border-[#D4CFC7] rounded-sm overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-[#0B1D3A] text-[#C5A34E]"
                        : "text-[#829AB1] hover:text-[#0B1D3A]"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-[#0B1D3A] text-[#C5A34E]"
                        : "text-[#829AB1] hover:text-[#0B1D3A]"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#F4F1EB] flex items-center justify-between">
              <p className="font-['Inter',sans-serif] text-[11px] text-[#829AB1] uppercase tracking-[0.1em]">
                Showing{" "}
                <span className="text-[#0B1D3A] font-semibold">
                  {paginatedPublications.length}
                </span>{" "}
                of{" "}
                <span className="text-[#0B1D3A] font-semibold">
                  {filteredPublications.length}
                </span>{" "}
                publications
                {searchQuery && (
                  <span className="text-[#C5A34E]"> for "{searchQuery}"</span>
                )}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="font-['Inter',sans-serif] text-[11px] text-[#C5A34E] uppercase tracking-[0.1em]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* ===== LOADING ===== */}
          {loading && (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                  : "space-y-4 sm:space-y-6"
              }
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-sm overflow-hidden shadow-sm animate-pulse">
                  <div className="h-44 sm:h-48 bg-[#D4CFC7] flex items-center justify-center">
                    <FileText className="w-10 h-10 text-[#B8B2A7]" />
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="w-24 h-3 bg-[#D4CFC7] rounded-full mb-4" />
                    <div className="w-full h-5 bg-[#D4CFC7] rounded-full mb-3" />
                    <div className="w-3/4 h-5 bg-[#D4CFC7] rounded-full mb-4" />
                    <div className="w-full h-3 bg-[#D4CFC7] rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== ERROR ===== */}
          {error && !loading && (
            <div className="text-center py-16 sm:py-20">
              <div className="w-16 h-16 rounded-full bg-[#0B1D3A] flex items-center justify-center mx-auto mb-6">
                <FileText className="w-7 h-7 text-[#C5A34E]" />
              </div>
              <h3 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#0B1D3A] mb-3">
                Unable to Load Publications
              </h3>
              <p className="font-['Inter',sans-serif] text-sm text-[#627D98] mb-6">
                {error?.message || "Something went wrong."}
              </p>
              <button
                onClick={() => dispatch(fetchPublications())}
                className="px-8 py-3 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-xs font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ===== EMPTY ===== */}
          {!loading && !error && filteredPublications.length === 0 && (
            <div className="text-center py-16 sm:py-20">
              <div className="w-16 h-16 rounded-full bg-[#0B1D3A] flex items-center justify-center mx-auto mb-6">
                {searchQuery ? (
                  <Search className="w-7 h-7 text-[#C5A34E]" />
                ) : (
                  <FileText className="w-7 h-7 text-[#C5A34E]" />
                )}
              </div>
              <h3 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#0B1D3A] mb-3">
                {searchQuery ? "No Publications Found" : "No Publications Yet"}
              </h3>
              <p className="font-['Source_Serif_Pro',serif] text-base text-[#627D98] mb-6">
                {searchQuery
                  ? `No publications match "${searchQuery}".`
                  : "Publications will appear here once uploaded."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-8 py-3 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-xs font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* ===== GRID VIEW ===== */}
          {!loading && !error && filteredPublications.length > 0 && viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedPublications.map((pub, index) => (
                <div
                  key={pub._id}
                  className={`group bg-white rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(11,29,58,0.08)] hover:shadow-[0_10px_40px_rgba(11,29,58,0.12)] transition-all duration-500 hover:-translate-y-1 ${
                    viewPublication?._id === pub._id
                      ? "ring-2 ring-[#C5A34E] ring-offset-2"
                      : ""
                  }`}
                >
                  <div className="relative h-44 sm:h-52 bg-gradient-to-br from-[#0B1D3A] to-[#1B3A5C] flex items-center justify-center overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-[0.05]"
                      style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(197,163,78,0.1) 20px, rgba(197,163,78,0.1) 21px)`,
                      }}
                    />
                    <div className="relative text-center">
                      <div className="w-20 h-24 bg-white/10 backdrop-blur-sm rounded-sm border border-white/20 flex flex-col items-center justify-center mb-3 mx-auto group-hover:scale-105 transition-transform duration-500">
                        <FileText className="w-8 h-8 text-[#C5A34E] mb-1" />
                        <span className="font-['Inter',sans-serif] text-[8px] uppercase tracking-[0.15em] text-white/60">
                          PDF
                        </span>
                      </div>
                      <p className="font-['Inter',sans-serif] text-[9px] uppercase tracking-[0.2em] text-[#627D98]">
                        {getFileSize(pub)}
                      </p>
                    </div>

                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0B1D3A]/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="font-['Inter',sans-serif] text-[9px] sm:text-[10px] font-bold text-[#C5A34E]">
                        {String((currentPage - 1) * ITEMS_PER_PAGE + index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 border-t border-r border-[#C5A34E]/20" />
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-1.5 text-[#C5A34E] mb-3">
                      <Calendar className="w-3 h-3" />
                      <span className="font-['Inter',sans-serif] text-[10px] font-medium">
                        {formatShortDate(pub.createdAt)}
                      </span>
                    </div>

                    <h3 className="font-['Cormorant_Garamond',serif] text-lg sm:text-xl font-bold text-[#0B1D3A] mb-3 leading-snug line-clamp-2 group-hover:text-[#C5A34E] transition-colors duration-300">
                      {pub.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-[1.5px] bg-[#C5A34E]" />
                      <div className="w-1 h-1 rotate-45 border border-[#C5A34E]/40" />
                    </div>

                    {pub.description && (
                      <p className="font-['Source_Serif_Pro',serif] text-sm text-[#627D98] leading-relaxed line-clamp-2 sm:line-clamp-3 mb-5">
                        {pub.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 sm:gap-3 pt-4 border-t border-[#F4F1EB]">
                      <button
                        onClick={() => handleView(pub)}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 text-[9px] sm:text-[10px] font-['Inter',sans-serif] font-semibold uppercase tracking-[0.12em] rounded-sm transition-all duration-300 ${
                          viewPublication?._id === pub._id
                            ? "bg-[#C5A34E] text-[#0B1D3A]"
                            : "bg-[#0B1D3A] text-white hover:bg-[#1B3A5C]"
                        }`}
                      >
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        {viewPublication?._id === pub._id ? "Viewing" : "Read"}
                      </button>

                      <button
                        onClick={() => handleDownload(pub)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-[9px] sm:text-[10px] font-['Inter',sans-serif] font-bold uppercase tracking-[0.12em] rounded-sm hover:from-[#D4B555] hover:to-[#E2C96E] transition-all duration-300"
                      >
                        <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== LIST VIEW ===== */}
          {!loading && !error && filteredPublications.length > 0 && viewMode === "list" && (
            <div className="space-y-4 sm:space-y-5">
              {paginatedPublications.map((pub, index) => (
                <div
                  key={pub._id}
                  className={`group flex flex-col sm:flex-row gap-4 sm:gap-5 bg-white rounded-sm p-4 sm:p-5 shadow-[0_1px_3px_rgba(11,29,58,0.08)] hover:shadow-[0_10px_40px_rgba(11,29,58,0.12)] transition-all duration-500 hover:-translate-y-0.5 ${
                    viewPublication?._id === pub._id
                      ? "ring-2 ring-[#C5A34E] ring-offset-2"
                      : ""
                  }`}
                >
                  <div className="relative w-full sm:w-28 h-28 sm:h-auto flex-shrink-0 rounded-sm overflow-hidden bg-gradient-to-br from-[#0B1D3A] to-[#1B3A5C] flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-[#C5A34E] mx-auto mb-1" />
                      <span className="font-['Inter',sans-serif] text-[8px] uppercase tracking-[0.15em] text-white/60">
                        PDF
                      </span>
                    </div>
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#0B1D3A]/70 backdrop-blur-sm flex items-center justify-center">
                      <span className="font-['Inter',sans-serif] text-[9px] font-bold text-[#C5A34E]">
                        {String((currentPage - 1) * ITEMS_PER_PAGE + index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1.5 text-[#C5A34E]">
                          <Calendar className="w-3 h-3" />
                          <span className="font-['Inter',sans-serif] text-[10px] font-medium">
                            {formatDate(pub.createdAt)}
                          </span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-[#D4CFC7]" />
                        <span className="font-['Inter',sans-serif] text-[10px] text-[#829AB1]">
                          {getFileSize(pub)}
                        </span>
                      </div>

                      <h3 className="font-['Cormorant_Garamond',serif] text-lg sm:text-xl font-bold text-[#0B1D3A] mb-2 leading-snug group-hover:text-[#C5A34E] transition-colors duration-300">
                        {pub.title}
                      </h3>

                      {pub.description && (
                        <p className="font-['Source_Serif_Pro',serif] text-sm text-[#627D98] leading-relaxed line-clamp-2">
                          {pub.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                      <button
                        onClick={() => handleView(pub)}
                        className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-[9px] sm:text-[10px] font-['Inter',sans-serif] font-semibold uppercase tracking-[0.12em] rounded-sm transition-all duration-300 ${
                          viewPublication?._id === pub._id
                            ? "bg-[#C5A34E] text-[#0B1D3A]"
                            : "bg-[#0B1D3A] text-white hover:bg-[#1B3A5C]"
                        }`}
                      >
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        {viewPublication?._id === pub._id ? "Viewing" : "Read"}
                      </button>

                      <button
                        onClick={() => handleDownload(pub)}
                        className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-[9px] sm:text-[10px] font-['Inter',sans-serif] font-bold uppercase tracking-[0.12em] rounded-sm transition-all duration-300"
                      >
                        <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Download
                      </button>

                      {pub.file?.url && (
                        <a
                          href={pub.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-[#D4CFC7] text-[#627D98] text-[9px] sm:text-[10px] font-['Inter',sans-serif] font-medium uppercase tracking-[0.12em] rounded-sm hover:border-[#C5A34E] hover:text-[#C5A34E] transition-all duration-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== PAGINATION ===== */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-10 sm:mt-14">
              <div className="h-px bg-gradient-to-r from-transparent via-[#D4CFC7] to-transparent mb-8 sm:mb-10" />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <p className="font-['Inter',sans-serif] text-[11px] text-[#829AB1] uppercase tracking-[0.1em]">
                  Page{" "}
                  <span className="text-[#0B1D3A] font-semibold">{currentPage}</span> of{" "}
                  <span className="text-[#0B1D3A] font-semibold">{totalPages}</span>
                </p>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm border border-[#D4CFC7] flex items-center justify-center text-[#627D98] hover:border-[#C5A34E] hover:text-[#C5A34E] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {getPageNumbers().map((page, i) =>
                    page === "..." ? (
                      <span key={`d-${i}`} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#829AB1] text-sm">
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
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm border border-[#D4CFC7] flex items-center justify-center text-[#627D98] hover:border-[#C5A34E] hover:text-[#C5A34E] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="hidden sm:block w-20" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== MOBILE MODAL ===== */}
      {viewPublication && isMobile && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-[#0B1D3A]/80 backdrop-blur-sm"
            onClick={() => setViewPublication(null)}
          />
          <div
            className="relative w-full max-h-[95vh] bg-white rounded-t-lg shadow-[0_20px_60px_rgba(11,29,58,0.4)] overflow-hidden flex flex-col"
            style={{ animation: "slideUp 0.4s ease-out" }}
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F4F1EB] bg-[#FAF9F7] flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#0B1D3A] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-[#C5A34E]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-['Cormorant_Garamond',serif] text-base font-bold text-[#0B1D3A] line-clamp-1">
                    {viewPublication.title}
                  </h3>
                  <p className="font-['Inter',sans-serif] text-[9px] text-[#829AB1] uppercase tracking-[0.1em]">
                    {formatDate(viewPublication.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewPublication(null)}
                className="w-9 h-9 rounded-full bg-[#F4F1EB] text-[#627D98] hover:text-[#0B1D3A] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-auto">
              <MobilePDFFallback
                publication={viewPublication}
                onDownload={handleDownload}
                formatDate={formatDate}
                getFileSize={getFileSize}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* ===== ANIMATIONS ===== */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default PublicationsPage