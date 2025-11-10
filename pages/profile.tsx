'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Session } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
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

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    const formData = new FormData(e.currentTarget)
    const newUsername = (formData.get('username') as string) || ''
    const newBio = (formData.get('bio') as string) || ''
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
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const fallback = randomAvatars[Math.floor(Math.random() * randomAvatars.length)]
    e.currentTarget.src = fallback
  }

  if (!session || !user) return null

  return (
    <div className="min-h-screen bg-black text-slate-100 antialiased">
      <div className="relative overflow-hidden">
        <div className="absolute -top-40 -left-32 w-96 h-96 rounded-full blur-3xl bg-gradient-to-r from-sky-500/40 via-indigo-500/30 to-transparent opacity-70 transform rotate-12" />
        <div className="absolute -bottom-36 -right-40 w-96 h-96 rounded-full blur-3xl bg-gradient-to-l from-sky-400/30 via-purple-500/20 to-transparent opacity-60 transform -rotate-6" />
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3 flex flex-col items-center lg:items-start gap-6">
              <div className="w-full">
                <div className="relative rounded-2xl p-6 bg-gradient-to-br from-black/60 to-slate-900/60 border border-sky-700/10 shadow-[0_20px_60px_rgba(56,189,248,0.06)]">
                  <div className="relative flex flex-col items-center gap-4">
                    <div className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-sky-400/30 to-indigo-500/20">
                      <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-sky-500/30 shadow-[0_12px_40px_rgba(56,189,248,0.12)]">
                        <img
                          src={user.avatar_url || '/default.png'}
                          alt="avatar"
                          onError={handleImageError}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="text-center lg:text-left">
                      <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-200 to-white">
                        {user.username || 'Otaku Explorer ✨'}
                      </h1>
                      <p className="text-xs text-sky-200/80 mt-1 max-w-[220px] truncate">
                        {user.bio || 'Lover of anime, manga, manhwa & light novels.'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-2">{session.user.email}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex w-full gap-3">
                    <button
                      onClick={() => {
                        setSelectedAvatar(user.avatar_url || '/default.png')
                        setOpenEdit(true)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-black font-semibold shadow-lg hover:scale-[1.01] transition"
                    >
                      <FaUserEdit /> Edit
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-transparent border border-sky-700/20 text-sky-200 hover:bg-white/2 transition"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="rounded-2xl p-4 bg-gradient-to-br from-black/50 to-slate-900/50 border border-sky-700/8 shadow-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-sky-200 flex items-center gap-2">
                      <FaHistory /> Activity
                    </h3>
                    <span className="text-xs text-slate-400">Realtime</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-sky-500/10 to-transparent border border-sky-700/8 text-center">
                      <div className="text-xs text-slate-400">History</div>
                      <div className="text-lg font-bold text-sky-300">{history.length}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500/10 to-transparent border border-sky-700/8 text-center">
                      <div className="text-xs text-slate-400">Favorites</div>
                      <div className="text-lg font-bold text-sky-300">{favorites.length}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full hidden lg:block">
                <div className="rounded-2xl p-4 bg-gradient-to-br from-black/50 to-slate-900/50 border border-sky-700/8 shadow-lg">
                  <h4 className="text-sm font-semibold text-sky-200 flex items-center gap-2 mb-3">
                    Quick Links
                  </h4>
                  <div className="flex flex-col gap-2">
                    <button className="text-sm py-2 rounded-lg text-left px-3 bg-transparent border border-sky-700/8 hover:bg-sky-700/6 transition flex items-center gap-2">
                      <FaTv /> Anime
                    </button>
                    <button className="text-sm py-2 rounded-lg text-left px-3 bg-transparent border border-sky-700/8 hover:bg-sky-700/6 transition flex items-center gap-2">
                      <FaBook /> Manga
                    </button>
                    <button className="text-sm py-2 rounded-lg text-left px-3 bg-transparent border border-sky-700/8 hover:bg-sky-700/6 transition flex items-center gap-2">
                      <FaDragon /> Manhwa
                    </button>
                    <button className="text-sm py-2 rounded-lg text-left px-3 bg-transparent border border-sky-700/8 hover:bg-sky-700/6 transition flex items-center gap-2">
                      <FaBookOpen /> Light Novels
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-6">
              <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-900/70 to-black/80 border border-sky-700/10 shadow-[0_30px_80px_rgba(56,189,248,0.06)]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-sky-100">
                    <FaHistory /> History
                  </h2>
                  <div className="text-sm text-slate-400">Most recent</div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-40 rounded-xl bg-gradient-to-br from-black/40 to-slate-900/40 animate-pulse" />
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">No viewing history yet.</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.03 }}
                        className="relative rounded-xl overflow-hidden border border-sky-700/10 bg-gradient-to-br from-black/40 to-slate-900/40 shadow-lg"
                      >
                        <div className="relative w-full h-36">
                          <img
                            src={item.anime?.cover_image || item.trailer_thumbnail || '/default.png'}
                            alt={item.anime?.title_romaji || 'Trailer'}
                            onError={handleImageError}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute left-3 top-3 px-2 py-0.5 rounded-full bg-black/60 border border-sky-700/20 text-[11px] text-sky-200">
                          {item.watch_count}x
                        </div>
                        <div className="p-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">
                              {item.anime?.title_romaji ?? 'Unknown'}
                            </div>
                            <div className="text-[11px] text-slate-400">Watched at {new Date(item.watched_at).toLocaleString()}</div>
                          </div>
                          <button className="py-1 px-3 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 text-black text-xs font-bold">
                            ▶
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </main>

            <aside className="lg:col-span-3">
              <div className="rounded-3xl p-6 bg-gradient-to-br from-black/60 to-slate-900/60 border border-sky-700/12 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-sky-100 flex items-center gap-2">
                    <FaStar /> Favorites
                  </h3>
                  <div className="text-xs text-slate-400">Organized</div>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    <div className="h-8 bg-gradient-to-r from-black/40 to-slate-900/40 rounded-md animate-pulse" />
                    <div className="h-8 bg-gradient-to-r from-black/40 to-slate-900/40 rounded-md animate-pulse" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { key: 'anime', icon: <FaTv /> },
                      { key: 'manga', icon: <FaBook /> },
                      { key: 'manhwa', icon: <FaDragon /> },
                      { key: 'light_novel', icon: <FaBookOpen /> },
                    ].map(({ key, icon }) => {
                      const list = favorites.filter((f: any) => f.media_type === key)
                      return (
                        <div key={key} className="rounded-xl p-3 bg-gradient-to-br from-black/30 to-slate-900/30 border border-sky-700/8">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sky-100 font-semibold">
                              <span className="text-xl">{icon}</span>
                              <span className="capitalize">{key.replace('_', ' ')}</span>
                            </div>
                            <div className="text-xs text-slate-400 px-2 py-1 rounded-md bg-black/30 border border-sky-700/8">
                              {list.length}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {list.length > 0 ? (
                              list.map((fav: any) => (
                                <span
                                  key={fav.id}
                                  title={String(fav.media_id)}
                                  className="px-3 py-1 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-black text-xs font-medium shadow-sm"
                                >
                                  {fav?.media_title ?? fav?.title ?? fav?.media_id}
                                </span>
                              ))
                            ) : (
                              <div className="text-xs text-slate-400 italic">No favorites yet</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="mt-6 hidden lg:block rounded-2xl p-4 bg-gradient-to-br from-black/50 to-slate-900/50 border border-sky-700/8 shadow-lg">
                <h4 className="text-sm font-semibold text-sky-200 mb-3">Customization</h4>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 shadow-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-slate-400">Theme</div>
                    <div className="text-sm font-medium text-sky-100">Futuristic Neon</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openEdit && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full max-w-lg mx-4 rounded-2xl p-6 bg-gradient-to-br from-slate-900/90 to-black/90 border border-sky-700/12 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-sky-200">Edit Profile</h3>
                <button onClick={() => setOpenEdit(false)} className="text-slate-400">Close</button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Username</label>
                  <input
                    name="username"
                    defaultValue={user.username || ''}
                    className="w-full rounded-lg px-4 py-2 bg-black/40 border border-sky-700/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Bio</label>
                  <textarea
                    name="bio"
                    defaultValue={user.bio || ''}
                    rows={3}
                    className="w-full rounded-lg px-4 py-2 bg-black/40 border border-sky-700/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-2">Avatar</label>
                  <div className="flex flex-col gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="w-full rounded-lg bg-black/30 border border-sky-700/12 text-sm p-2"
                    />
                    <div className="flex gap-3">
                      {randomAvatars.map((src) => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setSelectedAvatar(src)}
                          className={`w-14 h-14 rounded-full overflow-hidden border-2 ${selectedAvatar === src ? 'border-sky-400' : 'border-transparent'}`}
                        >
                          <img src={src} alt="avatar" onError={handleImageError} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setOpenEdit(false)} className="flex-1 py-2 rounded-xl bg-transparent border border-sky-700/12 text-slate-300">Cancel</button>
                  <button type="submit" className="flex-1 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-black font-semibold">Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
