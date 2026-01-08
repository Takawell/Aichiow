import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import { FiArrowLeft, FiSearch, FiFilter, FiShare2, FiDownload, FiExternalLink, FiX, FiChevronUp, FiChevronDown, FiLoader } from 'react-icons/fi'
import { FaFire, FaStar, FaClock, FaRandom, FaHashtag } from 'react-icons/fa'

type DanbooruPost = {
  id: number
  created_at: string
  file_url: string
  large_file_url: string
  preview_file_url: string
  tag_string: string
  tag_string_character: string
  tag_string_copyright: string
  tag_string_artist: string
  rating: string
  score: number
  fav_count: number
  file_ext: string
  image_width: number
  image_height: number
  source: string
}

type AutocompleteResult = {
  type: string
  label: string
  value: string
  post_count: number
}

type FilterType = 'safe' | 'general' | 'sensitive'
type SortType = 'score' | 'new' | 'random'

export default function FanartPage() {
  const router = useRouter()
  const [images, setImages] = useState<DanbooruPost[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>('safe')
  const [activeSort, setActiveSort] = useState<SortType>('score')
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showActions, setShowActions] = useState<number | null>(null)
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({})

  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreObserverRef = useRef<IntersectionObserver | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const autocompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null)

  const trendingTags = [
    'hatsune_miku',
    'genshin_impact',
    'original',
    'fate/grand_order',
    'blue_archive',
    'touhou',
    'vtuber',
    'arknights'
  ]

  const fetchAutocomplete = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([])
      return
    }

    setLoadingSuggestions(true)
    try {
      const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      
      console.log('Autocomplete data:', data)
      
      if (data.success && data.data) {
        setSuggestions(data.data)
      } else {
        setSuggestions([])
      }
    } catch (error) {
      console.error('Autocomplete error:', error)
      setSuggestions([])
    } finally {
      setLoadingSuggestions(false)
    }
  }, [])

  const fetchImages = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (reset) {
      setLoading(true)
      setImages([])
    } else {
      setLoadingMore(true)
    }

    try {
      const sortMap: { [key in SortType]: string } = {
        score: 'order:score',
        new: 'order:id',
        random: 'order:random'
      }

      const searchTags = searchQuery.trim()
      const sortTag = sortMap[activeSort]

      let finalTags = sortTag
      if (searchTags) {
        finalTags = `${searchTags} ${sortTag}`
      }

      const params = new URLSearchParams({
        tags: finalTags,
        rating: activeFilter,
        page: pageNum.toString(),
        limit: '20'
      })

      console.log('Fetching images with params:', {
        tags: finalTags,
        rating: activeFilter,
        page: pageNum
      })

      const res = await fetch(`/api/danbooru?${params.toString()}`)
      const data = await res.json()

      console.log('Fetched images:', data)

      if (data.success) {
        if (reset) {
          setImages(data.data || [])
          setCurrentIndex(0)
          if (containerRef.current) {
            containerRef.current.scrollTop = 0
          }
        } else {
          setImages(prev => [...prev, ...(data.data || [])])
        }
        setHasMore(data.hasMore)
        setPage(pageNum)
      }
    } catch (error) {
      console.error('Failed to fetch images:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [searchQuery, activeFilter, activeSort])

  useEffect(() => {
    const query = router.query.tags as string
    if (query) {
      setSearchQuery(query)
      setSearchInput(query)
    }
  }, [router.query.tags])

  useEffect(() => {
    fetchImages(1, true)
  }, [fetchImages])

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchQuery(searchInput)
        if (searchInput) {
          router.push(`/fanart?tags=${searchInput}`, undefined, { shallow: true })
        } else {
          router.push('/fanart', undefined, { shallow: true })
        }
      }
    }, 500)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchInput])

  useEffect(() => {
    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current)
    }

    autocompleteTimeoutRef.current = setTimeout(() => {
      if (searchInput.trim().length >= 2) {
        fetchAutocomplete(searchInput)
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => {
      if (autocompleteTimeoutRef.current) {
        clearTimeout(autocompleteTimeoutRef.current)
      }
    }
  }, [searchInput, fetchAutocomplete])

  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          setCurrentIndex(index)
        }
      })
    }

    observerRef.current = new IntersectionObserver(handleIntersect, {
      threshold: 0.5,
      rootMargin: '0px'
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (!observerRef.current || images.length === 0) return

    const observer = observerRef.current
    const elements = document.querySelectorAll('[data-fanart-card]')
    
    elements.forEach(el => observer.observe(el))

    return () => {
      elements.forEach(el => observer.unobserve(el))
    }
  }, [images])

  useEffect(() => {
    const handleLoadMore = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && !loadingMore && hasMore && !loading) {
        console.log('Loading more images...')
        fetchImages(page + 1, false)
      }
    }

    loadMoreObserverRef.current = new IntersectionObserver(handleLoadMore, {
      threshold: 0.1,
      rootMargin: '400px'
    })

    if (loadMoreTriggerRef.current) {
      loadMoreObserverRef.current.observe(loadMoreTriggerRef.current)
    }

    return () => {
      if (loadMoreObserverRef.current) {
        loadMoreObserverRef.current.disconnect()
      }
    }
  }, [loadingMore, hasMore, loading, page, fetchImages])

  const handleSuggestionClick = (value: string) => {
    setSearchInput(value)
    setSearchQuery(value)
    setShowSuggestions(false)
    setSuggestions([])
    router.push(`/fanart?tags=${value}`, undefined, { shallow: true })
  }

  const handleTagClick = (tag: string) => {
    setSearchInput(tag)
    setSearchQuery(tag)
    router.push(`/fanart?tags=${tag}`, undefined, { shallow: true })
  }

  const handleShare = async (post: DanbooruPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Fanart from Aichiow',
          text: `Check out this artwork!`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handleDownload = async (post: DanbooruPost) => {
    try {
      const imageUrl = post.file_url || post.large_file_url
      const response = await fetch(`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `aichiow_${post.id}.${post.file_ext}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50
    if (info.offset.y < -threshold && currentIndex < images.length - 1) {
      const nextCard = document.querySelector(`[data-index="${currentIndex + 1}"]`)
      nextCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else if (info.offset.y > threshold && currentIndex > 0) {
      const prevCard = document.querySelector(`[data-index="${currentIndex - 1}"]`)
      prevCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' && currentIndex < images.length - 1) {
      e.preventDefault()
      const nextCard = document.querySelector(`[data-index="${currentIndex + 1}"]`)
      nextCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
      e.preventDefault()
      const prevCard = document.querySelector(`[data-index="${currentIndex - 1}"]`)
      prevCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentIndex, images.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const BackgroundDots = () => (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [0, 0.08, 0],
            y: [0, -30, 0],
            x: [0, 15, -15]
          }}
          transition={{ repeat: Infinity, duration: 10 + i, delay: i * 0.7 }}
          className="absolute bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 rounded-full blur-3xl"
          style={{
            width: 180 + i * 15,
            height: 180 + i * 15,
            left: `${i * 12}%`,
            top: `${8 + i * 8}%`
          }}
        />
      ))}
    </div>
  )

  return (
    <>
      <Head>
        <title>Fanart Gallery - Aichiow</title>
        <meta name="description" content="Discover amazing anime fanart" />
      </Head>

      <main className="relative min-h-screen bg-black text-white overflow-hidden">
        <BackgroundDots />

        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-4 mb-3">
              <button
                onClick={() => router.back()}
                className="p-2 sm:p-2.5 hover:bg-white/10 rounded-xl transition flex-shrink-0"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative flex-1 max-w-3xl mx-auto">
                <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true)
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search tags (e.g. miku, genshin_impact)..."
                  className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-sm sm:text-base focus:outline-none focus:border-sky-500 transition"
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput('')
                      setSearchQuery('')
                      setSuggestions([])
                      router.push('/fanart', undefined, { shallow: true })
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-80 overflow-y-auto z-50"
                    >
                      {suggestions.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => handleSuggestionClick(item.value)}
                          className="w-full px-4 py-3 hover:bg-white/10 transition flex items-center justify-between text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <FaHashtag className="w-3 h-3 text-sky-400" />
                            <span className="text-sm group-hover:text-sky-400 transition">
                              {item.label.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {item.post_count.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {loadingSuggestions && searchInput.length >= 2 && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <FiLoader className="w-4 h-4 text-sky-400" />
                    </motion.div>
                  </div>
                )}
              </div>

              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="p-2 sm:p-2.5 hover:bg-white/10 rounded-xl transition"
                >
                  <FiFilter className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {showFilterMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-xl z-50"
                    >
                      <div className="text-xs text-gray-400 px-3 py-2">Rating</div>
                      {(['safe', 'general', 'sensitive'] as FilterType[]).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            console.log('Setting filter to:', filter)
                            setActiveFilter(filter)
                            setShowFilterMenu(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                            activeFilter === filter
                              ? 'bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 text-white'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}

                      <div className="h-px bg-white/10 my-2" />

                      <div className="text-xs text-gray-400 px-3 py-2">Sort By</div>
                      <button
                        onClick={() => {
                          setActiveSort('score')
                          setShowFilterMenu(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
                          activeSort === 'score'
                            ? 'bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 text-white'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <FaFire className="w-3 h-3" />
                        Top Score
                      </button>
                      <button
                        onClick={() => {
                          setActiveSort('new')
                          setShowFilterMenu(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
                          activeSort === 'new'
                            ? 'bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 text-white'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <FaClock className="w-3 h-3" />
                        Newest
                      </button>
                      <button
                        onClick={() => {
                          setActiveSort('random')
                          setShowFilterMenu(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
                          activeSort === 'random'
                            ? 'bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 text-white'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <FaRandom className="w-3 h-3" />
                        Random
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition flex-shrink-0 ${
                    searchQuery === tag
                      ? 'bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 text-white shadow-lg shadow-sky-400/30'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {tag.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div
          ref={containerRef}
          className="relative z-10 pt-32 sm:pt-36 pb-20 h-screen overflow-y-auto"
          style={{ scrollBehavior: 'smooth' }}
        >
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <FiLoader className="w-8 h-8 text-sky-400" />
              </motion.div>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 px-4">
              <FiSearch className="w-12 h-12 mb-4" />
              <p className="text-lg">No results found</p>
              <p className="text-sm text-center">Try different tags or filters</p>
            </div>
          ) : (
            <div className="w-full px-3 sm:px-4 md:px-6 lg:px-12 space-y-4 sm:space-y-6 md:space-y-8">
              {images.map((post, index) => (
                <motion.div
                  key={post.id}
                  data-fanart-card
                  data-index={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.1}
                  onDragEnd={handleDragEnd}
                  className="mx-auto w-full max-w-full sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
                >
                  <div className="relative group">
                    <div
                      className="relative bg-white/5 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-sky-400/10 hover:shadow-sky-400/20 transition-all duration-300"
                      style={{
                        maxHeight: '75vh'
                      }}
                    >
                      <div className="relative w-full" style={{ aspectRatio: `${post.image_width}/${post.image_height}` }}>
                        {!imageLoaded[post.id] && (
                          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 to-sky-950/20 animate-pulse" />
                        )}
                        <Image
                          src={`/api/image-proxy?url=${encodeURIComponent(post.file_url || post.large_file_url || post.preview_file_url)}`}
                          alt={`Fanart ${post.id}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                          quality={90}
                          onLoadingComplete={() => setImageLoaded(prev => ({ ...prev, [post.id]: true }))}
                          onError={(e) => {
                            console.error('Image load error:', post.id)
                            const img = e.target as HTMLImageElement
                            const fallbackUrl = `/api/image-proxy?url=${encodeURIComponent(post.preview_file_url)}`
                            if (!img.src.includes(post.preview_file_url)) {
                              img.src = fallbackUrl
                            }
                          }}
                          priority={index < 3}
                          unoptimized
                        />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <motion.button
                        onClick={() => setShowActions(showActions === post.id ? null : post.id)}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-black/50 backdrop-blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        whileTap={{ scale: 0.9 }}
                      >
                        {showActions === post.id ? (
                          <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </motion.button>

                      <AnimatePresence>
                        {showActions === post.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex gap-2 sm:gap-3"
                          >
                            <button
                              onClick={() => handleShare(post)}
                              className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-black/80 backdrop-blur-xl rounded-xl hover:bg-black/90 transition text-xs sm:text-sm"
                            >
                              <FiShare2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Share</span>
                            </button>
                            <button
                              onClick={() => handleDownload(post)}
                              className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-black/80 backdrop-blur-xl rounded-xl hover:bg-black/90 transition text-xs sm:text-sm"
                            >
                              <FiDownload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Download</span>
                            </button>
                            <a
                              href={`https://danbooru.donmai.us/posts/${post.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 rounded-xl hover:shadow-lg hover:shadow-sky-400/30 transition text-xs sm:text-sm"
                            >
                              <FiExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Source</span>
                            </a>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-2 sm:mt-3 px-2">
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <FaStar className="w-3 h-3 text-yellow-400" />
                          <span>{post.score}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaStar className="w-3 h-3 text-sky-400" />
                          <span>{post.fav_count}</span>
                        </div>
                        {post.tag_string_artist && (
                          <div className="truncate flex-1">
                            by {post.tag_string_artist.split(' ')[0].replace(/_/g, ' ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div ref={loadMoreTriggerRef} className="h-32 flex items-center justify-center">
                {loadingMore && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <FiLoader className="w-6 h-6 text-sky-400" />
                  </motion.div>
                )}
                {!hasMore && images.length > 0 && (
                  <p className="text-sm text-gray-500">No more images</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-6 right-4 sm:right-6 flex flex-col gap-2 z-40">
          <motion.button
            onClick={() => {
              if (currentIndex > 0) {
                const prevCard = document.querySelector(`[data-index="${currentIndex - 1}"]`)
                prevCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            }}
            className="p-2.5 sm:p-3 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/10 transition disabled:opacity-30"
            disabled={currentIndex === 0}
            whileTap={{ scale: 0.9 }}
          >
            <FiChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
          <motion.button
            onClick={() => {
              if (currentIndex < images.length - 1) {
                const nextCard = document.querySelector(`[data-index="${currentIndex + 1}"]`)
                nextCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            }}
            className="p-2.5 sm:p-3 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/10 transition disabled:opacity-30"
            disabled={currentIndex === images.length - 1}
            whileTap={{ scale: 0.9 }}
          >
            <FiChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>

        <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-30" />
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  )
}
