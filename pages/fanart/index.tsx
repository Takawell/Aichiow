import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import { FiArrowLeft, FiSearch, FiFilter, FiShare2, FiDownload, FiExternalLink, FiX, FiChevronUp, FiChevronDown, FiLoader, FiHeart, FiGrid, FiList } from 'react-icons/fi'
import { FaFire, FaStar, FaClock, FaRandom, FaHashtag, FaImage } from 'react-icons/fa'
import { LuSparkles } from "react-icons/lu"

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
    'azur_lane',
    'hatsune_miku',
    'blue_archive',
    'genshin_impact',
    'wuthering_waves',
    'fate/grand_order',
    'honkai:_star_rail',
    'zenless_zone_zero',
    'punishing:_gray_raven',
    'goddess_of_victory:_nikke',
    'neverness_to_everness',
    'original',
    'touhou',
    'vtuber',
    'arknights'
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
    if (viewMode === 'feed' && !selectedImage) {
      if (e.key === 'ArrowDown' && currentIndex < images.length - 1) {
        const nextCard = document.querySelector(`[data-index="${currentIndex + 1}"]`)
        nextCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        const prevCard = document.querySelector(`[data-index="${currentIndex - 1}"]`)
        prevCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
    if (selectedImage && e.key === 'Escape') {
      setSelectedImage(null)
    }
  }, [currentIndex, images.length, viewMode, selectedImage])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const ImageModal = ({ post }: { post: DanbooruPost }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => setSelectedImage(null)}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
    >
      <button
        onClick={() => setSelectedImage(null)}
        className="absolute top-4 right-4 p-2.5 hover:bg-white/10 rounded-full transition z-50 bg-black/50 backdrop-blur-md border border-white/10"
      >
        <FiX className="w-5 h-5" />
      </button>

      <div className="flex items-center justify-center w-full h-full p-4 md:p-8">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full max-w-7xl max-h-full"
        >
          <div className="relative w-full h-full">
            <Image
              src={`/api/image-proxy?url=${encodeURIComponent(post.file_url || post.large_file_url)}`}
              alt={`Fanart ${post.id}`}
              fill
              className="object-contain"
              sizes="100vw"
              quality={95}
              unoptimized
              priority
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 backdrop-blur-xl rounded-2xl p-2.5 border border-white/10"
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(post.id)
          }}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 active:scale-95"
        >
          <FiHeart
            className={`w-4 h-4 transition-colors ${
              favorites.has(post.id) ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
          <span className="text-xs hidden sm:inline">
            {favorites.has(post.id) ? 'Favorited' : 'Favorite'}
          </span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleShare(post)
          }}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 active:scale-95"
        >
          <FiShare2 className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">Share</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDownload(post)
          }}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 active:scale-95"
        >
          <FiDownload className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">Download</span>
        </button>

        <a
          href={`/fanart/${post.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 active:scale-95"
        >
          <FiExternalLink className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">Details</span>
        </a>
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
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
            <div className="flex items-center gap-2 mb-2.5">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95 shrink-0"
              >
                <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="relative flex-1 max-w-2xl">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search tags..."
                  className="w-full pl-9 pr-9 py-2 sm:py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all duration-200 placeholder:text-gray-500"
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput('')
                      setSearchQuery('')
                      setSuggestions([])
                      router.push('/fanart', undefined, { shallow: true })
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute top-full left-0 right-0 mt-1.5 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-72 overflow-y-auto scrollbar-thin z-50"
                    >
                      {suggestions.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => handleSuggestionClick(item.value)}
                          className="w-full px-3.5 py-2.5 hover:bg-white/8 transition-colors duration-150 flex items-center justify-between text-left border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center gap-2.5">
                            <FaHashtag className="w-3 h-3 text-gray-500 shrink-0" />
                            <span className="text-sm text-gray-200">
                              {item.label.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 ml-2 shrink-0">
                            {item.post_count.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {loadingSuggestions && searchInput.length >= 2 && (
                  <div className="absolute right-9 top-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <FiLoader className="w-3.5 h-3.5 text-gray-400" />
                    </motion.div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setViewMode(viewMode === 'feed' ? 'grid' : 'feed')}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
                  title={viewMode === 'feed' ? 'Switch to Grid View' : 'Switch to Feed View'}
                >
                  {viewMode === 'feed' ? (
                    <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95 relative"
                  >
                    <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
                    {(activeFilter !== 'safe' || activeSort !== 'score') && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-sky-400 rounded-full" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showFilterMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-1.5 w-44 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 shadow-2xl z-50"
                      >
                        <div className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase px-2.5 py-1.5">Rating</div>
                        {(['safe', 'general', 'sensitive'] as FilterType[]).map((filter) => (
                          <button
                            key={filter}
                            onClick={() => {
                              setActiveFilter(filter)
                              setShowFilterMenu(false)
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all duration-150 ${
                              activeFilter === filter
                                ? 'bg-white/15 text-white'
                                : 'hover:bg-white/8 text-gray-300'
                            }`}
                          >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                          </button>
                        ))}

                        <div className="h-px bg-white/8 my-1" />

                        <div className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase px-2.5 py-1.5">Sort By</div>
                        <button
                          onClick={() => {
                            setActiveSort('score')
                            setShowFilterMenu(false)
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all duration-150 flex items-center gap-2 ${
                            activeSort === 'score'
                              ? 'bg-white/15 text-white'
                              : 'hover:bg-white/8 text-gray-300'
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
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all duration-150 flex items-center gap-2 ${
                            activeSort === 'new'
                              ? 'bg-white/15 text-white'
                              : 'hover:bg-white/8 text-gray-300'
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
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all duration-150 flex items-center gap-2 ${
                            activeSort === 'random'
                              ? 'bg-white/15 text-white'
                              : 'hover:bg-white/8 text-gray-300'
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
            </div>

            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    searchQuery === tag
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300'
                  }`}
                >
                  <LuSparkles className="w-2.5 h-2.5 shrink-0" />
                  {tag.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div
          ref={containerRef}
          className={`relative z-10 pt-28 sm:pt-32 pb-20 px-3 sm:px-6 max-w-7xl mx-auto h-screen overflow-y-auto scrollbar-thin ${
            viewMode === 'feed' ? 'feed-scroll-container' : ''
          }`}
          onTouchStart={viewMode === 'feed' ? onTouchStart : undefined}
          onTouchMove={viewMode === 'feed' ? onTouchMove : undefined}
          onTouchEnd={viewMode === 'feed' ? onTouchEnd : undefined}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <FiLoader className="w-7 h-7 text-white/60" />
              </motion.div>
              <p className="text-gray-500 text-sm">Loading artworks...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 gap-3">
              <FiSearch className="w-10 h-10" />
              <p className="text-base font-medium">No results found</p>
              <p className="text-sm text-gray-600">Try different tags or filters</p>
            </div>
          ) : viewMode === 'feed' ? (
            <div className="space-y-5 sm:space-y-6">
              {images.map((post, index) => (
                <motion.div
                  key={post.id}
                  data-fanart-card
                  data-index={index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.04, 0.25),
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.08}
                  onDragEnd={handleDragEnd}
                  className="feed-card mx-auto w-full max-w-xl"
                >
                  <div className="relative group">
                    <div
                      className="relative bg-white/5 rounded-2xl overflow-hidden border border-white/8 transition-all duration-300 hover:border-white/18 hover:shadow-2xl hover:shadow-black/50"
                      style={{ maxHeight: '80vh' }}
                    >
                      <div className="relative w-full" style={{ aspectRatio: `${post.image_width}/${post.image_height}` }}>
                        {!imageLoaded[post.id] && (
                          <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
                            <FaImage className="w-10 h-10 text-white/10" />
                          </div>
                        )}
                        <Image
                          src={`/api/image-proxy?url=${encodeURIComponent(post.file_url || post.large_file_url || post.preview_file_url)}`}
                          alt={`Fanart ${post.id}`}
                          fill
                          className="object-contain cursor-pointer transition-transform duration-500 group-hover:scale-[1.01]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
                          quality={90}
                          onClick={() => setSelectedImage(post)}
                          onLoadingComplete={() => setImageLoaded(prev => ({ ...prev, [post.id]: true }))}
                          onError={(e) => {
                            const img = e.target as HTMLImageElement
                            const fallbackUrl = `/api/image-proxy?url=${encodeURIComponent(post.preview_file_url)}`
                            if (img.src !== fallbackUrl) {
                              img.src = fallbackUrl
                            }
                          }}
                          priority={index < 2}
                          unoptimized
                        />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none" />

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(post.id)
                        }}
                        className="absolute top-3 left-3 p-2 bg-black/60 backdrop-blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 hover:scale-110 active:scale-95 border border-white/10"
                      >
                        <FiHeart
                          className={`w-4 h-4 transition-colors ${
                            favorites.has(post.id) ? 'fill-red-500 text-red-500' : 'text-white'
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => setShowActions(showActions === post.id ? null : post.id)}
                        className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 border border-white/10"
                      >
                        {showActions === post.id ? (
                          <FiX className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      <AnimatePresence>
                        {showActions === post.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="absolute bottom-3 left-3 right-3 flex gap-2 z-10"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleShare(post)
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-black/80 backdrop-blur-xl rounded-xl hover:bg-black/90 transition-all duration-200 text-xs border border-white/10 active:scale-95"
                            >
                              <FiShare2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Share</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(post)
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-black/80 backdrop-blur-xl rounded-xl hover:bg-black/90 transition-all duration-200 text-xs border border-white/10 active:scale-95"
                            >
                              <FiDownload className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Download</span>
                            </button>
                            <a
                              href={`/fanart/${post.id}`}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-200 text-xs active:scale-95"
                            >
                              <FiExternalLink className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Details</span>
                            </a>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-3 px-1">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/8">
                            <FaStar className="w-3 h-3 text-yellow-400" />
                            <span>{post.score}</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/8">
                            <FiHeart className="w-3 h-3 text-red-400" />
                            <span>{post.fav_count}</span>
                          </div>
                        </div>
                        {post.tag_string_artist && (
                          <div className="text-gray-500 text-xs truncate max-w-[160px] bg-white/5 px-2.5 py-1 rounded-full border border-white/8">
                            by {post.tag_string_artist.split(' ')[0].replace(/_/g, ' ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div ref={loadMoreTriggerRef} className="h-16 flex items-center justify-center">
                {loadingMore && (
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <FiLoader className="w-5 h-5 text-white/50" />
                    </motion.div>
                    <p className="text-xs text-gray-600">Loading more...</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-2.5 sm:gap-3">
              {images.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.25,
                    delay: Math.min(index * 0.02, 0.25),
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="relative group break-inside-avoid mb-2.5 sm:mb-3"
                >
                  <div className="relative w-full bg-white/5 rounded-xl overflow-hidden border border-white/8 hover:border-white/18 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-black/40">
                    <div
                      className="relative w-full"
                      style={{
                        aspectRatio: `${post.image_width}/${post.image_height}`,
                      }}
                    >
                      {!imageLoaded[post.id] && (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/4 animate-pulse flex items-center justify-center">
                          <FaImage className="w-7 h-7 text-white/15" />
                        </div>
                      )}
                      <Image
                        src={`/api/image-proxy?url=${encodeURIComponent(post.large_file_url || post.file_url || post.preview_file_url)}`}
                        alt={`Fanart ${post.id}`}
                        fill
                        className="object-cover transition-transform duration-400 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        quality={85}
                        onClick={() => setSelectedImage(post)}
                        onLoadingComplete={() => setImageLoaded(prev => ({ ...prev, [post.id]: true }))}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          const fallbackUrl = `/api/image-proxy?url=${encodeURIComponent(post.preview_file_url)}`
                          if (!img.src.includes(post.preview_file_url)) {
                            img.src = fallbackUrl
                          }
                        }}
                        unoptimized
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250" />

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(post.id)
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 hover:bg-black/90 hover:scale-110 active:scale-95"
                      >
                        <FiHeart
                          className={`w-3.5 h-3.5 transition-colors ${
                            favorites.has(post.id) ? 'fill-red-500 text-red-500' : 'text-white'
                          }`}
                        />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-250 translate-y-1 group-hover:translate-y-0">
                        <div className="flex items-center justify-between gap-1.5 text-xs text-white mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-full">
                              <FaStar className="w-2.5 h-2.5 text-yellow-400" />
                              <span className="text-xs">{post.score}</span>
                            </div>
                            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-full">
                              <FiHeart className="w-2.5 h-2.5 text-red-400" />
                              <span className="text-xs">{post.fav_count}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleShare(post)
                            }}
                            className="flex-1 flex items-center justify-center px-2 py-1.5 bg-black/70 backdrop-blur-md rounded-lg hover:bg-black/90 transition text-xs active:scale-95"
                          >
                            <FiShare2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(post)
                            }}
                            className="flex-1 flex items-center justify-center px-2 py-1.5 bg-black/70 backdrop-blur-md rounded-lg hover:bg-black/90 transition text-xs active:scale-95"
                          >
                            <FiDownload className="w-3 h-3" />
                          </button>
                          <a
                            href={`/fanart/${post.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex items-center justify-center px-2 py-1.5 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 transition text-xs active:scale-95"
                          >
                            <FiExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div ref={loadMoreTriggerRef} className="col-span-full h-16 flex items-center justify-center break-inside-avoid">
                {loadingMore && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <FiLoader className="w-5 h-5 text-white/50" />
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {viewMode === 'feed' && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-6 right-4 flex flex-col gap-1.5 z-40"
            >
              <button
                onClick={() => {
                  if (currentIndex > 0) {
                    const prevCard = document.querySelector(`[data-index="${currentIndex - 1}"]`)
                    prevCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                }}
                className="p-2.5 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-25 shadow-lg active:scale-95"
                disabled={currentIndex === 0}
              >
                <FiChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (currentIndex < images.length - 1) {
                    const nextCard = document.querySelector(`[data-index="${currentIndex + 1}"]`)
                    nextCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                }}
                className="p-2.5 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-25 shadow-lg active:scale-95"
                disabled={currentIndex === images.length - 1}
              >
                <FiChevronDown className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              onClick={scrollToTop}
              className="fixed bottom-6 left-4 p-2.5 bg-white/15 backdrop-blur-xl rounded-full hover:bg-white/25 transition-all duration-200 shadow-lg z-40 border border-white/10 active:scale-95"
            >
              <FiChevronUp className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-30" />

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
        .scrollbar-thin::-webkit-scrollbar {
          width: 3px;
          height: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.22);
        }
        @media (max-width: 640px) {
          .scrollbar-thin::-webkit-scrollbar {
            width: 2px;
            height: 2px;
          }
        }

        .feed-scroll-container {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        .feed-card {
          will-change: transform;
          transform: translateZ(0);
        }

        * {
          -webkit-font-smoothing: antialiased;
        }

        @media (prefers-reduced-motion: no-preference) {
          .feed-scroll-container {
            scroll-behavior: smooth;
          }
        }
      `}</style>
    </>
  )
}
