'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Session } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { UserRow, FavoriteRow } from '@/types/supabase'
import {
  FaUserEdit,
  FaSignOutAlt,
  FaHistory,
  FaStar,
  FaTv,
  FaBook,
  FaBookOpen,
  FaDragon,
  FaTimes,
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

export default function ProfileDashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<UserRow | null>(null)
  const [history, setHistory] = useState<TrailerHistoryRow[]>([])
  const [favorites, setFavorites] = useState<FavoriteRow[]>([])
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const randomAvatars = ['/default.png', '/v2.png', '/v3.png', '/v4.png']

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionResp = await supabase.auth.getSession()
        const sess = sessionResp?.data?.session ?? null
        if (!sess) {
          router.replace('/auth/login')
          return
        }
        setSession(sess)

        const userId = sess.user.id
        const userMetadata = sess.user.user_metadata || {}

        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        let baseUser: UserRow = {
          id: userId,
          email: sess.user.email || '',
          username: userMetadata.full_name || userMetadata.name || 'Otaku Explorer ✨',
          bio: 'Lover of anime, manga, manhwa & light novels.',
          avatar_url: userMetadata.avatar_url || userMetadata.picture || '/default.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        if (profileData) {
          baseUser = {
            ...baseUser,
            username: profileData.username || baseUser.username,
            bio: profileData.bio || baseUser.bio,
            avatar_url: profileData.avatar_url || baseUser.avatar_url,
            email: profileData.email || baseUser.email,
          }
        }

        const localUsername =
          typeof window !== 'undefined' ? localStorage.getItem('username') : null
        const localBio =
          typeof window !== 'undefined' ? localStorage.getItem('bio') : null
        const localAvatar =
          typeof window !== 'undefined' ? localStorage.getItem('avatar') : null

        if (localUsername || localBio || localAvatar) {
          baseUser = {
            ...baseUser,
            username: localUsername || baseUser.username,
            bio: localBio || baseUser.bio,
            avatar_url: localAvatar || baseUser.avatar_url,
          }
        }

        setUser(baseUser)
        setSelectedAvatar(baseUser.avatar_url || '/default.png')

        const { data: rawHistoryData } = await supabase
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

        if (rawHistoryData && Array.isArray(rawHistoryData)) {
          const normalized: TrailerHistoryRow[] = rawHistoryData.map((it: any) => {
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
        console.error('loadSession error', err)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [router])

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      localStorage.setItem('avatar', base64)
      setSelectedAvatar(base64)
      setUser((prev) => (prev ? { ...prev, avatar_url: base64 } : prev))
    }
    reader.readAsDataURL(file)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/login')
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const fallback = randomAvatars[Math.floor(Math.random() * randomAvatars.length)]
    e.currentTarget.src = fallback
  }

  if (!session || !user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-slate-50 antialiased">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            
            <aside className="lg:col-span-4 xl:col-span-3 space-y-4 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-black/90 to-slate-900/90 border border-white/10 backdrop-blur-xl">
                  <div className="flex flex-col items-center gap-5">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 rounded-full blur-xl opacity-60 animate-pulse" />
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-tr from-sky-400 via-indigo-400 to-purple-400">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-black/50 shadow-2xl">
                          <img
                            src={user.avatar_url || '/default.png'}
                            alt="avatar"
                            onError={handleImageError}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center w-full">
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300 mb-2">
                        {user.username || 'Otaku Explorer ✨'}
                      </h1>
                      <p className="text-xs sm:text-sm text-sky-200/70 leading-relaxed max-w-xs mx-auto">
                        {user.bio || 'Lover of anime, manga, manhwa & light novels.'}
                      </p>
                      <p className="text-xs text-slate-500 mt-3 truncate px-2">{session.user.email}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setSelectedAvatar(user.avatar_url || '/default.png')
                        setOpenEdit(true)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-white font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      <FaUserEdit className="text-lg" /> 
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 active:scale-95 transition-all duration-200 backdrop-blur"
                    >
                      <FaSignOutAlt /> 
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-slate-900/80 via-black/80 to-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-base sm:text-lg font-bold text-sky-200 flex items-center gap-2">
                    <FaHistory className="text-sky-400" /> 
                    <span>Activity Stats</span>
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold animate-pulse">
                    Live
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition" />
                    <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-500/20 to-sky-600/10 border border-sky-500/30 text-center">
                      <div className="text-xs sm:text-sm text-sky-300 font-medium mb-1">Watch History</div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-black text-sky-400">{history.length}</div>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition" />
                    <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/10 border border-indigo-500/30 text-center">
                      <div className="text-xs sm:text-sm text-indigo-300 font-medium mb-1">Favorites</div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-black text-indigo-400">{favorites.length}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:block rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-slate-900/80 via-black/80 to-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl"
              >
                <h4 className="text-base sm:text-lg font-bold text-sky-200 flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  Quick Navigation
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { icon: <FaTv />, label: 'Anime', color: 'from-red-500 to-pink-500' },
                    { icon: <FaBook />, label: 'Manga', color: 'from-orange-500 to-yellow-500' },
                    { icon: <FaDragon />, label: 'Manhwa', color: 'from-green-500 to-emerald-500' },
                    { icon: <FaBookOpen />, label: 'Light Novels', color: 'from-blue-500 to-cyan-500' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      className="group relative overflow-hidden text-sm py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      <div className="relative flex items-center gap-3">
                        <span className="text-xl text-slate-400 group-hover:text-white transition-colors">{item.icon}</span>
                        <span className="font-semibold text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </aside>

            <main className="lg:col-span-8 xl:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-3xl p-5 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900/80 via-black/80 to-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300">
                    <FaHistory className="text-sky-400 text-2xl sm:text-3xl" /> 
                    <span>Watch History</span>
                  </h2>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    <span>Most Recent First</span>
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 animate-pulse" />
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  <div className="py-20 sm:py-32 text-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-sky-500/20 to-indigo-500/20 flex items-center justify-center">
                      <FaHistory className="text-3xl sm:text-4xl text-sky-400/50" />
                    </div>
                    <p className="text-base sm:text-lg text-slate-400 font-medium">No viewing history yet</p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-2">Start watching to build your collection</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {history.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="group relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 shadow-xl hover:shadow-2xl transition-all duration-300"
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

                        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-sky-500/30 backdrop-blur-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                          <span className="text-xs font-bold text-sky-300">{item.watch_count}x</span>
                        </div>

                        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 z-20">
                          <h3 className="text-xs sm:text-sm font-bold text-white mb-1 truncate group-hover:text-sky-300 transition-colors">
                            {item.anime?.title_romaji ?? 'Unknown'}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-slate-400 mb-3">
                            {new Date(item.watched_at).toLocaleDateString()}
                          </p>
                          <button className="w-full py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-xs font-bold shadow-lg hover:shadow-xl hover:from-sky-400 hover:to-indigo-400 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
                            <span>▶</span>
                            <span className="hidden sm:inline">Play</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </main>

            <aside className="lg:col-span-12 xl:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl p-5 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900/80 via-black/80 to-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 flex items-center gap-2">
                    <FaStar className="text-yellow-400 text-xl sm:text-2xl" /> 
                    <span>My Favorites</span>
                  </h3>
                  <div className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
                    {favorites.length}
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-24 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { key: 'anime', icon: <FaTv />, label: 'Anime', color: 'from-red-500 to-pink-500' },
                      { key: 'manga', icon: <FaBook />, label: 'Manga', color: 'from-orange-500 to-yellow-500' },
                      { key: 'manhwa', icon: <FaDragon />, label: 'Manhwa', color: 'from-green-500 to-emerald-500' },
                      { key: 'light_novel', icon: <FaBookOpen />, label: 'Light Novels', color: 'from-blue-500 to-cyan-500' },
                    ].map(({ key, icon, label, color }) => {
                      const list = favorites.filter((f: any) => f.media_type === key)
                      return (
                        <motion.div
                          key={key}
                          whileHover={{ scale: 1.02 }}
                          className="relative group rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 hover:border-white/20 transition-all duration-300"
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                          
                          <div className="relative flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                                <span className="text-white text-lg sm:text-xl">{icon}</span>
                              </div>
                              <span className="font-bold text-base sm:text-lg text-white">{label}</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white">
                              {list.length}
                            </div>
                          </div>

                          <div className="relative flex flex-wrap gap-2">
                            {list.length > 0 ? (
                              list.slice(0, 3).map((fav: any) => (
                                <span
                                  key={fav.id}
                                  title={String(fav.media_id)}
                                  className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${color} text-white text-xs font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 truncate max-w-[150px]`}
                                >
                                  {fav?.media_title ?? fav?.title ?? `#${fav?.media_id}`}
                                </span>
                              ))
                            ) : (
                              <div className="w-full py-4 text-center">
                                <p className="text-xs text-slate-500 italic">No favorites yet</p>
                                <p className="text-[10px] text-slate-600 mt-1">Start adding your favorites</p>
                              </div>
                            )}
                            {list.length > 3 && (
                              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold">
                                +{list.length - 3} more
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            </aside>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openEdit && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenEdit(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-50" />
              <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-black to-slate-900 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300">
                    Edit Profile
                  </h3>
                  <button
                    onClick={() => setOpenEdit(false)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs sm:text-sm text-slate-400 font-semibold block mb-2">Username</label>
                    <input
                      id="edit-username"
                      defaultValue={user.username || ''}
                      className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all"
                      placeholder="Enter your username"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm text-slate-400 font-semibold block mb-2">Bio</label>
                    <textarea
                      id="edit-bio"
                      defaultValue={user.bio || ''}
                      rows={4}
                      className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm text-slate-400 font-semibold block mb-3">Avatar</label>
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="w-full rounded-xl bg-white/5 border border-white/10 text-sm p-3 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-sky-500 file:to-indigo-500 file:text-white hover:file:from-sky-400 hover:file:to-indigo-400 file:cursor-pointer transition-all"
                        />
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 mb-3">Or choose from presets:</p>
                        <div className="flex flex-wrap gap-3">
                          {randomAvatars.map((src) => (
                            <button
                              key={src}
                              type="button"
                              onClick={() => setSelectedAvatar(src)}
                              className={`relative group w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-3 transition-all duration-300 ${
                                selectedAvatar === src
                                  ? 'border-sky-400 shadow-lg shadow-sky-500/50 scale-110'
                                  : 'border-white/20 hover:border-sky-400/50 hover:scale-105'
                              }`}
                            >
                              <div className={`absolute inset-0 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity ${
                                selectedAvatar === src ? 'opacity-100' : ''
                              }`} />
                              <img
                                src={src}
                                alt="avatar option"
                                onError={handleImageError}
                                className="w-full h-full object-cover"
                              />
                              {selectedAvatar === src && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                  <div className="w-6 h-6 rounded-full bg-sky-400 flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                  </div>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {selectedAvatar && !randomAvatars.includes(selectedAvatar) && (
                        <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30">
                          <p className="text-xs text-sky-300 font-medium mb-2">Current Selection:</p>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-sky-400/50">
                              <img
                                src={selectedAvatar}
                                alt="selected"
                                onError={handleImageError}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs text-slate-400">Custom upload</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setOpenEdit(false)}
                      className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold hover:bg-white/10 hover:text-white hover:border-white/20 active:scale-95 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newUsername = (document.getElementById('edit-username') as HTMLInputElement)?.value || ''
                        const newBio = (document.getElementById('edit-bio') as HTMLTextAreaElement)?.value || ''
                        const newAvatar = selectedAvatar || user.avatar_url || '/default.png'

                        if (typeof window !== 'undefined') {
                          localStorage.setItem('username', newUsername)
                          localStorage.setItem('bio', newBio)
                          if (newAvatar) localStorage.setItem('avatar', newAvatar)
                          else localStorage.removeItem('avatar')
                        }

                        setUser({
                          ...user,
                          username: newUsername || user.username,
                          bio: newBio || user.bio,
                          avatar_url: newAvatar || user.avatar_url,
                        })

                        setOpenEdit(false)
                      }}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-white font-bold shadow-xl hover:shadow-2xl hover:from-sky-400 hover:via-indigo-400 hover:to-purple-400 active:scale-95 transition-all duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-40 hidden xl:block">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition" />
          <div className="relative rounded-2xl p-4 bg-gradient-to-br from-slate-900/90 to-black/90 border border-white/20 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 shadow-lg" />
              <div>
                <div className="text-xs text-slate-400 font-medium">Active Theme</div>
                <div className="text-sm font-bold text-white">Futuristic Neon</div>
              </div>
            </div>
            <button className="w-full py-2 px-4 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all">
              Customize
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
