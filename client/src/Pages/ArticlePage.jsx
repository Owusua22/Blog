import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, Link, useNavigate } from "react-router-dom"
import { fetchArticle, fetchArticles, toggleLikeArticle } from "../redux/slice/articleSlice"
import {
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  Heart,
  Share2,
  BookOpen,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check,
  ArrowRight,
  Quote,
} from "lucide-react"
import Navbar from "../Component/Navbar"
import Footer from "../Component/Footer"

const ArticlePage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { article, articles, loading, error } = useSelector(
    (state) => state.articles
  )

  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Fetch article and all articles for related
  useEffect(() => {
    dispatch(fetchArticle(id))
    dispatch(fetchArticles())
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [dispatch, id])

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close share menu on outside click
  useEffect(() => {
    const handleClick = () => setShowShareMenu(false)
    if (showShareMenu) {
      document.addEventListener("click", handleClick)
      return () => document.removeEventListener("click", handleClick)
    }
  }, [showShareMenu])

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Get read time
  const getReadTime = (content) => {
    if (!content) return "3 min read"
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min read`
  }

  // Handle like
  const handleLike = () => {
    dispatch(toggleLikeArticle(id))
    setIsLiked(!isLiked)
  }

  // Handle share
  const handleShare = (platform) => {
    const url = window.location.href
    const title = article?.title || ""

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    }

    if (platform === "copy") {
      navigator.clipboard.writeText(url)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
      return
    }

    window.open(shareUrls[platform], "_blank", "width=600,height=400")
    setShowShareMenu(false)
  }

  // Get related articles
  const relatedArticles = articles
    .filter((a) => a._id !== id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  // Get previous and next articles
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
  const currentIndex = sortedArticles.findIndex((a) => a._id === id)
  const prevArticle = currentIndex < sortedArticles.length - 1
    ? sortedArticles[currentIndex + 1]
    : null
  const nextArticle = currentIndex > 0
    ? sortedArticles[currentIndex - 1]
    : null

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F1EB]">
        <Navbar />

        {/* Progress Bar */}
        <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
          <div className="h-full bg-gradient-to-r from-[#C5A34E] to-[#E2C96E] w-0"></div>
        </div>

        {/* Header Skeleton */}
        <section className="relative bg-[#0B1D3A] py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center animate-pulse">
            <div className="w-40 h-3 bg-[#1B3A5C] rounded-full mx-auto mb-8"></div>
            <div className="w-full h-10 bg-[#1B3A5C] rounded-full mx-auto mb-4"></div>
            <div className="w-3/4 h-10 bg-[#1B3A5C] rounded-full mx-auto mb-8"></div>
            <div className="w-16 h-0.5 bg-[#C5A34E]/30 mx-auto mb-6"></div>
            <div className="flex items-center justify-center gap-6">
              <div className="w-32 h-3 bg-[#1B3A5C] rounded-full"></div>
              <div className="w-24 h-3 bg-[#1B3A5C] rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Content Skeleton */}
        <section className="max-w-3xl mx-auto px-6 sm:px-8 py-10 animate-pulse">
          <div className="w-full h-80 bg-[#D4CFC7] rounded-sm mb-12"></div>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className={`h-4 bg-[#D4CFC7] rounded-full mb-4 ${
                i % 3 === 0 ? "w-3/4" : "w-full"
              }`}
            ></div>
          ))}
        </section>
      </div>
    )
  }

  // ===== ERROR STATE =====
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
              Article Not Found
            </h2>
            <p className="font-['Source_Serif_Pro',serif] text-base text-[#627D98] mb-8 max-w-md mx-auto">
              {error?.message ||
                "The article you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-[#D4CFC7] text-[#0B1D3A] text-xs font-['Inter',sans-serif] font-semibold uppercase tracking-[0.15em] rounded-sm hover:border-[#C5A34E] transition-all duration-300"
              >
                Go Back
              </button>
              <Link
                to="/articles"
                className="px-6 py-3 bg-gradient-to-r from-[#C5A34E] to-[#D4B555] text-[#0B1D3A] text-xs font-['Inter',sans-serif] font-bold uppercase tracking-[0.15em] rounded-sm transition-all duration-300"
              >
                All Articles
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  if (!article) return null

  // ===== MAIN ARTICLE PAGE =====
  return (
    <div className="min-h-screen bg-[#F4F1EB]">
      <Navbar />

      {/* ===== READING PROGRESS BAR ===== */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-[#C5A34E] to-[#E2C96E] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* ===== ARTICLE HEADER ===== */}
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

        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 py-8 md:py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 justify-center">
            <Link
              to="/"
              className="font-['Inter',sans-serif] text-[11px] uppercase tracking-[0.15em] text-[#627D98] hover:text-[#C5A34E] transition-colors duration-300"
            >
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-[#334E68]" />
            <Link
              to="/articles"
              className="font-['Inter',sans-serif] text-[11px] uppercase tracking-[0.15em] text-[#627D98] hover:text-[#C5A34E] transition-colors duration-300"
            >
              Articles
            </Link>
            <ChevronRight className="w-3 h-3 text-[#334E68]" />
            <span className="font-['Inter',sans-serif] text-[11px] uppercase tracking-[0.15em] text-[#C5A34E] line-clamp-1 max-w-[200px]">
              {article.title}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center leading-tight mb-8 max-w-3xl mx-auto">
            {article.title}
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-[#C5A34E]"></div>
            <div className="w-2 h-2 rotate-45 bg-[#C5A34E]"></div>
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-[#C5A34E]"></div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A34E] to-[#E2C96E] flex items-center justify-center">
                <span className="text-[#0B1D3A] font-bold text-xs font-['Cormorant_Garamond',serif]">
                  MO
                </span>
              </div>
              <div>
                <p className="font-['Inter',sans-serif] text-sm font-medium text-white">
                  Hon. Mike Ocquaye
                </p>
                <p className="font-['Inter',sans-serif] text-[10px] text-[#627D98] uppercase tracking-[0.1em]">
                  Author
                </p>
              </div>
            </div>

            <span className="w-px h-8 bg-[#334E68] hidden sm:block"></span>

            {/* Date */}
            <div className="flex items-center gap-2 text-[#9FB3C8]">
              <Calendar className="w-4 h-4 text-[#C5A34E]" />
              <span className="font-['Inter',sans-serif] text-sm">
                {formatDate(article.createdAt)}
              </span>
            </div>

            <span className="w-px h-8 bg-[#334E68] hidden sm:block"></span>

            {/* Read Time */}
            <div className="flex items-center gap-2 text-[#9FB3C8]">
              <Clock className="w-4 h-4 text-[#C5A34E]" />
              <span className="font-['Inter',sans-serif] text-sm">
                {getReadTime(article.content)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Gold Line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent opacity-40"></div>
      </section>

      {/* ===== ARTICLE CONTENT ===== */}
      <section className="relative">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 md:py-16">
          {/* Cover Image */}
          {article.coverImage?.url && (
            <div className="relative mb-12 rounded-sm overflow-hidden shadow-[0_10px_40px_rgba(11,29,58,0.15)]">
              <img
                src={article.coverImage.url}
                alt={article.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
              {/* Corner Accents */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/20"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/20"></div>
            </div>
          )}

          {/* ===== STICKY SIDE ACTIONS ===== */}
          <div className="hidden xl:block fixed left-8 2xl:left-16 top-1/2 -translate-y-1/2 z-40">
            <div className="flex flex-col items-center gap-4 bg-white rounded-sm shadow-[0_4px_20px_rgba(11,29,58,0.1)] p-3">
              {/* Like */}
              <button
                onClick={handleLike}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isLiked
                    ? "bg-red-50 text-red-500"
                    : "bg-[#F4F1EB] text-[#627D98] hover:text-red-500 hover:bg-red-50"
                }`}
                aria-label="Like article"
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                />
              </button>

              {/* Like Count */}
              {article.likes?.length > 0 && (
                <span className="font-['Inter',sans-serif] text-[10px] font-semibold text-[#627D98]">
                  {article.likes.length}
                </span>
              )}

              <span className="w-6 h-px bg-[#D4CFC7]"></span>

              {/* Share */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowShareMenu(!showShareMenu)
                  }}
                  className="w-10 h-10 rounded-full bg-[#F4F1EB] text-[#627D98] hover:text-[#C5A34E] hover:bg-[#C5A34E]/10 flex items-center justify-center transition-all duration-300"
                  aria-label="Share article"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                {/* Share Dropdown */}
                {showShareMenu && (
                  <div
                    className="absolute left-14 top-0 bg-white rounded-sm shadow-[0_10px_40px_rgba(11,29,58,0.15)] border border-[#F4F1EB] p-2 min-w-[180px] z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="font-['Inter',sans-serif] text-[9px] uppercase tracking-[0.15em] text-[#829AB1] px-3 py-2">
                      Share via
                    </p>
                    {[
                      { name: "Facebook", icon: Facebook, platform: "facebook" },
                      { name: "Twitter / X", icon: Twitter, platform: "twitter" },
                      { name: "LinkedIn", icon: Linkedin, platform: "linkedin" },
                      {
                        name: linkCopied ? "Link Copied!" : "Copy Link",
                        icon: linkCopied ? Check : Link2,
                        platform: "copy",
                      },
                    ].map((item) => (
                      <button
                        key={item.platform}
                        onClick={() => handleShare(item.platform)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[#334E68] hover:text-[#C5A34E] hover:bg-[#F4F1EB] rounded-sm transition-all duration-300"
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="font-['Inter',sans-serif] text-sm">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== ARTICLE BODY ===== */}
          <article className="prose-custom">
            {/* Drop Cap First Paragraph Effect */}
            <div className="font-['Source_Serif_Pro',serif] text-lg sm:text-xl text-[#2C2C2C] leading-relaxed whitespace-pre-line">
              {article.content.split("\n\n").map((paragraph, index) => (
                <p
                  key={index}
                  className={`mb-6 ${
                    index === 0 ? "first-letter:text-5xl first-letter:font-['Cormorant_Garamond',serif] first-letter:font-bold first-letter:text-[#C5A34E] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none" : ""
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          {/* ===== MOBILE ACTIONS BAR ===== */}
          <div className="xl:hidden mt-10 mb-10">
            <div className="flex items-center justify-between bg-white rounded-sm shadow-[0_1px_3px_rgba(11,29,58,0.08)] p-4">
              {/* Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-all duration-300 ${
                  isLiked
                    ? "bg-red-50 text-red-500"
                    : "bg-[#F4F1EB] text-[#627D98] hover:text-red-500"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                />
                <span className="font-['Inter',sans-serif] text-sm font-medium">
                  {isLiked ? "Liked" : "Like"}
                  {article.likes?.length > 0 && ` (${article.likes.length})`}
                </span>
              </button>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare("facebook")}
                  className="w-10 h-10 rounded-full bg-[#F4F1EB] text-[#627D98] hover:text-[#1877F2] hover:bg-blue-50 flex items-center justify-center transition-all duration-300"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="w-10 h-10 rounded-full bg-[#F4F1EB] text-[#627D98] hover:text-[#0B1D3A] hover:bg-gray-100 flex items-center justify-center transition-all duration-300"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="w-10 h-10 rounded-full bg-[#F4F1EB] text-[#627D98] hover:text-[#0A66C2] hover:bg-blue-50 flex items-center justify-center transition-all duration-300"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    linkCopied
                      ? "bg-green-50 text-green-600"
                      : "bg-[#F4F1EB] text-[#627D98] hover:text-[#C5A34E] hover:bg-[#C5A34E]/10"
                  }`}
                >
                  {linkCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ===== TAGS ===== */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-[#D4CFC7]">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.15em] text-[#829AB1]">
                  Tags:
                </span>
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 bg-[#0B1D3A]/5 text-[#334E68] font-['Inter',sans-serif] text-[11px] font-medium uppercase tracking-[0.1em] rounded-sm hover:bg-[#C5A34E]/10 hover:text-[#C5A34E] transition-colors duration-300 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}


          {/* ===== PREV / NEXT NAVIGATION ===== */}
          <div className="mt-12 grid sm:grid-cols-2 gap-4">
            {/* Previous */}
            {prevArticle ? (
              <Link
                to={`/articles/${prevArticle._id}`}
                className="group bg-white rounded-sm p-6 shadow-[0_1px_3px_rgba(11,29,58,0.08)] hover:shadow-[0_8px_30px_rgba(11,29,58,0.1)] transition-all duration-500 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <ChevronLeft className="w-4 h-4 text-[#C5A34E] group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="font-['Inter',sans-serif] text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C5A34E]">
                    Previous Article
                  </span>
                </div>
                <h5 className="font-['Cormorant_Garamond',serif] text-lg font-semibold text-[#0B1D3A] group-hover:text-[#C5A34E] transition-colors duration-300 line-clamp-2">
                  {prevArticle.title}
                </h5>
              </Link>
            ) : (
              <div></div>
            )}

            {/* Next */}
            {nextArticle ? (
              <Link
                to={`/articles/${nextArticle._id}`}
                className="group bg-white rounded-sm p-6 shadow-[0_1px_3px_rgba(11,29,58,0.08)] hover:shadow-[0_8px_30px_rgba(11,29,58,0.1)] transition-all duration-500 hover:-translate-y-0.5 text-right"
              >
                <div className="flex items-center gap-2 mb-3 justify-end">
                  <span className="font-['Inter',sans-serif] text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C5A34E]">
                    Next Article
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#C5A34E] group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <h5 className="font-['Cormorant_Garamond',serif] text-lg font-semibold text-[#0B1D3A] group-hover:text-[#C5A34E] transition-colors duration-300 line-clamp-2">
                  {nextArticle.title}
                </h5>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </section>

      {/* ===== RELATED ARTICLES ===== */}
      {relatedArticles.length > 0 && (
        <section className="relative bg-[#0B1D3A] overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #C5A34E 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          ></div>

          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-28">
            {/* Header */}
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="w-10 h-px bg-[#C5A34E]"></span>
                <span className="font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A34E]">
                  Continue Reading
                </span>
                <span className="w-10 h-px bg-[#C5A34E]"></span>
              </div>

              <h2 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-bold text-white mb-4">
                Related Articles
              </h2>

              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#C5A34E] to-transparent mx-auto"></div>
            </div>

            {/* Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((related) => (
                <Link
                  key={related._id}
                  to={`/articles/${related._id}`}
                  className="group bg-[#1B3A5C]/30 backdrop-blur-sm border border-[#1B3A5C] hover:border-[#C5A34E]/30 rounded-sm overflow-hidden transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-[#0B1D3A]">
                    {related.coverImage?.url ? (
                      <img
                        src={related.coverImage.url}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-[#334E68]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A]/60 via-transparent to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5 text-[#C5A34E]">
                        <Calendar className="w-3 h-3" />
                        <span className="font-['Inter',sans-serif] text-[10px] font-medium">
                          {formatDate(related.createdAt)}
                        </span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-[#334E68]"></span>
                      <div className="flex items-center gap-1.5 text-[#627D98]">
                        <Clock className="w-3 h-3" />
                        <span className="font-['Inter',sans-serif] text-[10px]">
                          {getReadTime(related.content)}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-['Cormorant_Garamond',serif] text-xl font-semibold text-white mb-3 leading-snug group-hover:text-[#C5A34E] transition-colors duration-300 line-clamp-2">
                      {related.title}
                    </h4>

                    {/* Excerpt */}
                    <p className="font-['Source_Serif_Pro',serif] text-sm text-[#829AB1] leading-relaxed line-clamp-2 mb-4">
                      {related.content}
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

            {/* View All */}
            <div className="text-center mt-12">
              <Link
                to="/articles"
                className="group inline-flex items-center gap-3 px-10 py-4 border border-[#C5A34E]/40 text-[#C5A34E] text-[11px] font-['Inter',sans-serif] font-semibold uppercase tracking-[0.15em] rounded-sm hover:bg-[#C5A34E]/10 hover:border-[#C5A34E] transition-all duration-300"
              >
                <BookOpen className="w-4 h-4" />
                View All Articles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== BACK TO TOP ===== */}
      {scrollProgress > 20 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-[#0B1D3A] border border-[#334E68] text-[#C5A34E] shadow-[0_4px_14px_rgba(11,29,58,0.3)] hover:bg-[#1B3A5C] hover:border-[#C5A34E]/30 flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
          aria-label="Back to top"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}

      <Footer />
    </div>
  )
}

export default ArticlePage