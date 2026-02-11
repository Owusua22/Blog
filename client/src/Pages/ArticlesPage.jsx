import React, { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchArticles } from "../redux/slice/articleSlice"
import { Link } from "react-router-dom"
import {
  Search,
  Calendar,
  Clock,
  BookOpen,
  ChevronRight,
  ArrowRight,
  SlidersHorizontal,
  X,
  Grid3X3,
  List,
  ChevronLeft,
} from "lucide-react"
import Navbar from "../Component/Navbar"
import Footer from "../Component/Footer"

const ARTICLES_PER_PAGE = 9

const ArticlesPage = () => {
  const dispatch = useDispatch()
  const { articles, loading, error } = useSelector((state) => state.articles)

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("grid") // grid | list
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    dispatch(fetchArticles())
  }, [dispatch])

  // Reset page when search/sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortBy])

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Format short date
  const formatShortDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Estimate read time
  const getReadTime = (content) => {
    if (!content) return "3 min read"
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min read`
  }

  // Filter & Sort articles
  const filteredArticles = useMemo(() => {
    let result = [...articles]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query)
      )
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case "a-z":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "z-a":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      default:
        break
    }

    return result
  }, [articles, searchQuery, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE)
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  )

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
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
        for (let i = currentPage - 1; i <= currentPage + 1; i++)
          pages.push(i)
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="min-h-screen bg-[#F4F1EB]">
      <Navbar />

      {/* ===== PAGE HEADER ===== */}
      <section className="relative bg-[#0B1D3A] overflow-hidden">
        {/* Background Elements */}
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
                Articles
              </span>
            </div>

            {/* Title */}
            <h1 className="font-['Cormorant_Garamond',serif] text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              All Articles
            </h1>

            {/* Divider */}
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent mx-auto mb-6"></div>

            {/* Description */}
            <p className="font-['Source_Serif_Pro',serif] text-lg text-[#9FB3C8] max-w-xl mx-auto">
              Explore insights on democracy, governance, leadership,
              and the future of Ghana.
            </p>
          </div>
        </div>

        {/* Bottom Gold Line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent opacity-40"></div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="relative">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C5A34E]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16">
          {/* ===== TOOLBAR ===== */}
          <div className="bg-white rounded-sm shadow-[0_1px_3px_rgba(11,29,58,0.08)] p-4 sm:p-6 mb-10">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#627D98]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-11 pr-10 py-3 bg-[#F4F1EB] border border-[#D4CFC7] rounded-sm font-['Inter',sans-serif] text-sm text-[#0B1D3A] placeholder-[#829AB1] focus:outline-none focus:border-[#C5A34E] focus:ring-1 focus:ring-[#C5A34E]/30 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#829AB1] hover:text-[#0B1D3A] transition-colors duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                {/* Sort Dropdown */}
                <div className="relative flex-1 lg:flex-none">
                  <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#627D98] pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full lg:w-48 pl-10 pr-4 py-3 bg-[#F4F1EB] border border-[#D4CFC7] rounded-sm font-['Inter',sans-serif] text-sm text-[#0B1D3A] focus:outline-none focus:border-[#C5A34E] focus:ring-1 focus:ring-[#C5A34E]/30 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="a-z">Title A–Z</option>
                    <option value="z-a">Title Z–A</option>
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-[#F4F1EB] border border-[#D4CFC7] rounded-sm overflow-hidden">
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
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-[#0B1D3A] text-[#C5A34E]"
                        : "text-[#829AB1] hover:text-[#0B1D3A]"
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-[#F4F1EB] flex items-center justify-between">
              <p className="font-['Inter',sans-serif] text-[11px] text-[#829AB1] uppercase tracking-[0.1em]">
                Showing{" "}
                <span className="text-[#0B1D3A] font-semibold">
                  {paginatedArticles.length}
                </span>{" "}
                of{" "}
                <span className="text-[#0B1D3A] font-semibold">
                  {filteredArticles.length}
                </span>{" "}
                articles
                {searchQuery && (
                  <span className="text-[#C5A34E]">
                    {" "}
                    for "{searchQuery}"
                  </span>
                )}
              </p>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="font-['Inter',sans-serif] text-[11px] text-[#C5A34E] hover:text-[#A88A3D] uppercase tracking-[0.1em] transition-colors duration-300"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>

          {/* ===== LOADING STATE ===== */}
          {loading && (
            <div className={`${
              viewMode === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }`}>
              {[1, 2, 3, 4, 5, 6].map((i) =>
                viewMode === "grid" ? (
                  // Grid Skeleton
                  <div
                    key={i}
                    className="bg-white rounded-sm overflow-hidden shadow-sm animate-pulse"
                  >
                    <div className="h-52 bg-[#D4CFC7]"></div>
                    <div className="p-6">
                      <div className="w-24 h-3 bg-[#D4CFC7] rounded-full mb-4"></div>
                      <div className="w-full h-5 bg-[#D4CFC7] rounded-full mb-3"></div>
                      <div className="w-3/4 h-5 bg-[#D4CFC7] rounded-full mb-4"></div>
                      <div className="w-full h-3 bg-[#D4CFC7] rounded-full mb-2"></div>
                      <div className="w-2/3 h-3 bg-[#D4CFC7] rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  // List Skeleton
                  <div
                    key={i}
                    className="flex gap-6 bg-white rounded-sm p-5 shadow-sm animate-pulse"
                  >
                    <div className="w-48 h-36 bg-[#D4CFC7] rounded-sm flex-shrink-0"></div>
                    <div className="flex-1 py-2">
                      <div className="w-32 h-3 bg-[#D4CFC7] rounded-full mb-3"></div>
                      <div className="w-full h-5 bg-[#D4CFC7] rounded-full mb-3"></div>
                      <div className="w-3/4 h-5 bg-[#D4CFC7] rounded-full mb-4"></div>
                      <div className="w-full h-3 bg-[#D4CFC7] rounded-full mb-2"></div>
                      <div className="w-1/2 h-3 bg-[#D4CFC7] rounded-full"></div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* ===== ERROR STATE ===== */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[#0B1D3A] flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-7 h-7 text-[#C5A34E]" />
              </div>
              <h3 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#0B1D3A] mb-3">
                Unable to Load Articles
              </h3>
              <p className="font-['Inter',sans-serif] text-sm text-[#627D98] mb-6">
                {error?.message || "Something went wrong."}
              </p>
              <button
                onClick={() => dispatch(fetchArticles())}
                className="px-8 py-3 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-xs font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ===== EMPTY / NO RESULTS STATE ===== */}
          {!loading && !error && filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[#0B1D3A] flex items-center justify-center mx-auto mb-6">
                <Search className="w-7 h-7 text-[#C5A34E]" />
              </div>
              <h3 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#0B1D3A] mb-3">
                {searchQuery ? "No Articles Found" : "No Articles Yet"}
              </h3>
              <p className="font-['Source_Serif_Pro',serif] text-base text-[#627D98] mb-6">
                {searchQuery
                  ? `No articles match "${searchQuery}". Try a different search term.`
                  : "Articles will appear here once published."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-8 py-3 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-xs font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm transition-all duration-300"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* ===== ARTICLES — GRID VIEW ===== */}
          {!loading && !error && filteredArticles.length > 0 && viewMode === "grid" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedArticles.map((article, index) => (
                <Link
                  key={article._id}
                  to={`/articles/${article._id}`}
                  className="group bg-white rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(11,29,58,0.08)] hover:shadow-[0_10px_40px_rgba(11,29,58,0.12)] transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#0B1D3A] to-[#1B3A5C]">
                    {article.coverImage?.url ? (
                      <img
                        src={article.coverImage.url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-[#1B3A5C]" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Number Badge */}
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#0B1D3A]/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="font-['Inter',sans-serif] text-[10px] font-bold text-[#C5A34E]">
                        {String(
                          (currentPage - 1) * ARTICLES_PER_PAGE + index + 1
                        ).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5 text-[#C5A34E]">
                        <Calendar className="w-3 h-3" />
                        <span className="font-['Inter',sans-serif] text-[10px] font-medium">
                          {formatShortDate(article.createdAt)}
                        </span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-[#D4CFC7]"></span>
                      <div className="flex items-center gap-1.5 text-[#829AB1]">
                        <Clock className="w-3 h-3" />
                        <span className="font-['Inter',sans-serif] text-[10px]">
                          {getReadTime(article.content)}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-['Cormorant_Garamond',serif] text-xl font-bold text-[#0B1D3A] mb-3 leading-snug group-hover:text-[#C5A34E] transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Divider */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-[1.5px] bg-[#C5A34E]"></div>
                      <div className="w-1 h-1 rotate-45 border border-[#C5A34E]/40"></div>
                    </div>

                    {/* Excerpt */}
                    <p className="font-['Source_Serif_Pro',serif] text-sm text-[#627D98] leading-relaxed line-clamp-3 mb-4">
                      {article.content}
                    </p>

                    {/* Read More */}
                    <div className="flex items-center gap-2 text-[#C5A34E]">
                      <span className="font-['Inter',sans-serif] text-[10px] font-semibold uppercase tracking-[0.15em]">
                        Read More
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ===== ARTICLES — LIST VIEW ===== */}
          {!loading && !error && filteredArticles.length > 0 && viewMode === "list" && (
            <div className="space-y-6">
              {paginatedArticles.map((article, index) => (
                <Link
                  key={article._id}
                  to={`/articles/${article._id}`}
                  className="group flex flex-col sm:flex-row gap-6 bg-white rounded-sm p-5 shadow-[0_1px_3px_rgba(11,29,58,0.08)] hover:shadow-[0_10px_40px_rgba(11,29,58,0.12)] transition-all duration-500 hover:-translate-y-0.5"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-56 h-44 sm:h-40 flex-shrink-0 rounded-sm overflow-hidden bg-gradient-to-br from-[#0B1D3A] to-[#1B3A5C]">
                    {article.coverImage?.url ? (
                      <img
                        src={article.coverImage.url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-[#334E68]" />
                      </div>
                    )}

                    {/* Number Badge */}
                    <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-[#0B1D3A]/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="font-['Inter',sans-serif] text-[9px] font-bold text-[#C5A34E]">
                        {String(
                          (currentPage - 1) * ARTICLES_PER_PAGE + index + 1
                        ).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      {/* Meta */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1.5 text-[#C5A34E]">
                          <Calendar className="w-3 h-3" />
                          <span className="font-['Inter',sans-serif] text-[10px] font-medium">
                            {formatDate(article.createdAt)}
                          </span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-[#D4CFC7]"></span>
                        <div className="flex items-center gap-1.5 text-[#829AB1]">
                          <Clock className="w-3 h-3" />
                          <span className="font-['Inter',sans-serif] text-[10px]">
                            {getReadTime(article.content)}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-bold text-[#0B1D3A] mb-3 leading-snug group-hover:text-[#C5A34E] transition-colors duration-300">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="font-['Source_Serif_Pro',serif] text-sm text-[#627D98] leading-relaxed line-clamp-2">
                        {article.content}
                      </p>
                    </div>

                    {/* Read More */}
                    <div className="flex items-center gap-2 mt-4 text-[#C5A34E]">
                      <span className="font-['Inter',sans-serif] text-[10px] font-semibold uppercase tracking-[0.15em]">
                        Read Full Article
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ===== PAGINATION ===== */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-14">
              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#D4CFC7] to-transparent mb-10"></div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Page Info */}
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

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {/* Prev Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-sm border border-[#D4CFC7] flex items-center justify-center text-[#627D98] hover:border-[#C5A34E] hover:text-[#C5A34E] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`dots-${index}`}
                        className="w-10 h-10 flex items-center justify-center text-[#829AB1] font-['Inter',sans-serif] text-sm"
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
                        className={`w-10 h-10 rounded-sm font-['Inter',sans-serif] text-sm font-medium transition-all duration-300 ${
                          currentPage === page
                            ? "bg-[#0B1D3A] text-[#C5A34E] shadow-md"
                            : "border border-[#D4CFC7] text-[#627D98] hover:border-[#C5A34E] hover:text-[#C5A34E]"
                        }`}
                        aria-label={`Page ${page}`}
                        aria-current={
                          currentPage === page ? "page" : undefined
                        }
                      >
                        {page}
                      </button>
                    )
                  )}

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-sm border border-[#D4CFC7] flex items-center justify-center text-[#627D98] hover:border-[#C5A34E] hover:text-[#C5A34E] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Jump */}
                <div className="flex items-center gap-2">
                  <span className="font-['Inter',sans-serif] text-[11px] text-[#829AB1] uppercase tracking-[0.1em]">
                    Go to
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value=""
                    onChange={(e) => {
                      const page = parseInt(e.target.value)
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page)
                        window.scrollTo({ top: 400, behavior: "smooth" })
                      }
                    }}
                    placeholder="#"
                    className="w-14 h-10 text-center border border-[#D4CFC7] rounded-sm font-['Inter',sans-serif] text-sm text-[#0B1D3A] focus:outline-none focus:border-[#C5A34E] focus:ring-1 focus:ring-[#C5A34E]/30 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ArticlesPage