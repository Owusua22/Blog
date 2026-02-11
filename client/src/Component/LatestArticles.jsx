import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchArticles } from "../redux/slice/articleSlice"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  Clock,
  Calendar,
  ChevronRight,
  BookOpen,
} from "lucide-react"

const LatestArticles = () => {
  const dispatch = useDispatch()
  const { articles, loading, error } = useSelector((state) => state.articles)

  useEffect(() => {
    dispatch(fetchArticles())
  }, [dispatch])

  // Get only first 5 latest articles
  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  // Split into featured (first) and rest
  const featuredArticle = latestArticles[0]
  const sideArticles = latestArticles.slice(1, 5)

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Estimate read time
  const getReadTime = (content) => {
    if (!content) return "3 min read"
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min read`
  }

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <section className="relative bg-[#F4F1EB] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header Skeleton */}
          <div className="text-center mb-16">
            <div className="w-40 h-3 bg-[#D4CFC7] rounded-full mx-auto mb-6 animate-pulse"></div>
            <div className="w-72 h-8 bg-[#D4CFC7] rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="w-16 h-0.5 bg-[#C5A34E]/30 mx-auto mb-6"></div>
            <div className="w-96 h-4 bg-[#D4CFC7] rounded-full mx-auto animate-pulse"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Featured Skeleton */}
            <div className="bg-white rounded-sm overflow-hidden shadow-sm animate-pulse">
              <div className="h-72 bg-[#D4CFC7]"></div>
              <div className="p-8">
                <div className="w-24 h-3 bg-[#D4CFC7] rounded-full mb-4"></div>
                <div className="w-full h-6 bg-[#D4CFC7] rounded-full mb-3"></div>
                <div className="w-3/4 h-6 bg-[#D4CFC7] rounded-full mb-4"></div>
                <div className="w-full h-4 bg-[#D4CFC7] rounded-full mb-2"></div>
                <div className="w-2/3 h-4 bg-[#D4CFC7] rounded-full"></div>
              </div>
            </div>

            {/* Side Skeletons */}
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex gap-5 bg-white rounded-sm p-4 shadow-sm animate-pulse"
                >
                  <div className="w-28 h-24 bg-[#D4CFC7] rounded-sm flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="w-20 h-2.5 bg-[#D4CFC7] rounded-full mb-3"></div>
                    <div className="w-full h-4 bg-[#D4CFC7] rounded-full mb-2"></div>
                    <div className="w-3/4 h-4 bg-[#D4CFC7] rounded-full mb-3"></div>
                    <div className="w-32 h-2.5 bg-[#D4CFC7] rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // ===== ERROR STATE =====
  if (error) {
    return (
      <section className="relative bg-[#F4F1EB] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#0B1D3A] flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-7 h-7 text-[#C5A34E]" />
            </div>
            <h3 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#0B1D3A] mb-3">
              Unable to Load Articles
            </h3>
            <p className="font-['Inter',sans-serif] text-sm text-[#627D98] mb-6">
              {error?.message || "Something went wrong. Please try again."}
            </p>
            <button
              onClick={() => dispatch(fetchArticles())}
              className="px-8 py-3 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-xs font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm hover:from-[#D4B555] hover:to-[#E2C96E] shadow-[0_4px_14px_rgba(197,163,78,0.3)] transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  // ===== EMPTY STATE =====
  if (!articles || articles.length === 0) {
    return (
      <section className="relative bg-[#F4F1EB] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#0B1D3A] flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-7 h-7 text-[#C5A34E]" />
            </div>
            <h3 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#0B1D3A] mb-3">
              No Articles Yet
            </h3>
            <p className="font-['Source_Serif_Pro',serif] text-base text-[#627D98]">
              Articles will appear here once published.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // ===== MAIN CONTENT =====
  return (
    <section className="relative bg-[#F4F1EB] overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C5A34E]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#0B1D3A]/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-12">
        {/* ===== SECTION HEADER ===== */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-10 h-px bg-[#C5A34E]"></span>
            <span className="font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A34E]">
              From the Desk
            </span>
            <span className="w-10 h-px bg-[#C5A34E]"></span>
          </div>

          <h2 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1D3A] mb-4">
            Latest Articles
          </h2>

          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent mx-auto mb-6"></div>

          <p className="font-['Source_Serif_Pro',serif] text-lg text-[#627D98] max-w-2xl mx-auto">
            Insights on democracy, governance, and the future of
            Ghana from Hon. Mike Oquaye.
          </p>
        </div>

        {/* ===== ARTICLES GRID ===== */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {/* ===== FEATURED ARTICLE (First) ===== */}
          {featuredArticle && (
            <Link
              to={`/articles/${featuredArticle._id}`}
              className="group bg-white rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(11,29,58,0.08)] hover:shadow-[0_10px_40px_rgba(11,29,58,0.12)] transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-72 sm:h-80 overflow-hidden bg-gradient-to-br from-[#0B1D3A] to-[#1B3A5C]">
                {featuredArticle.coverImage?.url ? (
                  <img
                    src={featuredArticle.coverImage.url}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-[#1B3A5C]" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A]/60 via-transparent to-transparent"></div>

                {/* Featured Badge */}
                <div className="absolute top-4 left-4 px-4 py-1.5 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] rounded-sm">
                  <span className="font-['Inter',sans-serif] text-[9px] font-bold uppercase tracking-[0.2em] text-[#0B1D3A]">
                    Latest
                  </span>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/20"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/20"></div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                {/* Meta */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-[#C5A34E]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-['Inter',sans-serif] text-[11px] font-medium">
                      {formatDate(featuredArticle.createdAt)}
                    </span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-[#D4CFC7]"></span>
                  <div className="flex items-center gap-1.5 text-[#627D98]">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-['Inter',sans-serif] text-[11px]">
                      {getReadTime(featuredArticle.content)}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-[#0B1D3A] mb-4 leading-tight group-hover:text-[#C5A34E] transition-colors duration-300">
                  {featuredArticle.title}
                </h3>

                {/* Divider */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-[1.5px] bg-[#C5A34E]"></div>
                  <div className="w-1.5 h-1.5 rotate-45 border border-[#C5A34E]/40"></div>
                </div>

                {/* Excerpt */}
                <p className="font-['Source_Serif_Pro',serif] text-base text-[#627D98] leading-relaxed line-clamp-3 mb-6">
                  {featuredArticle.content}
                </p>

                {/* Read More */}
                <div className="flex items-center gap-2 text-[#C5A34E] group-hover:text-[#A88A3D] transition-colors duration-300">
                  <span className="font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.15em]">
                    Read Full Article
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          )}

          {/* ===== SIDE ARTICLES (2-5) ===== */}
          <div className="flex flex-col gap-5">
            {sideArticles.map((article, index) => (
              <Link
                key={article._id}
                to={`/articles/${article._id}`}
                className="group flex gap-5 bg-white rounded-sm p-4 shadow-[0_1px_3px_rgba(11,29,58,0.06)] hover:shadow-[0_8px_30px_rgba(11,29,58,0.1)] transition-all duration-500 hover:-translate-y-0.5"
              >
                {/* Thumbnail */}
                <div className="relative w-28 sm:w-36 h-24 sm:h-28 flex-shrink-0 rounded-sm overflow-hidden bg-gradient-to-br from-[#0B1D3A] to-[#1B3A5C]">
                  {article.coverImage?.url ? (
                    <img
                      src={article.coverImage.url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-[#334E68]" />
                    </div>
                  )}

                  {/* Number Badge */}
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#0B1D3A]/70 backdrop-blur-sm flex items-center justify-center">
                    <span className="font-['Inter',sans-serif] text-[9px] font-bold text-[#C5A34E]">
                      {String(index + 2).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1 text-[#C5A34E]">
                      <Calendar className="w-3 h-3" />
                      <span className="font-['Inter',sans-serif] text-[10px] font-medium">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                    <span className="w-0.5 h-0.5 rounded-full bg-[#D4CFC7]"></span>
                    <div className="flex items-center gap-1 text-[#829AB1]">
                      <Clock className="w-3 h-3" />
                      <span className="font-['Inter',sans-serif] text-[10px]">
                        {getReadTime(article.content)}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="font-['Cormorant_Garamond',serif] text-lg font-semibold text-[#0B1D3A] leading-snug group-hover:text-[#C5A34E] transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h4>

                  {/* Read More */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="font-['Inter',sans-serif] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C5A34E] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Read More
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C5A34E] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ===== VIEW ALL BUTTON ===== */}
        <div className="text-center mt-14">
          <Link
            to="/articles"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-[#0B1D3A] text-white text-[11px] font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm hover:bg-[#1B3A5C] shadow-[0_4px_14px_rgba(11,29,58,0.2)] hover:shadow-[0_8px_25px_rgba(11,29,58,0.3)] transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <BookOpen className="w-4 h-4 text-[#C5A34E]" />
            View All Articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>

        {/* ===== BOTTOM DECORATIVE LINE ===== */}
        <div className="mt-20">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E]/20 to-transparent"></div>
        </div>
      </div>
    </section>
  )
}

export default LatestArticles