'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { UserRow, FavoriteRow } from '@/types/supabase'
import {
  FaHistory,
  FaStar,
  FaTv,
  FaBook,
  FaBookOpen,
  FaDragon,
  FaUserPlus,
  FaCalendar,
  FaFire,
} from 'react-icons/fa'

type TrailerHistoryRow = {
  id: number
  user_id: string
  anime_id: number
  trailer_id: string
  trailer_site: string
  trailer_thumbnail: string | null
  watched_at: string
  watch_count: number
  anime: {
    title_romaji?: string
    cover_image?: string
  } | null
}

const fallbackAvatars = ['/default.png', '/v2.png', '/v3.png', '/v4.png']

export default function PublicUserPage() {
  const router = useRouter()
  const { username } = router.query

  const [user, setUser] = useState<UserRow | null>(null)
  const [history, setHistory] = useState<TrailerHistoryRow[]>([])
  const [favorites, setFavorites] = useState<FavoriteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!router.isReady) return

    const loadUserProfile = async () => {
      if (!username || typeof username !== 'string') {
        setNotFound(true)
        setLoading(false)
        return
      }

      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .ilike('username', username)
          .single()

        if (userError || !userData) {
          setNotFound(true)
          setLoading(false)
          return
        }

        setUser(userData)

        const userId = userData.id

        const { data: rawHistory } = await supabase
          .from('trailer_watch_history')
          .select(`
            id,
            user_id,
            anime_id,
            trailer_id,
            trailer_site,
            trailer_thumbnail,
            watched_at,
            watch_count,
            anime:anime_id (
              title_romaji,
              cover_image
            )
          `)
          .eq('user_id', userId)
          .order('watched_at', { ascending: false })

        if (rawHistory && Array.isArray(rawHistory)) {
          const normalized: TrailerHistoryRow[] = rawHistory.map((it: any) => {
            let animeObj: any = null
            if (it.anime) {
              if (Array.isArray(it.anime)) animeObj = it.anime[0] ?? null
              else animeObj = it.anime
            }
            return {
              id: it.id,
              user_id: it.user_id,
              anime_id: it.anime_id,
              trailer_id: it.trailer_id,
              trailer_site: it.trailer_site,
              trailer_thumbnail: it.trailer_thumbnail ?? null,
              watched_at: it.watched_at,
              watch_count:
                typeof it.watch_count === 'number'
                  ? it.watch_count
                  : Number(it.watch_count) || 1,
              anime: animeObj
                ? {
                    title_romaji: animeObj.title_romaji ?? 'Unknown',
                    cover_image: animeObj.cover_image ?? '/default.png',
                  }
                : null,
            }
          })
          setHistory(normalized)
        }

        const { data: favoritesData } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', userId)

        if (favoritesData) setFavorites(favoritesData as FavoriteRow[])
      } catch (err) {
        console.error('Error loading user profile:', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [router.isReady, username])

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const fallback = fallbackAvatars[Math.floor(Math.random() * fallbackAvatars.length)]
    e.currentTarget.src = fallback
  }

  const groupedFavs = {
    anime: favorites.filter((f) => f.media_type === 'anime'),
    manga: favorites.filter((f) => f.media_type === 'manga'),
    manhwa: favorites.filter((f) => f.media_type === 'manhwa'),
    light_novel: favorites.filter((f) => f.media_type === 'light_novel'),
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center"
          >
            <span className="text-4xl sm:text-5xl">🔍</span>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300 mb-3">
            User Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mb-6">
            The user "{username}" doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold hover:from-sky-400 hover:to-blue-500 active:scale-95 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white antialiased overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-600/15 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 max-w-[1800px]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl sm:rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500" />
              <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-950/95 via-black/95 to-slate-950/95 border border-sky-500/20 backdrop-blur-xl shadow-2xl">
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full blur-xl opacity-60 animate-pulse" />
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full p-1 bg-gradient-to-tr from-sky-400 to-blue-500 shadow-2xl">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-black/50">
                          <img
                            src={user.avatar_url || '/default.png'}
                            alt={user.username || 'User'}
                            onError={handleImageError}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-sky-200 to-blue-300">
                        {user.username || 'Anonymous'}
                      </h1>
                      <button className="mx-auto md:mx-0 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm sm:text-base hover:from-sky-400 hover:to-blue-500 active:scale-95 transition-all duration-200 flex items-center gap-2 shadow-lg">
                        <FaUserPlus className="text-sm sm:text-base" />
                        <span>Follow</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-sky-300/70 leading-relaxed mb-4 max-w-2xl mx-auto md:mx-0">
                      {user.bio || 'Anime • Manga • Manhwa • Light Novels'}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      <div className="relative group/stat">
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl blur opacity-40 group-hover/stat:opacity-60 transition" />
                        <div className="relative p-3 sm:p-4 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-600/10 border border-sky-500/30">
                          <div className="flex items-center gap-2 mb-1">
                            <FaHistory className="text-sky-400 text-xs sm:text-sm" />
                            <p className="text-[10px] sm:text-xs text-sky-300 font-medium">History</p>
                          </div>
                          <p className="text-xl sm:text-2xl md:text-3xl font-black text-sky-400">{history.length}</p>
                        </div>
                      </div>

                      <div className="relative group/stat">
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl blur opacity-40 group-hover/stat:opacity-60 transition" />
                        <div className="relative p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
                          <div className="flex items-center gap-2 mb-1">
                            <FaStar className="text-blue-400 text-xs sm:text-sm" />
                            <p className="text-[10px] sm:text-xs text-blue-300 font-medium">Favorites</p>
                          </div>
                          <p className="text-xl sm:text-2xl md:text-3xl font-black text-blue-400">{favorites.length}</p>
                        </div>
                      </div>

                      <div className="relative group/stat">
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500 to-green-600 rounded-xl blur opacity-40 group-hover/stat:opacity-60 transition" />
                        <div className="relative p-3 sm:p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30">
                          <div className="flex items-center gap-2 mb-1">
                            <FaCalendar className="text-green-400 text-xs sm:text-sm" />
                            <p className="text-[10px] sm:text-xs text-green-300 font-medium">Member</p>
                          </div>
                          <p className="text-xl sm:text-2xl md:text-3xl font-black text-green-400">
                            {new Date(user.created_at).getFullYear()}
                          </p>
                        </div>
                      </div>

                      <div className="relative group/stat">
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl blur opacity-40 group-hover/stat:opacity-60 transition" />
                        <div className="relative p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30">
                          <div className="flex items-center gap-2 mb-1">
                            <FaFire className="text-purple-400 text-xs sm:text-sm" />
                            <p className="text-[10px] sm:text-xs text-purple-300 font-medium">Collections</p>
                          </div>
                          <p className="text-xl sm:text-2xl md:text-3xl font-black text-purple-400">
                            {Object.values(groupedFavs).filter((x) => x.length > 0).length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
            <main className="lg:col-span-8 space-y-4 sm:space-y-5 lg:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 bg-gradient-to-br from-slate-950/90 via-black/90 to-slate-950/90 border border-sky-500/20 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black flex items-center gap-2 sm:gap-3 text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300">
                    <FaHistory className="text-sky-400 text-xl sm:text-2xl md:text-3xl" />
                    <span>Watch History</span>
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-sky-400 animate-pulse" />
                    <span>Most Recent</span>
                  </div>
                </div>

                {history.length === 0 ? (
                  <div className="py-16 sm:py-20 md:py-28 lg:py-32 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center">
                      <FaHistory className="text-2xl sm:text-3xl md:text-4xl text-sky-400/50" />
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-slate-400 font-medium">No viewing history yet</p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-2">This user hasn't watched any trailers</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    {history.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="group relative rounded-xl sm:rounded-2xl overflow-hidden border border-sky-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 shadow-xl hover:shadow-2xl hover:border-sky-500/40 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity z-10" />

                        <div className="relative w-full aspect-[3/4]">
                          <img
                            src={item.anime?.cover_image || item.trailer_thumbnail || '/default.png'}
                            alt={item.anime?.title_romaji || 'Trailer'}
                            onError={handleImageError}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-20 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/70 border border-sky-500/30 backdrop-blur-sm">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-sky-400 animate-pulse" />
                          <span className="text-[10px] sm:text-xs font-bold text-sky-300">{item.watch_count}x</span>
                        </div>

                        <div className="absolute bottom-0 inset-x-0 p-2 sm:p-3 md:p-4 z-20">
                          <h3 className="text-xs sm:text-sm font-bold text-white mb-1 truncate group-hover:text-sky-300 transition-colors">
                            {item.anime?.title_romaji ?? 'Unknown'}
                          </h3>
                          <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-400">
                            {new Date(item.watched_at).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </main>

            <aside className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 bg-gradient-to-br from-slate-950/90 via-black/90 to-slate-950/90 border border-sky-500/20 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300 flex items-center gap-2">
                    <FaStar className="text-sky-400 text-lg sm:text-xl md:text-2xl" />
                    <span>Favorites</span>
                  </h3>
                  <div className="px-2 sm:px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-400 text-[10px] sm:text-xs font-bold">
                    {favorites.length}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {[
                    { key: 'anime', icon: <FaTv />, label: 'Anime', color: 'from-sky-500 to-blue-500' },
                    { key: 'manga', icon: <FaBook />, label: 'Manga', color: 'from-sky-600 to-blue-600' },
                    { key: 'manhwa', icon: <FaDragon />, label: 'Manhwa', color: 'from-blue-500 to-sky-500' },
                    { key: 'light_novel', icon: <FaBookOpen />, label: 'Light Novels', color: 'from-blue-600 to-sky-600' },
                  ].map(({ key, icon, label, color }) => {
                    const list = favorites.filter((f: any) => f.media_type === key)
                    return (
                      <motion.div
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        className="relative group rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-sky-500/20 hover:border-sky-500/40 transition-all duration-300"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 rounded-xl sm:rounded-2xl transition-opacity duration-300`} />

                        <div className="relative flex items-center justify-between mb-3 sm:mb-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className={`p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                              <span className="text-white text-sm sm:text-base md:text-lg">{icon}</span>
                            </div>
                            <span className="font-bold text-sm sm:text-base md:text-lg text-white">{label}</span>
                          </div>
                          <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] sm:text-xs font-bold text-white">
                            {list.length}
                          </div>
                        </div>

                        <div className="relative flex flex-wrap gap-1.5 sm:gap-2">
                          {list.length > 0 ? (
                            list.slice(0, 6).map((fav: any) => (
                              <span
                                key={fav.id}
                                title={String(fav.media_id)}
                                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r ${color} text-white text-[10px] sm:text-xs font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 truncate max-w-[100px] sm:max-w-[120px]`}
                              >
                                {fav?.media_title ?? fav?.title ?? `#${fav?.media_id}`}
                              </span>
                            ))
                          ) : (
                            <div className="w-full py-3 sm:py-4 text-center">
                              <p className="text-[10px] sm:text-xs text-slate-500 italic">No favorites yet</p>
                            </div>
                          )}
                          {list.length > 6 && (
                            <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white text-[10px] sm:text-xs font-bold">
                              +{list.length - 6}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
