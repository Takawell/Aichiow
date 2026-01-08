import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import { FiArrowLeft, FiSearch, FiFilter, FiShare2, FiDownload, FiExternalLink, FiX, FiChevronUp, FiChevronDown, FiLoader, FiHeart, FiEye, FiTrendingUp, FiGrid, FiList } from 'react-icons/fi'
import { FaFire, FaStar, FaClock, FaRandom, FaHashtag, FaImage, FaPalette} from 'react-icons/fa'
import { LuSparkles } from "react-icons/lu";

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
type ViewMode = 'feed' | 'grid'

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
  const [viewMode, setViewMode] = useState<ViewMode>('feed')
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [selectedImage, setSelectedImage] = useState<DanbooruPost | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

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
    'arknights',
    'honkai:_star_rail',
    'azur_lane'
  ]

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientY)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isSwipeUp = distance > minSwipeDistance
    const isSwipeDown = distance < -minSwipeDistance
    
    if (isSwipeUp && currentIndex < images.length - 1) {
      const nextCard = document.querySelector(`[data-index="${currentIndex + 1}"]`)
      nextCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    if (isSwipeDown && currentIndex > 0) {
      const prevCard = document.querySelector(`[data-index="${currentIndex - 1}"]`)
      prevCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem('fanart_favorites')
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)))
    }
  }, [])

  const toggleFavorite = (postId: number) => {
    setFavorites(prev => {
      const newFavs = new Set(prev)
      if (newFavs.has(postId)) {
        newFavs.delete(postId)
      } else {
        newFavs.add(postId)
      }
      localStorage.setItem('fanart_favorites', JSON.stringify([...newFavs]))
      return newFavs
    })
  }

  const fetchAutocomplete = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([])
      return
    }

    setLoadingSuggestions(true)
    try {
      const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (data.success) {
        setSuggestions(data.data || [])
      }
    } catch (error) {
      console.error('Autocomplete error:', error)
    } finally {
      setLoadingSuggestions(false)
    }
  }, [])

  const fetchImages = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (reset) {
      setLoading(true)
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
        limit: viewMode === 'grid' ? '30' : '20'
      })

      const res = await fetch(`/api/danbooru?${params.toString()}`)
      const data = await res.json()

      if (data.success) {
        if (reset) {
          setImages(data.data)
          setCurrentIndex(0)
          if (containerRef.current) {
            containerRef.current.scrollTop = 0
          }
        } else {
          setImages(prev => [...prev, ...data.data])
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
  }, [searchQuery, activeFilter, activeSort, viewMode])

  useEffect(() => {
    const query = router.query.tags as string
    if (query) {
      setSearchQuery(query)
      setSearchInput(query)
    }
    fetchImages(1, true)
  }, [])

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
    fetchImages(1, true)
  }, [searchQuery, activeFilter, activeSort, viewMode])

  useEffect(() => {
    if (viewMode === 'feed') {
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
    }
  }, [viewMode])

  useEffect(() => {
    if (viewMode === 'feed' && observerRef.current && images.length > 0) {
      const observer = observerRef.current
      const elements = document.querySelectorAll('[data-fanart-card]')
      
      elements.forEach(el => observer.observe(el))

      return () => {
        elements.forEach(el => observer.unobserve(el))
      }
    }
  }, [images, viewMode])

  useEffect(() => {
    const handleLoadMore = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && !loadingMore && hasMore && !loading) {
        fetchImages(page + 1, false)
      }
    }

    loadMoreObserverRef.current = new IntersectionObserver(handleLoadMore, {
      threshold: 0.1,
      rootMargin: '200px'
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

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setShowScrollTop(containerRef.current.scrollTop > 500)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
    if (viewMode === 'feed') {
      if (e.key === 'ArrowDown' && currentIndex < images.length - 1) {
        const nextCard = document.querySelector(`[data-index="${currentIndex + 1}"]`)
        nextCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        const prevCard = document.querySelector(`[data-index="${currentIndex - 1}"]`)
        prevCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentIndex, images.length, viewMode])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const BackgroundDots = () => (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black" />
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [0, 0.12, 0],
            y: [0, -40, 0],
            x: [0, 20 * (i % 2 === 0 ? 1 : -1), -15 * (i % 2 === 0 ? 1 : -1)],
            scale: [0.8, 1.1, 0.8]
          }}
          transition={{ repeat: Infinity, duration: 12 + i * 0.8, delay: i * 0.5, ease: "easeInOut" }}
          className="absolute rounded-full blur-3xl"
          style={{
            background: i % 3 === 0 
              ? 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)'
              : i % 3 === 1
              ? 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
            width: 200 + i * 20,
            height: 200 + i * 20,
            left: `${(i * 9) % 100}%`,
            top: `${(5 + i * 7) % 100}%`
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/10 via-transparent to-transparent" />
    </div>
  )

  const ImageModal = ({ post }: { post: DanbooruPost }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedImage(null)}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-7xl max-h-[90vh] w-full"
      >
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute -top-12 right-0 p-2 hover:bg-white/10 rounded-full transition z-10"
        >
          <FiX className="w-6 h-6" />
        </button>
        <div className="relative w-full h-full">
          <Image
            src={`/api/image-proxy?url=${encodeURIComponent(post.file_url || post.large_file_url)}`}
            alt={`Fanart ${post.id}`}
            fill
            className="object-contain"
            sizes="100vw"
            quality={95}
            unoptimized
          />
        </div>
      </motion.div>
    </motion.div>
  )

  return (
    <>
      <Head>
        <title>Fanart Gallery - Aichiow</title>
        <meta name="description" content="Discover amazing anime fanart" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <main className="relative min-h-screen bg-black text-white overflow-hidden">
        <BackgroundDots />

        <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-2xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="p-2 sm:p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 group"
              >
                <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </motion.button>

              <div className="relative flex-1 max-w-2xl">
                <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search tags (e.g. miku, genshin_impact)..."
                  className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-sm sm:text-base focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all duration-200"
                />
                {searchInput && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSearchInput('')
                      setSearchQuery('')
                      setSuggestions([])
                      router.push('/fanart', undefined, { shallow: true })
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition"
                  >
                    <FiX className="w-4 h-4" />
                  </motion.button>
                )}

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-80 overflow-y-auto custom-scrollbar"
                    >
                      {suggestions.map((item, idx) => (
                        <motion.button
                          key={item.value}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => handleSuggestionClick(item.value)}
                          className="w-full px-4 py-3 hover:bg-gradient-to-r hover:from-sky-500/10 hover:to-purple-500/10 transition-all duration-200 flex items-center justify-between text-left group border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-sky-500/10 rounded-lg group-hover:bg-sky-500/20 transition-colors">
                              <FaHashtag className="w-3 h-3 text-sky-400" />
                            </div>
                            <span className="text-sm group-hover:text-sky-400 transition-colors">
                              {item.label.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                            {item.post_count.toLocaleString()}
                          </span>
                        </motion.button>
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

              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(viewMode === 'feed' ? 'grid' : 'feed')}
                  className="p-2 sm:p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                >
                  {viewMode === 'feed' ? (
                    <FiGrid className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  ) : (
                    <FiList className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                </motion.button>

                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="p-2 sm:p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 group relative"
                  >
                    <FiFilter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {(activeFilter !== 'safe' || activeSort !== 'score') && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {showFilterMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-xl p-3 shadow-2xl"
                      >
                        <div className="flex items-center gap-2 text-xs text-gray-400 px-3 py-2 mb-2">
                          <FaPalette className="w-3 h-3" />
                          <span>Content Rating</span>
                        </div>
                        <div className="space-y-1 mb-3">
                          {(['safe', 'general', 'sensitive'] as FilterType[]).map((filter) => (
                            <motion.button
                              key={filter}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setActiveFilter(filter)
                                setShowFilterMenu(false)
                              }}
                              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                                activeFilter === filter
                                  ? 'bg-gradient-to-r from-sky-500 to-purple-500 text-white shadow-lg shadow-sky-500/30'
                                  : 'hover:bg-white/5'
                              }`}
                            >
                              {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </motion.button>
                          ))}
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-3" />

                        <div className="flex items-center gap-2 text-xs text-gray-400 px-3 py-2 mb-2">
                          <FiTrendingUp className="w-3 h-3" />
                          <span>Sort By</span>
                        </div>
                        <div className="space-y-1">
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setActiveSort('score')
                              setShowFilterMenu(false)
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
                              activeSort === 'score'
                                ? 'bg-gradient-to-r from-sky-500 to-purple-500 text-white shadow-lg shadow-sky-500/30'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <FaFire className="w-3.5 h-3.5" />
                            Top Score
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setActiveSort('new')
                              setShowFilterMenu(false)
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
                              activeSort === 'new'
                                ? 'bg-gradient-to-r from-sky-500 to-purple-500 text-white shadow-lg shadow-sky-500/30'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <FaClock className="w-3.5 h-3.5" />
                            Newest
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setActiveSort('random')
                              setShowFilterMenu(false)
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
                              activeSort === 'random'
                                ? 'bg-gradient-to-r from-sky-500 to-purple-500 text-white shadow-lg shadow-sky-500/30'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <FaRandom className="w-3.5 h-3.5" />
                            Random
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {trendingTags.map((tag, idx) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                    searchQuery === tag
                      ? 'bg-gradient-to-r from-sky-500 to-purple-500 text-white shadow-lg shadow-sky-400/30 scale-105'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                  }`}
                >
                  <FaSparkles className="w-3 h-3" />
                  {tag.replace(/_/g, ' ')}
                </motion.button>
              ))}
            </div>
          </div>
        </header>

        <div
          ref={containerRef}
          className={`relative z-10 pt-32 sm:pt-40 pb-20 px-3 sm:px-6 max-w-7xl mx-auto h-screen overflow-y-auto custom-scrollbar ${
            viewMode === 'feed' ? 'snap-y snap-proximity scroll-smooth' : ''
          }`}
          onTouchStart={viewMode === 'feed' ? onTouchStart : undefined}
          onTouchMove={viewMode === 'feed' ? onTouchMove : undefined}
          onTouchEnd={viewMode === 'feed' ? onTouchEnd : undefined}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="relative"
              >
                <div className="w-16 h-16 border-4 border-sky-500/20 border-t-sky-500 rounded-full" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-sky-500/20 rounded-full blur-xl"
                />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 text-sm"
              >
                Loading amazing artworks...
              </motion.p>
            </div>
          ) : images.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 gap-4"
            >
              <div className="relative">
                <FiSearch className="w-16 h-16 mb-4" />
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-sky-500/20 rounded-full blur-2xl"
                />
              </div>
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm">Try different tags or filters</p>
            </motion.div>
          ) : viewMode === 'feed' ? (
            <div className="space-y-6 sm:space-y-8">
              {images.map((post, index) => (
                <motion.div
                  key={post.id}
                  data-fanart-card
                  data-index={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  className="snap-center mx-auto w-full max-w-2xl"
                >
                  <div className="relative group">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.3 }}
                      className="relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-sky-400/5 hover:shadow-sky-400/15 hover:border-sky-500/30 transition-all duration-300"
                      style={{ maxHeight: '80vh' }}
                    >
                      <div className="relative w-full" style={{ aspectRatio: `${post.image_width}/${post.image_height}` }}>
                        {!imageLoaded[post.id] && (
                          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-purple-900/20 to-sky-950/20 animate-pulse">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              >
                                <FaImage className="w-12 h-12 text-white/20" />
                              </motion.div>
                            </div>
                          </div>
                        )}
                        <Image
                          src={`/api/image-proxy?url=${encodeURIComponent(post.file_url || post.large_file_url || post.preview_file_url)}`}
                          alt={`Fanart ${post.id}`}
                          fill
                          className="object-contain cursor-pointer"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
                          quality={90}
                          onClick={() => setSelectedImage(post)}
                          onLoadingComplete={() => setImageLoaded(prev => ({ ...prev, [post.id]: true }))}
                          onError={(e) => {
                            console.error('Image load error:', post.id)
                            const img = e.target as HTMLImageElement
                            const fallbackUrl = `/api/image-proxy?url=${encodeURIComponent(post.preview_file_url)}`
                            if (img.src !== fallbackUrl) {
                              img.src = fallbackUrl
                            }
                          }}
                          priority={index < 3}
                          unoptimized
                        />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleFavorite(post.id)}
                        className="absolute top-4 left-4 p-2.5 bg-black/60 backdrop-blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                      >
                        <FiHeart
                          className={`w-5 h-5 transition-colors ${
                            favorites.has(post.id) ? 'fill-red-500 text-red-500' : 'text-white'
                          }`}
                        />
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowActions(showActions === post.id ? null : post.id)}
                        className="absolute top-4 right-4 p-2.5 bg-black/60 backdrop-blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                      >
                        {showActions === post.id ? (
                          <FiX className="w-5 h-5" />
                        ) : (
                          <FiChevronDown className="w-5 h-5" />
                        )}
                      </motion.button>

                      <AnimatePresence>
                        {showActions === post.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-4 left-4 right-4 flex gap-2 sm:gap-3 z-10"
                          >
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleShare(post)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black/80 backdrop-blur-xl rounded-xl hover:bg-black/90 transition-all text-sm border border-white/10 hover:border-sky-500/50"
                            >
                              <FiShare2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Share</span>
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDownload(post)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black/80 backdrop-blur-xl rounded-xl hover:bg-black/90 transition-all text-sm border border-white/10 hover:border-sky-500/50"
                            >
                              <FiDownload className="w-4 h-4" />
                              <span className="hidden sm:inline">Download</span>
                            </motion.button>
                            <motion.a
                              whileTap={{ scale: 0.95 }}
                              href={`https://danbooru.donmai.us/posts/${post.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-sky-500 to-purple-500 rounded-xl hover:shadow-lg hover:shadow-sky-400/30 transition-all text-sm"
                            >
                              <FiExternalLink className="w-4 h-4" />
                              <span className="hidden sm:inline">Source</span>
                            </motion.a>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 px-2"
                    >
                      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-3 text-gray-400">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/10 rounded-lg border border-yellow-500/20"
                          >
                            <FaStar className="w-3.5 h-3.5 text-yellow-400" />
                            <span className="font-medium">{post.score}</span>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center gap-1.5 px-2 py-1 bg-sky-500/10 rounded-lg border border-sky-500/20"
                          >
                            <FiHeart className="w-3.5 h-3.5 text-sky-400" />
                            <span className="font-medium">{post.fav_count}</span>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20"
                          >
                            <FiEye className="w-3.5 h-3.5 text-purple-400" />
                          </motion.div>
                        </div>
                        {post.tag_string_artist && (
                          <div className="text-gray-400 text-xs truncate max-w-[200px] bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            by {post.tag_string_artist.split(' ')[0].replace(/_/g, ' ')}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}

              <div ref={loadMoreTriggerRef} className="h-20 flex items-center justify-center">
                {loadingMore && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="relative"
                    >
                      <div className="w-8 h-8 border-3 border-sky-500/20 border-t-sky-500 rounded-full" />
                    </motion.div>
                    <p className="text-xs text-gray-500">Loading more...</p>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {images.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  className="relative group aspect-square cursor-pointer"
                  onClick={() => setSelectedImage(post)}
                >
                  <div className="relative w-full h-full bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl overflow-hidden border border-white/10 shadow-lg hover:shadow-sky-400/20 hover:border-sky-500/50 transition-all duration-300">
                    {!imageLoaded[post.id] && (
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-purple-900/20 to-sky-950/20 animate-pulse" />
                    )}
                    <Image
                      src={`/api/image-proxy?url=${encodeURIComponent(post.preview_file_url)}`}
                      alt={`Fanart ${post.id}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      onLoadingComplete={() => setImageLoaded(prev => ({ ...prev, [post.id]: true }))}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(post.id)
                      }}
                      className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                    >
                      <FiHeart
                        className={`w-4 h-4 transition-colors ${
                          favorites.has(post.id) ? 'fill-red-500 text-red-500' : 'text-white'
                        }`}
                      />
                    </motion.button>
                    <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-xs text-white">
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xl px-2 py-1 rounded-full">
                          <FaStar className="w-3 h-3 text-yellow-400" />
                          <span>{post.score}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xl px-2 py-1 rounded-full">
                          <FiHeart className="w-3 h-3 text-sky-400" />
                          <span>{post.fav_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div ref={loadMoreTriggerRef} className="col-span-full h-20 flex items-center justify-center">
                {loadingMore && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <FiLoader className="w-6 h-6 text-sky-400" />
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {viewMode === 'feed' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed bottom-6 right-6 flex flex-col gap-2 z-40"
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (currentIndex > 0) {
                    const prevCard = document.querySelector(`[data-index="${currentIndex - 1}"]`)
                    prevCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                }}
                className="p-3 bg-black/80 backdrop-blur-2xl rounded-full border border-white/10 hover:bg-gradient-to-br hover:from-sky-500/20 hover:to-purple-500/20 hover:border-sky-500/50 transition-all duration-300 disabled:opacity-30 shadow-lg"
                disabled={currentIndex === 0}
              >
                <FiChevronUp className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (currentIndex < images.length - 1) {
                    const nextCard = document.querySelector(`[data-index="${currentIndex + 1}"]`)
                    nextCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                }}
                className="p-3 bg-black/80 backdrop-blur-2xl rounded-full border border-white/10 hover:bg-gradient-to-br hover:from-sky-500/20 hover:to-purple-500/20 hover:border-sky-500/50 transition-all duration-300 disabled:opacity-30 shadow-lg"
                disabled={currentIndex === images.length - 1}
              >
                <FiChevronDown className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="fixed bottom-6 left-6 p-3 bg-gradient-to-br from-sky-500 to-purple-500 rounded-full shadow-lg shadow-sky-400/30 hover:shadow-sky-400/50 transition-all duration-300 z-40"
            >
              <FiChevronUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-30" />

        <AnimatePresence>
          {selectedImage && <ImageModal post={selectedImage} />}
        </AnimatePresence>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgb(56, 189, 248), rgb(168, 85, 247));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgb(14, 165, 233), rgb(147, 51, 234));
        }
        @media (max-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 3px;
            height: 3px;
          }
        }
      `}</style>
    </>
  )
}
