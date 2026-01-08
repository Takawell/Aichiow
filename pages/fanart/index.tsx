import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import { FiArrowLeft, FiSearch, FiFilter, FiShare2, FiDownload, FiExternalLink, FiX, FiChevronUp, FiChevronDown, FiLoader, FiHeart, FiGrid, FiList } from 'react-icons/fi'
import { FaFire, FaStar, FaClock, FaRandom, FaHashtag, FaImage, FaPalette } from 'react-icons/fa'
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

  const ImageModal = ({ post }: { post: DanbooruPost }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedImage(null)}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
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
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <button
                onClick={() => router.back()}
                className="p-2 sm:p-2.5 hover:bg-white/10 rounded-xl transition"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative flex-1 max-w-2xl">
                <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search tags (e.g. miku, genshin_impact)..."
                  className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-sm sm:text-base focus:outline-none focus:border-white/20 focus:bg-white/10 transition"
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
                      className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-80 overflow-y-auto scrollbar-thin"
                    >
                      {suggestions.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => handleSuggestionClick(item.value)}
                          className="w-full px-4 py-3 hover:bg-white/10 transition flex items-center justify-between text-left border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <FaHashtag className="w-3 h-3 text-gray-400" />
                            <span className="text-sm">
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
                      <FiLoader className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'feed' ? 'grid' : 'feed')}
                  className="p-2 sm:p-2.5 hover:bg-white/10 rounded-xl transition"
                  title={viewMode === 'feed' ? 'Switch to Grid View' : 'Switch to Feed View'}
                >
                  {viewMode === 'feed' ? (
                    <FiGrid className="w-5 h-5" />
                  ) : (
                    <FiList className="w-5 h-5" />
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="p-2 sm:p-2.5 hover:bg-white/10 rounded-xl transition relative"
                  >
                    <FiFilter className="w-5 h-5" />
                    {(activeFilter !== 'safe' || activeSort !== 'score') && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showFilterMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-xl"
                      >
                        <div className="text-xs text-gray-400 px-3 py-2">Rating</div>
                        {(['safe', 'general', 'sensitive'] as FilterType[]).map((filter) => (
                          <button
                            key={filter}
                            onClick={() => {
                              setActiveFilter(filter)
                              setShowFilterMenu(false)
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                              activeFilter === filter
                                ? 'bg-white/20 text-white'
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
                              ? 'bg-white/20 text-white'
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
                              ? 'bg-white/20 text-white'
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
                              ? 'bg-white/20 text-white'
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
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-2 ${
                    searchQuery === tag
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <LuSparkles className="w-3 h-3" />
                  {tag.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div
          ref={containerRef}
          className={`relative z-10 pt-32 sm:pt-40 pb-20 px-3 sm:px-6 max-w-7xl mx-auto h-screen overflow-y-auto scrollbar-thin ${
            viewMode === 'feed' ? 'snap-y snap-proximity' : ''
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
              >
                <FiLoader className="w-8 h-8 text-white" />
              </motion.div>
              <p className="text-gray-400 text-sm">Loading artworks...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 gap-4">
              <FiSearch className="w-12 h-12" />
              <p className="text-lg">No results found</p>
              <p className="text-sm">Try different tags or filters</p>
            </div>
          ) : viewMode === 'feed' ? (
            <div className="space-y-6 sm:space-y-8">
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
                  className="snap-center mx-auto w-full max-w-2xl"
                >
                  <div className="relative group">
                    <div
                      className="relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:border-white/20"
                      style={{ maxHeight: '80vh' }}
                    >
                      <div className="relative w-full" style={{ aspectRatio: `${post.image_width}/${post.image_height}` }}>
                        {!imageLoaded[post.id] && (
                          <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
                            <FaImage className="w-12 h-12 text-white/20" />
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

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <button
                        onClick={() => toggleFavorite(post.id)}
                        className="absolute top-4 left-4 p-2.5 bg-black/60 backdrop-blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                      >
                        <FiHeart
                          className={`w-5 h-5 transition-colors ${
                            favorites.has(post.id) ? 'fill-red-500 text-red-500' : 'text-white'
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => setShowActions(showActions === post.id ? null : post.id)}
                        className="absolute top-4 right-4 p-2.5 bg-black/60 backdrop-blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                      >
                        {showActions === post.id ? (
                          <FiX className="w-5 h-5" />
                        ) : (
                          <FiChevronDown className="w-5 h-5" />
                        )}
                      </button>

                      <AnimatePresence>
                        {showActions === post.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-4 left-4 right-4 flex gap-2 sm:gap-3 z-10"
                          >
                            <button
                              onClick={() => handleShare(post)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black/80 backdrop-blur-xl rounded-xl hover:bg-black/90 transition text-sm border border-white/10"
                            >
                              <FiShare2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Share</span>
                            </button>
                            <button
                              onClick={() => handleDownload(post)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black/80 backdrop-blur-xl rounded-xl hover:bg-black/90 transition text-sm border border-white/10"
                            >
                              <FiDownload className="w-4 h-4" />
                              <span className="hidden sm:inline">Download</span>
                            </button>
                            <a
                              href={`/fanart/${post.id}`}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition text-sm"
                            >
                              <FiExternalLink className="w-4 h-4" />
                              <span className="hidden sm:inline">Source</span>
                           </a>      
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-4 px-2">
                      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-3 text-gray-400">
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
                            <FaStar className="w-3.5 h-3.5 text-yellow-400" />
                            <span>{post.score}</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
                            <FiHeart className="w-3.5 h-3.5 text-red-400" />
                            <span>{post.fav_count}</span>
                          </div>
                        </div>
                        {post.tag_string_artist && (
                          <div className="text-gray-400 text-xs truncate max-w-[200px] bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            by {post.tag_string_artist.split(' ')[0].replace(/_/g, ' ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div ref={loadMoreTriggerRef} className="h-20 flex items-center justify-center">
                {loadingMore && (
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <FiLoader className="w-6 h-6 text-white" />
                    </motion.div>
                    <p className="text-xs text-gray-500">Loading more...</p>
                  </div>
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
                  transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.3) }}
                  className="relative group aspect-square cursor-pointer"
                  onClick={() => setSelectedImage(post)}
                >
                  <div className="relative w-full h-full bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
                    {!imageLoaded[post.id] && (
                      <div className="absolute inset-0 bg-white/5 animate-pulse" />
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
                    <button
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
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-xs text-white">
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xl px-2 py-1 rounded-full">
                          <FaStar className="w-3 h-3 text-yellow-400" />
                          <span>{post.score}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xl px-2 py-1 rounded-full">
                          <FiHeart className="w-3 h-3 text-red-400" />
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
                    <FiLoader className="w-6 h-6 text-white" />
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
              <button
                onClick={() => {
                  if (currentIndex > 0) {
                    const prevCard = document.querySelector(`[data-index="${currentIndex - 1}"]`)
                    prevCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                }}
                className="p-3 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/10 transition disabled:opacity-30 shadow-lg"
                disabled={currentIndex === 0}
              >
                <FiChevronUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  if (currentIndex < images.length - 1) {
                    const nextCard = document.querySelector(`[data-index="${currentIndex + 1}"]`)
                    nextCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                }}
                className="p-3 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/10 transition disabled:opacity-30 shadow-lg"
                disabled={currentIndex === images.length - 1}
              >
                <FiChevronDown className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-6 left-6 p-3 bg-white/20 rounded-full hover:bg-white/30 transition shadow-lg z-40"
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
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        @media (max-width: 640px) {
          .scrollbar-thin::-webkit-scrollbar {
            width: 2px;
            height: 2px;
          }
        }
      `}</style>
    </>
  )
}
