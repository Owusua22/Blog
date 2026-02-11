import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchPublications,
  addPublication,
  editPublication,
  removePublication,
} from "../../redux/slice/publicationSlice"
import {
  BookCopy,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
  Eye,
  Download,
  FileText,
  Type,
  AlignLeft,
  RefreshCw,
} from "lucide-react"

const AdminPublications = () => {
  const dispatch = useDispatch()
  const formRef = useRef(null)

  const { publications = [], loading, error } = useSelector(
    (state) => state.publications
  )

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [pdf, setPdf] = useState(null)
  const [pdfName, setPdfName] = useState("")
  const [editId, setEditId] = useState(null)
  const [viewPublication, setViewPublication] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [notification, setNotification] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState(false)
  const [viewerType, setViewerType] = useState("google")

  useEffect(() => {
    dispatch(fetchPublications())
  }, [dispatch])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // Reset PDF states when modal opens
  useEffect(() => {
    if (viewPublication) {
      setPdfLoading(true)
      setPdfError(false)
      setViewerType("google")
    }
  }, [viewPublication])

  const showNotification = (type, message) => {
    setNotification({ type, message })
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setPdf(null)
    setPdfName("")
    setEditId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      showNotification("error", "Title is required")
      return
    }

    if (!editId && !pdf) {
      showNotification("error", "PDF file is required")
      return
    }

    setSubmitting(true)

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    if (pdf) formData.append("file", pdf)

    try {
      if (editId) {
        const result = await dispatch(editPublication({ id: editId, formData }))
        if (result.meta.requestStatus === "fulfilled") {
          showNotification("success", "Publication updated successfully!")
        } else {
          showNotification("error", "Failed to update publication")
        }
      } else {
        const result = await dispatch(addPublication(formData))
        if (result.meta.requestStatus === "fulfilled") {
          showNotification("success", "Publication uploaded successfully!")
        } else {
          showNotification("error", "Failed to upload publication")
        }
      }

      resetForm()
      setShowForm(false)
      dispatch(fetchPublications())
    } catch (err) {
      showNotification("error", "An unexpected error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (publication) => {
    setEditId(publication._id)
    setTitle(publication.title)
    setDescription(publication.description || "")
    setPdf(null)
    setPdfName("")
    setShowForm(true)

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this publication?"))
      return

    setDeletingId(id)
    try {
      const result = await dispatch(removePublication(id))
      if (result.meta.requestStatus === "fulfilled") {
        showNotification("success", "Publication deleted successfully!")
        dispatch(fetchPublications())
      } else {
        showNotification("error", "Failed to delete publication")
      }
    } catch {
      showNotification("error", "An unexpected error occurred")
    } finally {
      setDeletingId(null)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPdf(file)
    setPdfName(file.name)
  }

  // ================================
  // PDF VIEWER HELPERS
  // ================================
  const getPdfViewerUrl = (url) => {
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

  const handlePdfLoad = () => {
    setPdfLoading(false)
    setPdfError(false)
  }

  const handlePdfError = () => {
    setPdfLoading(false)
    setPdfError(true)
  }

  const retryPdfLoad = () => {
    setPdfLoading(true)
    setPdfError(false)
    // Force iframe reload by briefly clearing and re-setting
    const currentPub = viewPublication
    setViewPublication(null)
    setTimeout(() => setViewPublication(currentPub), 50)
  }

  const switchViewer = (type) => {
    setViewerType(type)
    setPdfLoading(true)
    setPdfError(false)
  }

  const filteredPublications = publications.filter(
    (pub) =>
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pub.description &&
        pub.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
            <BookCopy className="w-5 h-5 text-[#C5A34E]" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-[#0B1D3A]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Publication Management
            </h1>
            <p
              className="text-xs text-[#627D98] uppercase tracking-widest"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Upload, edit, and manage publications
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
            placeholder="Search publications..."
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
              New Publication
            </>
          )}
        </button>
      </div>

      {/* ===== PUBLICATION FORM ===== */}
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
                <Upload className="w-4 h-4 text-[#C5A34E]" />
              )}
            </div>
            <div>
              <h2
                className="text-lg font-bold text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {editId ? "Edit Publication" : "Upload New Publication"}
              </h2>
              <p
                className="text-[10px] text-[#627D98] uppercase tracking-widest"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {editId
                  ? "Update the publication details below"
                  : "Fill in the details and upload a PDF"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 bg-white space-y-5">
            <div>
              <label
                className="block text-[10px] font-semibold uppercase tracking-widest text-[#627D98] mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Publication Title
              </label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9FB3C8]" />
                <input
                  type="text"
                  placeholder="Enter publication title..."
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
                Description{" "}
                <span className="text-[#9FB3C8] normal-case tracking-normal">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-[#9FB3C8]" />
                <textarea
                  placeholder="Write a brief description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full pl-11 pr-4 py-3 bg-[#F7F9FC] border border-[#E4E7EB] rounded-lg text-sm text-[#0B1D3A] placeholder-[#9FB3C8] focus:outline-none focus:ring-2 focus:ring-[#C5A34E]/30 focus:border-[#C5A34E] transition-all duration-300 resize-vertical"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-[10px] font-semibold uppercase tracking-widest text-[#627D98] mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                PDF File
                {editId && (
                  <span className="text-[#9FB3C8] normal-case tracking-normal ml-1">
                    (leave empty to keep current)
                  </span>
                )}
              </label>

              {pdfName ? (
                <div className="flex items-center gap-3 p-4 bg-[#F7F9FC] border border-[#E4E7EB] rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium text-[#0B1D3A] truncate"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {pdfName}
                    </p>
                    <p
                      className="text-[10px] text-[#9FB3C8]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      PDF Document
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPdf(null)
                      setPdfName("")
                    }}
                    className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#E4E7EB] rounded-lg cursor-pointer hover:border-[#C5A34E]/40 hover:bg-[#C5A34E]/[0.02] transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-full bg-[#C5A34E]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-[#C5A34E]" />
                  </div>
                  <span
                    className="text-sm font-medium text-[#627D98]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Click to upload PDF file
                  </span>
                  <span
                    className="text-[10px] text-[#9FB3C8] mt-1"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    PDF files only, up to 50MB
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
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
                    {editId ? "Update Publication" : "Upload Publication"}
                  </>
                )}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={() => {
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

      {/* ===== PUBLICATIONS LIST HEADER ===== */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2
            className="text-lg font-bold text-[#0B1D3A]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            All Publications
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
            {filteredPublications.length}
          </span>
        </div>
      </div>

      {/* Loading */}
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
            Loading publications...
          </p>
          <p
            className="text-xs text-[#627D98] mt-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Please wait a moment
          </p>
        </div>
      )}

      {/* Error */}
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
            Failed to load publications
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
            onClick={() => dispatch(fetchPublications())}
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

      {/* Empty */}
      {!loading && !error && filteredPublications.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="w-16 h-16 rounded-full bg-[#F7F9FC] border border-[#E4E7EB] flex items-center justify-center mb-4">
            <BookCopy className="w-7 h-7 text-[#9FB3C8]" />
          </div>
          <p
            className="text-sm font-semibold text-[#0B1D3A] mb-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {searchTerm ? "No publications found" : "No publications yet"}
          </p>
          <p
            className="text-xs text-[#627D98] mb-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {searchTerm
              ? "Try adjusting your search terms"
              : "Upload your first publication to get started"}
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
              Upload Publication
            </button>
          )}
        </div>
      )}

      {/* Publications List */}
      {!loading && !error && filteredPublications.length > 0 && (
        <div className="space-y-4">
          {filteredPublications.map((pub, index) => (
            <div
              key={pub._id}
              className="group bg-white border border-[#E4E7EB] rounded-xl overflow-hidden hover:border-[#C5A34E]/30 hover:shadow-lg transition-all duration-300"
              style={{
                animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
              }}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-32 h-28 sm:h-auto flex-shrink-0 bg-gradient-to-br from-[#0B1D3A] to-[#122B4D] flex items-center justify-center relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, #C5A34E 1px, transparent 0)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                  <div className="relative flex flex-col items-center">
                    <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-1">
                      <FileText className="w-6 h-6 text-red-400" />
                    </div>
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest text-[#627D98]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      PDF
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3
                        className="text-lg font-bold text-[#0B1D3A] group-hover:text-[#C5A34E] transition-colors duration-300 line-clamp-1"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                        }}
                      >
                        {pub.title}
                      </h3>

                      {pub.createdAt && (
                        <span
                          className="flex-shrink-0 text-[10px] font-medium text-[#627D98] bg-[#F7F9FC] px-2 py-1 rounded-md border border-[#E4E7EB]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {new Date(pub.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    {pub.description && (
                      <p
                        className="text-sm text-[#627D98] leading-relaxed line-clamp-2"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {pub.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => setViewPublication(pub)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 bg-[#0B1D3A] text-white hover:bg-[#122B4D]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>

                    <button
                      onClick={() => handleEdit(pub)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        background:
                          "linear-gradient(135deg, rgba(197,163,78,0.1), rgba(197,163,78,0.03))",
                        borderColor: "rgba(197,163,78,0.2)",
                        color: "#C5A34E",
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(pub._id)}
                      disabled={deletingId === pub._id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {deletingId === pub._id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== VIEW PDF MODAL ===== */}
      {viewPublication && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          style={{ animation: "fadeIn 0.3s ease-out" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewPublication(null)
          }}
        >
          <div
            className="bg-white w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl flex flex-col"
            style={{
              animation: "fadeInUp 0.4s ease-out",
              maxHeight: "90vh",
            }}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-4 flex items-center justify-between flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #0B1D3A, #122B4D)",
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-400" />
                </div>
                <div className="min-w-0">
                  <h2
                    className="text-lg font-bold text-white line-clamp-1"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {viewPublication.title}
                  </h2>
                  {viewPublication.description && (
                    <p
                      className="text-xs text-[#627D98] line-clamp-1"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {viewPublication.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setViewPublication(null)}
                className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300 flex-shrink-0 ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewer Toolbar */}
            {viewPublication.file?.url && (
              <div className="px-6 py-3 bg-[#F7F9FC] border-b border-[#E4E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-shrink-0">
                {/* Viewer Switcher */}
                <div className="flex items-center gap-1">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest text-[#627D98] mr-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Viewer:
                  </span>
                  {[
                    { key: "google", label: "Google Docs" },
                    { key: "office", label: "Office Online" },
                    { key: "direct", label: "Direct" },
                  ].map((viewer) => (
                    <button
                      key={viewer.key}
                      onClick={() => switchViewer(viewer.key)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 ${
                        viewerType === viewer.key
                          ? "bg-[#0B1D3A] text-[#C5A34E] shadow-sm"
                          : "bg-white border border-[#E4E7EB] text-[#627D98] hover:border-[#C5A34E]/30 hover:text-[#C5A34E]"
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {viewer.label}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={retryPdfLoad}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white border border-[#E4E7EB] text-[#627D98] hover:border-[#C5A34E]/30 hover:text-[#C5A34E] transition-all duration-200"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reload
                  </button>

                  <a
                    href={viewPublication.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 shadow-sm"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      background:
                        "linear-gradient(135deg, #C5A34E, #D4B555)",
                      color: "#0B1D3A",
                    }}
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </a>
                </div>
              </div>
            )}

            {/* PDF Viewer Area */}
            {viewPublication.file?.url ? (
              <div className="relative flex-1 bg-[#525659]" style={{ minHeight: "600px" }}>
                {/* Loading Overlay */}
                {pdfLoading && (
                  <div className="absolute inset-0 bg-[#F7F9FC] flex flex-col items-center justify-center z-10">
                    <div className="relative mb-4">
                      <div className="w-12 h-12 rounded-full border-4 border-[#E4E7EB]"></div>
                      <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-[#C5A34E] animate-spin absolute inset-0"></div>
                    </div>
                    <p
                      className="text-sm font-semibold text-[#0B1D3A]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Loading PDF...
                    </p>
                    <p
                      className="text-xs text-[#627D98] mt-1"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      This may take a few seconds
                    </p>
                  </div>
                )}

                {/* Error Overlay */}
                {pdfError && (
                  <div className="absolute inset-0 bg-[#F7F9FC] flex flex-col items-center justify-center z-10">
                    <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                      <AlertCircle className="w-7 h-7 text-red-400" />
                    </div>
                    <p
                      className="text-sm font-semibold text-[#0B1D3A] mb-1"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Unable to load PDF
                    </p>
                    <p
                      className="text-xs text-[#627D98] mb-4 text-center max-w-sm"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      The viewer couldn't display this PDF. Try switching to a
                      different viewer or download the file directly.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (viewerType === "google") switchViewer("office")
                          else if (viewerType === "office")
                            switchViewer("direct")
                          else switchViewer("google")
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-[#0B1D3A] text-white hover:bg-[#122B4D] transition-all duration-200"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Try Another Viewer
                      </button>
                      <a
                        href={viewPublication.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          background:
                            "linear-gradient(135deg, #C5A34E, #D4B555)",
                          color: "#0B1D3A",
                        }}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                )}

                {/* The actual iframe */}
                <iframe
                  key={`${viewPublication._id}-${viewerType}`}
                  src={getPdfViewerUrl(viewPublication.file.url)}
                  className="w-full border-0"
                  style={{ height: "600px" }}
                  title="PDF Viewer"
                  onLoad={handlePdfLoad}
                  onError={handlePdfError}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-[#F7F9FC]">
                <div className="w-16 h-16 rounded-full bg-[#E4E7EB] flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-[#9FB3C8]" />
                </div>
                <p
                  className="text-sm font-semibold text-[#0B1D3A] mb-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  No PDF available
                </p>
                <p
                  className="text-xs text-[#627D98]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  This publication doesn't have a PDF file attached
                </p>
              </div>
            )}

            {/* Modal Footer */}
            {viewPublication.file?.url && (
              <div className="px-6 py-3 bg-[#F7F9FC] border-t border-[#E4E7EB] flex items-center justify-between flex-shrink-0">
                <p
                  className="text-[10px] text-[#9FB3C8]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {viewerType === "google" && "Viewing with Google Docs Viewer"}
                  {viewerType === "office" &&
                    "Viewing with Microsoft Office Online"}
                  {viewerType === "direct" && "Viewing with browser's built-in PDF viewer"}
                </p>
                <a
                  href={viewPublication.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-semibold text-[#C5A34E] hover:underline transition-all duration-200"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Open in new tab →
                </a>
              </div>
            )}
          </div>
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
      `}</style>
    </div>
  )
}

export default AdminPublications