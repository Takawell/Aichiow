import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { 
  FiArrowLeft, 
  FiShare2, 
  FiDownload, 
  FiExternalLink, 
  FiHeart, 
  FiClock, 
  FiUser,
  FiTag,
  FiZoomIn,
  FiZoomOut,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiCopy,
  FiCheck
} from 'react-icons/fi'
import { FaStar, FaHashtag } from 'react-icons/fa'
import { LuSparkles } from 'react-icons/lu'

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
  tag_string_general: string
  tag_string_meta: string
  rating: string
  score: number
  fav_count: number
  file_ext: string
  image_width: number
  image_height: number
  source: string
  pixiv_id: number | null
  md5: string
}

export default function FanartDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState<DanbooruPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [copiedId, setCopiedId] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'tags' | 'source'>('info')

  useEffect(() => {
    if (!id) return

    const fetchPost = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/danbooru/${id}`)
        const data = await res.json()

        if (!data.success) {
          setError(data.error || 'Failed to load artwork')
          return
        }

        setPost(data.data)

        const favorites = localStorage.getItem('fanart_favorites')
        if (favorites) {
          const favSet = new Set(JSON.parse(favorites))
          setIsFavorite(favSet.has(data.data.id))
        }
      } catch (err) {
        console.error('Error fetching post:', err)
        setError('Failed to load artwork')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const toggleFavorite = () => {
    if (!post) return

    const favorites = localStorage.getItem('fanart_favorites')
    const favSet = new Set(favorites ? JSON.parse(favorites) : [])

    if (favSet.has(post.id)) {
      favSet.delete(post.id)
      setIsFavorite(false)
    } else {
      favSet.add(post.id)
      setIsFavorite(true)
    }

    localStorage.setItem('fanart_favorites', JSON.stringify([...favSet]))
  }

  const handleShare = async () => {
    if (!post) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Fanart #${post.id} - Aichiow`,
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

  const handleDownload = async () => {
    if (!post) return

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

  const copyId = () => {
    if (!post) return
    navigator.clipboard.writeText(post.id.toString())
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const parseTags = (tagString: string) => {
    if (!tagString) return []
    return tagString.split(' ').filter(tag => tag.length > 0)
  }

  const handleTagClick = (tag: string) => {
    router.push(`/fanart?tags=${encodeURIComponent(tag)}`)
  }

  const FullscreenModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
      onClick={() => setShowFullscreen(false)}
    >
      <button
        onClick={() => setShowFullscreen(false)}
        className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition z-10"
      >
        <FiX className="w-6 h-6" />
      </button>

      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setZoomLevel(prev => Math.min(prev + 0.5, 3))
          }}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
        >
          <FiZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setZoomLevel(prev => Math.max(prev - 0.5, 0.5))
          }}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
        >
          <FiZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setZoomLevel(1)
          }}
          className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-full transition text-sm"
        >
          Reset
        </button>
      </div>

      <motion.div
        style={{ scale: zoomLevel }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative max-w-[95vw] max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {post && (
          <Image
            src={`/api/image-proxy?url=${encodeURIComponent(post.file_url || post.large_file_url)}`}
            alt={`Fanart ${post.id}`}
            width={post.image_width}
            height={post.image_height}
            className="object-contain max-w-full max-h-[95vh]"
            quality={100}
            unoptimized
          />
        )}
      </motion.div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <FiLoader className="w-12 h-12 text-white" />
          </motion.div>
          <p className="text-gray-400">Loading artwork...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6"
          >
            <FiAlertCircle className="w-10 h-10 text-red-400" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Artwork Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'The artwork you are looking for does not exist.'}</p>
          <Link href="/fanart">
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition">
              Back to Gallery
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Fanart #{post.id} - Aichiow</title>
        <meta name="description" content={`View artwork #${post.id} - Score: ${post.score}, Favorites: ${post.fav_count}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <main className="min-h-screen bg-black text-white">
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-white/10 rounded-xl transition"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </button>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold">Artwork Details</h1>
                  <p className="text-xs text-gray-400">ID: {post.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFavorite}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition"
                >
                  <FiHeart
                    className={`w-5 h-5 transition-colors ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
                    }`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition"
                >
                  <FiDownload className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="pt-20 pb-8 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 group"
              >
                <div 
                  className="relative w-full cursor-zoom-in"
                  style={{ 
                    aspectRatio: `${post.image_width}/${post.image_height}`,
                    maxHeight: '80vh'
                  }}
                  onClick={() => setShowFullscreen(true)}
                >
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
                      <FiLoader className="w-12 h-12 text-white/20 animate-spin" />
                    </div>
                  )}
                  <Image
                    src={`/api/image-proxy?url=${encodeURIComponent(post.file_url || post.large_file_url)}`}
                    alt={`Fanart ${post.id}`}
                    fill
                    className="object-contain"
                    quality={95}
                    onLoadingComplete={() => setImageLoaded(true)}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                    unoptimized
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-full">
                      {post.image_width} × {post.image_height}
                    </div>
                    <div className="px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-full uppercase">
                      {post.file_ext}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowFullscreen(true)
                      }}
                      className="ml-auto px-4 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-full transition flex items-center gap-2"
                    >
                      <FiZoomIn className="w-4 h-4" />
                      <span className="hidden sm:inline">View Fullscreen</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 rounded-2xl border border-white/10 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Information</h2>
                  <button
                    onClick={copyId}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition text-sm"
                  >
                    {copiedId ? (
                      <>
                        <FiCheck className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="w-4 h-4" />
                        <span>#{post.id}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <FaStar className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Score</div>
                      <div className="text-lg font-semibold text-white">{post.score}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <FiHeart className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Favorites</div>
                      <div className="text-lg font-semibold text-white">{post.fav_count}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <FiClock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Posted</div>
                      <div className="text-sm font-medium text-white">{formatDate(post.created_at)}</div>
                    </div>
                  </div>

                  {post.tag_string_artist && (
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <FiUser className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">Artist</div>
                        <button
                          onClick={() => handleTagClick(parseTags(post.tag_string_artist)[0])}
                          className="text-sm font-medium text-white hover:text-purple-400 transition truncate block"
                        >
                          {parseTags(post.tag_string_artist)[0].replace(/_/g, ' ')}
                        </button>
                      </div>
                    </div>
                  )}

                  {post.tag_string_copyright && (
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <LuSparkles className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">Series</div>
                        <button
                          onClick={() => handleTagClick(parseTags(post.tag_string_copyright)[0])}
                          className="text-sm font-medium text-white hover:text-green-400 transition truncate block"
                        >
                          {parseTags(post.tag_string_copyright)[0].replace(/_/g, ' ')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex gap-2">
                    {post.source && (
                      <a
                        href={post.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition text-sm"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        <span className="hidden sm:inline">Original Source</span>
                        <span className="sm:hidden">Source</span>
                      </a>
                    )}
                    <a
                      href={`https://danbooru.donmai.us/posts/${post.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition text-sm"
                    >
                      <FiExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">Danbooru</span>
                      <span className="sm:hidden">DB</span>
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
              >
                <div className="flex border-b border-white/10">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                      activeTab === 'info'
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <FiTag className="w-4 h-4 inline mr-2" />
                    Characters
                  </button>
                  <button
                    onClick={() => setActiveTab('tags')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                      activeTab === 'tags'
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <FaHashtag className="w-4 h-4 inline mr-2" />
                    Tags
                  </button>
                </div>

                <div className="p-4 max-h-96 overflow-y-auto scrollbar-thin">
                  <AnimatePresence mode="wait">
                    {activeTab === 'info' && (
                      <motion.div
                        key="info"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-2"
                      >
                        {post.tag_string_character ? (
                          parseTags(post.tag_string_character).map((tag) => (
                            <button
                              key={tag}
                              onClick={() => handleTagClick(tag)}
                              className="block w-full px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-left text-sm transition group"
                            >
                              <span className="group-hover:text-blue-400 transition">
                                {tag.replace(/_/g, ' ')}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm text-center py-4">No character tags</p>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'tags' && (
                      <motion.div
                        key="tags"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-wrap gap-2"
                      >
                        {parseTags(post.tag_string_general).slice(0, 50).map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs transition hover:text-blue-400"
                          >
                            {tag.replace(/_/g, ' ')}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showFullscreen && <FullscreenModal />}
        </AnimatePresence>
      </main>

      <style jsx global>{`
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
      `}</style>
    </>
  )
}
