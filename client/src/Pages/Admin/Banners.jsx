import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchBanners,
  addBanner,
  editBanner,
  removeBanner,
} from "../../redux/slice/bannerSlice"
import {
  ImageIcon,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Loader2,
  Search,
  ExternalLink,
  GalleryHorizontalEnd,
  Type,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
} from "lucide-react"

const AdminBanners = () => {
  const dispatch = useDispatch()
  const { banners, loading, error } = useSelector((state) => state.banners)
  const formRef = useRef(null)

  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [editId, setEditId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [notification, setNotification] = useState(null)
  const [showForm, setShowForm] = useState(false)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxZoomed, setLightboxZoomed] = useState(false)

  useEffect(() => {
    dispatch(fetchBanners())
  }, [dispatch])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // Close lightbox on Escape, navigate with arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return

      switch (e.key) {
        case "Escape":
          closeLightbox()
          break
        case "ArrowLeft":
          navigateLightbox("prev")
          break
        case "ArrowRight":
          navigateLightbox("next")
          break
        default:
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen, lightboxIndex])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [lightboxOpen])

  const showNotification = (type, message) => {
    setNotification({ type, message })
  }

  // ================================
  // LIGHTBOX HANDLERS
  // ================================
  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
    setLightboxZoomed(false)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setLightboxZoomed(false)
  }

  const navigateLightbox = (direction) => {
    setLightboxZoomed(false)
    const imagesWithUrl = filteredBanners.filter((b) => b.image?.url)
    if (imagesWithUrl.length <= 1) return

    if (direction === "next") {
      setLightboxIndex((prev) =>
        prev >= imagesWithUrl.length - 1 ? 0 : prev + 1
      )
    } else {
      setLightboxIndex((prev) =>
        prev <= 0 ? imagesWithUrl.length - 1 : prev - 1
      )
    }
  }

  const toggleZoom = () => {
    setLightboxZoomed((prev) => !prev)
  }

  // ================================
  // IMAGE CHANGE
  // ================================
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  // ================================
  // SUBMIT FORM
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title) {
      showNotification("error", "Title is required")
      return
    }

    setSubmitting(true)

    const formData = new FormData()
    formData.append("title", title)
    formData.append("link", link)
    if (image) formData.append("image", image)

    try {
      if (editId) {
        const result = await dispatch(editBanner({ id: editId, formData }))
        if (result.meta.requestStatus === "fulfilled") {
          showNotification("success", "Gallery image updated successfully!")
        } else {
          showNotification("error", "Failed to update gallery image")
        }
        setEditId(null)
      } else {
        const result = await dispatch(addBanner(formData))
        if (result.meta.requestStatus === "fulfilled") {
          showNotification("success", "Gallery image added successfully!")
        } else {
          showNotification("error", "Failed to add gallery image")
        }
      }
      resetForm()
      setShowForm(false)
    } catch (err) {
      showNotification("error", "An unexpected error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  // ================================
  // EDIT
  // ================================
  const handleEdit = (banner) => {
    setEditId(banner._id)
    setTitle(banner.title)
    setLink(banner.link || "")
    setImage(null)
    setPreview(banner.image?.url || null)
    setShowForm(true)

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  // ================================
  // DELETE
  // ================================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery image?"))
      return

    setDeletingId(id)
    try {
      const result = await dispatch(removeBanner(id))
      if (result.meta.requestStatus === "fulfilled") {
        showNotification("success", "Gallery image deleted successfully!")
      } else {
        showNotification("error", "Failed to delete gallery image")
      }
    } catch {
      showNotification("error", "An unexpected error occurred")
    } finally {
      setDeletingId(null)
    }
  }

  const resetForm = () => {
    setTitle("")
    setLink("")
    setImage(null)
    setPreview(null)
    setEditId(null)
  }

  // Filter
  const filteredBanners = banners.filter((banner) =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get banners that have images for lightbox navigation
  const bannersWithImages = filteredBanners.filter((b) => b.image?.url)
  const currentLightboxBanner = bannersWithImages[lightboxIndex]

  return (
    <div className="min-h-full">
      {/* ===== NOTIFICATION ===== */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-2xl border transition-all duration-500 ${
            notification.type === "success"
              ? "bg-[#0B1D3A] border-emerald-500/30 text-emerald-400"
              : "bg-[#0B1D3A] border-red-500/30 text-red-400"
          }`}
          style={{
            animation: "slideIn 0.4s ease-out",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-3 text-white/40 hover:text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-lg overflow-hidden">
            <div
              className={`h-full rounded-b-lg ${
                notification.type === "success"
                  ? "bg-emerald-500"
                  : "bg-red-500"
              }`}
              style={{ animation: "progress 4s linear" }}
            />
          </div>
        </div>
      )}

      {/* ===== IMAGE LIGHTBOX ===== */}
      {lightboxOpen && currentLightboxBanner && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          />

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4">
            {/* Image info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-4 h-4 text-[#C5A34E]" />
              </div>
              <div className="min-w-0">
                <h3
                  className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {currentLightboxBanner.title}
                </h3>
                <p
                  className="text-[10px] text-white/40"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {lightboxIndex + 1} of {bannersWithImages.length}
                </p>
              </div>
            </div>

            {/* Top actions */}
            <div className="flex items-center gap-2">
              {/* Zoom toggle */}
              <button
                onClick={toggleZoom}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  lightboxZoomed
                    ? "bg-[#C5A34E] text-[#0B1D3A]"
                    : "bg-white/10 border border-white/10 text-white/60 hover:text-white hover:bg-white/20"
                }`}
                title={lightboxZoomed ? "Zoom out" : "Zoom in"}
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Download */}
              <a
                href={currentLightboxBanner.image.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-200"
                title="Download image"
              >
                <Download className="w-4 h-4" />
              </a>

              {/* Close */}
              <button
                onClick={closeLightbox}
                className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500/80 hover:border-red-500/80 transition-all duration-200"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          {bannersWithImages.length > 1 && (
            <>
              <button
                onClick={() => navigateLightbox("prev")}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 hover:border-[#C5A34E]/30 transition-all duration-200"
                title="Previous (←)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateLightbox("next")}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 hover:border-[#C5A34E]/30 transition-all duration-200"
                title="Next (→)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div
            className={`relative z-[5] flex items-center justify-center px-12 sm:px-20 py-20 w-full h-full transition-all duration-300 ${
              lightboxZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeLightbox()
            }}
          >
            <img
              src={currentLightboxBanner.image.url}
              alt={currentLightboxBanner.title}
              className={`rounded-lg shadow-2xl transition-all duration-500 select-none ${
                lightboxZoomed
                  ? "max-w-none w-auto max-h-none scale-150"
                  : "max-w-full max-h-[75vh] object-contain"
              }`}
              onClick={toggleZoom}
              draggable={false}
              style={{ animation: "lightboxImageIn 0.4s ease-out" }}
            />
          </div>

          {/* Bottom Thumbnails */}
          {bannersWithImages.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 py-4">
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 scrollbar-hide">
                {bannersWithImages.map((banner, idx) => (
                  <button
                    key={banner._id}
                    onClick={() => {
                      setLightboxIndex(idx)
                      setLightboxZoomed(false)
                    }}
                    className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      idx === lightboxIndex
                        ? "border-[#C5A34E] opacity-100 scale-110 shadow-[0_0_12px_rgba(197,163,78,0.4)]"
                        : "border-white/10 opacity-40 hover:opacity-70 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={banner.image.url}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== PAGE HEADER ===== */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(197,163,78,0.15), rgba(197,163,78,0.05))",
              border: "1px solid rgba(197,163,78,0.2)",
            }}
          >
            <GalleryHorizontalEnd className="w-5 h-5 text-[#C5A34E]" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-[#0B1D3A]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Gallery Management
            </h1>
            <p
              className="text-xs text-[#627D98] uppercase tracking-widest"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Upload, edit, and manage gallery images
            </p>
          </div>
        </div>
      </div>

      {/* ===== TOOLBAR ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#627D98]" />
          <input
            type="text"
            placeholder="Search gallery..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9FC] border border-[#E4E7EB] rounded-lg text-sm text-[#0B1D3A] placeholder-[#9FB3C8] focus:outline-none focus:ring-2 focus:ring-[#C5A34E]/30 focus:border-[#C5A34E] transition-all duration-300"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) resetForm()
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg"
          style={{
            fontFamily: "'Inter', sans-serif",
            background: showForm
              ? "#E4E7EB"
              : "linear-gradient(135deg, #C5A34E, #D4B555)",
            color: showForm ? "#627D98" : "#0B1D3A",
          }}
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" />
              Close Form
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Image
            </>
          )}
        </button>
      </div>

      {/* ===== GALLERY FORM ===== */}
      {showForm && (
        <div
          ref={formRef}
          className="mb-8 rounded-xl overflow-hidden border border-[#E4E7EB] shadow-sm"
          style={{ animation: "fadeInUp 0.4s ease-out" }}
        >
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, #0B1D3A, #122B4D)",
            }}
          >
            <div className="w-8 h-8 rounded-full bg-[#C5A34E]/10 border border-[#C5A34E]/20 flex items-center justify-center">
              {editId ? (
                <Pencil className="w-4 h-4 text-[#C5A34E]" />
              ) : (
                <Plus className="w-4 h-4 text-[#C5A34E]" />
              )}
            </div>
            <div>
              <h2
                className="text-lg font-bold text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {editId ? "Edit Gallery Image" : "Add New Gallery Image"}
              </h2>
              <p
                className="text-[10px] text-[#627D98] uppercase tracking-widest"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {editId
                  ? "Update the image details below"
                  : "Upload a new image to the gallery"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 bg-white space-y-5">
            <div>
              <label
                className="block text-[10px] font-semibold uppercase tracking-widest text-[#627D98] mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Image Title
              </label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9FB3C8]" />
                <input
                  type="text"
                  placeholder="Enter a descriptive title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#F7F9FC] border border-[#E4E7EB] rounded-lg text-sm text-[#0B1D3A] placeholder-[#9FB3C8] focus:outline-none focus:ring-2 focus:ring-[#C5A34E]/30 focus:border-[#C5A34E] transition-all duration-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-[10px] font-semibold uppercase tracking-widest text-[#627D98] mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Link{" "}
                <span className="text-[#9FB3C8] normal-case tracking-normal">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9FB3C8]" />
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#F7F9FC] border border-[#E4E7EB] rounded-lg text-sm text-[#0B1D3A] placeholder-[#9FB3C8] focus:outline-none focus:ring-2 focus:ring-[#C5A34E]/30 focus:border-[#C5A34E] transition-all duration-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-[10px] font-semibold uppercase tracking-widest text-[#627D98] mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Gallery Image
              </label>

              {preview ? (
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-[#C5A34E]/20 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null)
                      setPreview(null)
                    }}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-[#E4E7EB] rounded-lg cursor-pointer hover:border-[#C5A34E]/40 hover:bg-[#C5A34E]/[0.02] transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-full bg-[#C5A34E]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-[#C5A34E]" />
                  </div>
                  <span
                    className="text-sm font-medium text-[#627D98]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Click to upload or drag and drop
                  </span>
                  <span
                    className="text-[10px] text-[#9FB3C8] mt-1"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    PNG, JPG, WEBP up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background: "linear-gradient(135deg, #C5A34E, #D4B555)",
                  color: "#0B1D3A",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editId ? "Updating..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    {editId ? (
                      <Pencil className="w-4 h-4" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {editId ? "Update Image" : "Upload Image"}
                  </>
                )}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null)
                    resetForm()
                    setShowForm(false)
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#F7F9FC] border border-[#E4E7EB] rounded-lg text-[11px] font-semibold uppercase tracking-widest text-[#627D98] hover:bg-[#E4E7EB] transition-all duration-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ===== GALLERY LIST ===== */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2
            className="text-lg font-bold text-[#0B1D3A]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Gallery Images
          </h2>
          <span
            className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              fontFamily: "'Inter', sans-serif",
              background:
                "linear-gradient(135deg, rgba(197,163,78,0.15), rgba(197,163,78,0.05))",
              color: "#C5A34E",
              border: "1px solid rgba(197,163,78,0.2)",
            }}
          >
            {filteredBanners.length}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading && !submitting && (
        <div
          className="flex flex-col items-center justify-center py-20"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-[#E4E7EB]"></div>
            <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-[#C5A34E] animate-spin absolute inset-0"></div>
          </div>
          <p
            className="text-sm font-semibold text-[#0B1D3A]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Loading gallery...
          </p>
          <p
            className="text-xs text-[#627D98] mt-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Please wait a moment
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div
          className="flex flex-col items-center justify-center py-16 px-6"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <p
            className="text-sm font-semibold text-red-600 mb-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Failed to load gallery
          </p>
          <p
            className="text-xs text-[#627D98] mb-4 text-center"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {typeof error === "string"
              ? error
              : "Something went wrong. Please try again."}
          </p>
          <button
            onClick={() => dispatch(fetchBanners())}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300"
            style={{
              fontFamily: "'Inter', sans-serif",
              background: "linear-gradient(135deg, #C5A34E, #D4B555)",
              color: "#0B1D3A",
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredBanners.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="w-16 h-16 rounded-full bg-[#F7F9FC] border border-[#E4E7EB] flex items-center justify-center mb-4">
            <ImageIcon className="w-7 h-7 text-[#9FB3C8]" />
          </div>
          <p
            className="text-sm font-semibold text-[#0B1D3A] mb-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {searchTerm ? "No images found" : "No gallery images yet"}
          </p>
          <p
            className="text-xs text-[#627D98] mb-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {searchTerm
              ? "Try adjusting your search terms"
              : "Upload your first image to get started"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300 shadow-md"
              style={{
                fontFamily: "'Inter', sans-serif",
                background: "linear-gradient(135deg, #C5A34E, #D4B555)",
                color: "#0B1D3A",
              }}
            >
              <Plus className="w-4 h-4" />
              Add Image
            </button>
          )}
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && !error && filteredBanners.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBanners.map((banner, index) => {
            // Find the index in bannersWithImages for lightbox
            const lightboxIdx = bannersWithImages.findIndex(
              (b) => b._id === banner._id
            )

            return (
              <div
                key={banner._id}
                className="group bg-white border border-[#E4E7EB] rounded-xl overflow-hidden hover:border-[#C5A34E]/30 hover:shadow-xl transition-all duration-300"
                style={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.06}s both`,
                }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-[#F7F9FC]">
                  {banner.image?.url ? (
                    <>
                      <img
                        src={banner.image.url}
                        alt={banner.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-[#E4E7EB]" />
                    </div>
                  )}

                  {/* Action buttons overlay */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    {/* Zoom / View button */}
                    {banner.image?.url && (
                      <button
                        onClick={() => openLightbox(lightboxIdx)}
                        className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm border border-white/50 flex items-center justify-center text-[#0B1D3A] hover:bg-[#C5A34E] hover:text-white shadow-lg transition-all duration-200"
                        title="View full size"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleEdit(banner)}
                      className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm border border-white/50 flex items-center justify-center text-[#C5A34E] hover:bg-[#C5A34E] hover:text-white shadow-lg transition-all duration-200"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      disabled={deletingId === banner._id}
                      className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm border border-white/50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white shadow-lg transition-all duration-200 disabled:opacity-60"
                    >
                      {deletingId === banner._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Zoom icon center (subtle) */}
                  {banner.image?.url && (
                    <button
                      onClick={() => openLightbox(lightboxIdx)}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-zoom-in"
                    >
                      <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/20 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3
                    className="text-base font-bold text-[#0B1D3A] mb-1 line-clamp-1 group-hover:text-[#C5A34E] transition-colors duration-300"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {banner.title}
                  </h3>

                  {banner.link && (
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#627D98] hover:text-[#C5A34E] transition-colors duration-300 mt-1"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate max-w-[200px]">
                        {banner.link}
                      </span>
                    </a>
                  )}

                  {banner.createdAt && (
                    <p
                      className="text-[10px] text-[#9FB3C8] mt-2 uppercase tracking-wider"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {new Date(banner.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}

                  {/* Mobile actions */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F0F2F5] sm:hidden">
                    {banner.image?.url && (
                      <button
                        onClick={() => openLightbox(lightboxIdx)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 bg-[#0B1D3A] text-white"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        <ZoomIn className="w-3 h-3" />
                        View
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(banner)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        background:
                          "linear-gradient(135deg, rgba(197,163,78,0.1), rgba(197,163,78,0.03))",
                        borderColor: "rgba(197,163,78,0.2)",
                        color: "#C5A34E",
                      }}
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      disabled={deletingId === banner._id}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-60"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {deletingId === banner._id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ===== ANIMATIONS ===== */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

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

        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }

        @keyframes lightboxImageIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default AdminBanners