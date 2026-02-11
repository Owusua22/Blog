import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchArticles,
  addArticle,
  editArticle,
  removeArticle,
} from "../../redux/slice/articleSlice"
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  Search,
  ChevronDown,
} from "lucide-react"

const AdminArticles = () => {
  const dispatch = useDispatch()
  const { articles, loading, error } = useSelector((state) => state.articles)
  const formRef = useRef(null)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [editId, setEditId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [notification, setNotification] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchArticles())
  }, [dispatch])

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const showNotification = (type, message) => {
    setNotification({ type, message })
  }

  // ================================
  // SUBMIT FORM
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !content) {
      showNotification("error", "Title and content are required")
      return
    }

    setSubmitting(true)

    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    if (image) formData.append("image", image)

    try {
      if (editId) {
        const result = await dispatch(editArticle({ id: editId, formData }))
        if (result.meta.requestStatus === "fulfilled") {
          showNotification("success", "Article updated successfully!")
        } else {
          showNotification("error", "Failed to update article")
        }
        setEditId(null)
      } else {
        const result = await dispatch(addArticle(formData))
        if (result.meta.requestStatus === "fulfilled") {
          showNotification("success", "Article created successfully!")
        } else {
          showNotification("error", "Failed to create article")
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
  // EDIT ARTICLE
  // ================================
  const handleEdit = (article) => {
    setEditId(article._id)
    setTitle(article.title)
    setContent(article.content)
    setImage(null)
    setPreview(article.coverImage?.url || null)
    setShowForm(true)

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  // ================================
  // DELETE ARTICLE
  // ================================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return

    setDeletingId(id)
    try {
      const result = await dispatch(removeArticle(id))
      if (result.meta.requestStatus === "fulfilled") {
        showNotification("success", "Article deleted successfully!")
      } else {
        showNotification("error", "Failed to delete article")
      }
    } catch {
      showNotification("error", "An unexpected error occurred")
    } finally {
      setDeletingId(null)
    }
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setImage(null)
    setPreview(null)
    setEditId(null)
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

  // Filter articles
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-full">
      {/* ===== NOTIFICATION ===== */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-2xl border transition-all duration-500 animate-slide-in ${
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

          {/* Progress bar */}
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
            <FileText className="w-5 h-5 text-[#C5A34E]" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-[#0B1D3A]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Article Management
            </h1>
            <p
              className="text-xs text-[#627D98] uppercase tracking-widest"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Create, edit, and manage articles
            </p>
          </div>
        </div>
      </div>

      {/* ===== TOOLBAR ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#627D98]" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9FC] border border-[#E4E7EB] rounded-lg text-sm text-[#0B1D3A] placeholder-[#9FB3C8] focus:outline-none focus:ring-2 focus:ring-[#C5A34E]/30 focus:border-[#C5A34E] transition-all duration-300"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>

        {/* New Article Button */}
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
              New Article
            </>
          )}
        </button>
      </div>

      {/* ===== ARTICLE FORM ===== */}
      {showForm && (
        <div
          ref={formRef}
          className="mb-8 rounded-xl overflow-hidden border border-[#E4E7EB] shadow-sm"
          style={{ animation: "fadeInUp 0.4s ease-out" }}
        >
          {/* Form Header */}
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{
              background:
                "linear-gradient(135deg, #0B1D3A, #122B4D)",
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
                {editId ? "Edit Article" : "Create New Article"}
              </h2>
              <p
                className="text-[10px] text-[#627D98] uppercase tracking-widest"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {editId
                  ? "Update the article details below"
                  : "Fill in the details to publish a new article"}
              </p>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 bg-white space-y-5">
            {/* Title */}
            <div>
              <label
                className="block text-[10px] font-semibold uppercase tracking-widest text-[#627D98] mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Article Title
              </label>
              <input
                type="text"
                placeholder="Enter a compelling title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[#F7F9FC] border border-[#E4E7EB] rounded-lg text-sm text-[#0B1D3A] placeholder-[#9FB3C8] focus:outline-none focus:ring-2 focus:ring-[#C5A34E]/30 focus:border-[#C5A34E] transition-all duration-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Content */}
            <div>
              <label
                className="block text-[10px] font-semibold uppercase tracking-widest text-[#627D98] mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Content
              </label>
              <textarea
                placeholder="Write your article content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-[#F7F9FC] border border-[#E4E7EB] rounded-lg text-sm text-[#0B1D3A] placeholder-[#9FB3C8] focus:outline-none focus:ring-2 focus:ring-[#C5A34E]/30 focus:border-[#C5A34E] transition-all duration-300 resize-vertical"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label
                className="block text-[10px] font-semibold uppercase tracking-widest text-[#627D98] mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Cover Image
              </label>

              {preview ? (
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-56 h-36 object-cover rounded-lg border-2 border-[#C5A34E]/20 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null)
                      setPreview(null)
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#E4E7EB] rounded-lg cursor-pointer hover:border-[#C5A34E]/40 hover:bg-[#C5A34E]/[0.02] transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-full bg-[#C5A34E]/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5 text-[#C5A34E]" />
                  </div>
                  <span
                    className="text-xs font-medium text-[#627D98]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Click to upload or drag and drop
                  </span>
                  <span
                    className="text-[10px] text-[#9FB3C8] mt-1"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    PNG, JPG, WEBP up to 5MB
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

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background:
                    "linear-gradient(135deg, #C5A34E, #D4B555)",
                  color: "#0B1D3A",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editId ? (
                      <Pencil className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {editId ? "Update Article" : "Publish Article"}
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

      {/* ===== ARTICLES LIST ===== */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2
            className="text-lg font-bold text-[#0B1D3A]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            All Articles
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
            {filteredArticles.length}
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
            Loading articles...
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
            Failed to load articles
          </p>
          <p
            className="text-xs text-[#627D98] mb-4 text-center"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {typeof error === "string" ? error : "Something went wrong. Please try again."}
          </p>
          <button
            onClick={() => dispatch(fetchArticles())}
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
      {!loading && !error && filteredArticles.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="w-16 h-16 rounded-full bg-[#F7F9FC] border border-[#E4E7EB] flex items-center justify-center mb-4">
            <FileText className="w-7 h-7 text-[#9FB3C8]" />
          </div>
          <p
            className="text-sm font-semibold text-[#0B1D3A] mb-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {searchTerm ? "No articles found" : "No articles yet"}
          </p>
          <p
            className="text-xs text-[#627D98] mb-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first article to get started"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300 shadow-md"
              style={{
                fontFamily: "'Inter', sans-serif",
                background:
                  "linear-gradient(135deg, #C5A34E, #D4B555)",
                color: "#0B1D3A",
              }}
            >
              <Plus className="w-4 h-4" />
              Create Article
            </button>
          )}
        </div>
      )}

      {/* Articles Grid */}
      {!loading && !error && filteredArticles.length > 0 && (
        <div className="space-y-4">
          {filteredArticles.map((article, index) => (
            <div
              key={article._id}
              className="group bg-white border border-[#E4E7EB] rounded-xl overflow-hidden hover:border-[#C5A34E]/30 hover:shadow-lg transition-all duration-300"
              style={{
                animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
              }}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                {article.coverImage?.url ? (
                  <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                    <img
                      src={article.coverImage.url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0 bg-[#F7F9FC] flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-[#E4E7EB]" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3
                        className="text-lg font-bold text-[#0B1D3A] group-hover:text-[#C5A34E] transition-colors duration-300 line-clamp-1"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                        }}
                      >
                        {article.title}
                      </h3>

                      {/* Date badge */}
                      <span
                        className="flex-shrink-0 text-[10px] font-medium text-[#627D98] bg-[#F7F9FC] px-2 py-1 rounded-md border border-[#E4E7EB]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {article.createdAt
                          ? new Date(article.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "No date"}
                      </span>
                    </div>

                    <p
                      className="text-sm text-[#627D98] leading-relaxed line-clamp-2"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {article.content?.substring(0, 180)}
                      {article.content?.length > 180 ? "..." : ""}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(article)}
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
                      onClick={() => handleDelete(article._id)}
                      disabled={deletingId === article._id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {deletingId === article._id ? (
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

export default AdminArticles