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
  FaUpload,
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

        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        let baseUser: UserRow =
          profileData ?? {
            id: userId,
            username: 'Otaku Explorer ✨',
            bio: 'Lover of anime, manga, manhwa & light novels.',
            avatar_url: '/default.png',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
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

  if (!session || !user) return null

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/default.png'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black p-4 md:p-8 text-white">
      <motion.div
        className="relative overflow-hidden rounded-3xl p-6 md:p-10 backdrop-blur-xl border border-white/10 shadow-[0_30px_60px_rgba(56,189,248,0.06)] mb-10 bg-gradient-to-br from-black/60 via-sky-900/40 to-black/70"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/background.png"
            alt="bg"
            fill
            className="object-cover mix-blend-overlay blur-md"
            onError={handleImageError}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 via-transparent to-sky-300/10 mix-blend-screen" />

        <div className="relative flex flex-col md:flex-row items-center md:justify-between gap-6">
          <motion.div
            whileHover={{ rotate: 6, scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="relative"
          >
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-sky-400/30 via-sky-300/20 to-transparent blur-xl" />
            <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-sky-400/50 shadow-[0_15px_40px_rgba(56,189,248,0.12)]">
              <Image
                src={user.avatar_url || '/default.png'}
                alt="Avatar"
                fill
                sizes="(max-width: 768px) 120px, 144px"
                onError={handleImageError}
                className="object-cover"
              />
            </div>
          </motion.div>

          <div className="text-center md:text-left max-w-xl">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-200 to-white drop-shadow-lg">
              {user.username || 'Otaku Explorer ✨'}
            </h2>
            <p className="text-sky-200/80 text-sm md:text-base italic mt-1">
              {user.bio || 'Lover of anime, manga, manhwa & light novels.'}
            </p>
            <p className="text-xs md:text-sm text-slate-400 mt-2">
              {session.user.email}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 rounded-full text-xs bg-black/40 border border-sky-600/20 backdrop-blur-sm">
                History: <b className="text-sky-300">{history.length}</b>
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-black/40 border border-sky-600/20 backdrop-blur-sm">
                Favorites: <b className="text-sky-300">{favorites.length}</b>
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={() => {
                setSelectedAvatar(user.avatar_url || '/default.png')
                setOpenEdit(true)
              }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-300 hover:opacity-95 font-semibold shadow-[0_10px_30px_rgba(56,189,248,0.12)]"
            >
              <FaUserEdit /> Edit
            </motion.button>
            <motion.button
              onClick={handleLogout}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black/60 border border-sky-700/20 hover:bg-black/50 font-semibold shadow-md"
            >
              <FaSignOutAlt /> Logout
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {openEdit && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-gradient-to-br from-slate-900/90 to-black/90 text-white p-6 rounded-2xl max-w-md w-full mx-4 border border-sky-700/10 shadow-2xl"
            >
              <h3 className="text-lg font-bold mb-4 text-sky-200">Edit Profile</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold text-sky-100">Username</label>
                  <input
                    name="username"
                    defaultValue={user.username || ''}
                    className="w-full rounded-lg px-4 py-2 bg-black/40 border border-sky-700/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold text-sky-100">Bio</label>
                  <textarea
                    name="bio"
                    defaultValue={user.bio || ''}
                    rows={3}
                    className="w-full rounded-lg px-4 py-2 bg-black/40 border border-sky-700/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-sky-100">Avatar</label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="w-full rounded-lg bg-black/30 border border-sky-700/20 text-sm p-2 cursor-pointer"
                    />
                    <div className="flex justify-between gap-2 mt-2">
                      {['/default.png', '/v2.png', '/v3.png', '/v4.png'].map(
                        (src) => (
                          <button
                            type="button"
                            key={src}
                            onClick={() => setSelectedAvatar(src)}
                            className={`relative rounded-full overflow-hidden border-2 ${
                              selectedAvatar === src
                                ? 'border-sky-400'
                                : 'border-transparent'
                            }`}
                          >
                            <Image
                              src={src}
                              alt="avatar"
                              width={60}
                              height={60}
                              onError={handleImageError}
                              className="rounded-full object-cover"
                            />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setOpenEdit(false)}
                    className="flex-1 py-2 rounded-xl bg-black/50 hover:bg-black/40 font-semibold border border-sky-700/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-300 hover:opacity-95 font-semibold"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="mb-12">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 text-2xl font-bold mb-6 text-sky-100"
        >
          <FaHistory /> Watch History
        </motion.h3>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl h-36 md:h-52 bg-black/40 border border-sky-700/10"
              >
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-sky-700/10 to-transparent" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {history.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                className="group relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-black/50 to-slate-900/70 backdrop-blur-md border border-sky-800/10"
              >
                <div className="relative w-full h-36 md:h-52">
                  <Image
                    src={item.anime?.cover_image || item.trailer_thumbnail || '/default.png'}
                    alt={item.anime?.title_romaji || 'Trailer'}
                    fill
                    sizes="(max-width: 768px) 180px, 320px"
                    onError={handleImageError}
                    className="object-cover"
                  />
                </div>
                <span className="absolute left-2 top-2 z-10 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide bg-black/60 border border-sky-700/20">
                  {item.watch_count}x
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition">
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                  <button className="w-full py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-sky-300 text-black text-xs font-bold shadow">
                    ▶ Continue
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="mt-6 text-center text-sm text-slate-400">No viewing history yet.</div>
        )}
      </section>

      <section>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 text-2xl font-bold mb-6 text-sky-100"
        >
          <FaStar /> Favorites
        </motion.h3>

        {loading ? (
          <div className="text-sm text-slate-400">Loading favorites...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { key: 'anime', icon: <FaTv /> },
              { key: 'manga', icon: <FaBook /> },
              { key: 'manhwa', icon: <FaDragon /> },
              { key: 'light_novel', icon: <FaBookOpen /> },
            ].map(({ key, icon }) => {
              const list = favorites.filter((f: any) => f.media_type === key)
              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden rounded-2xl p-6 border border-sky-800/10 shadow-lg bg-gradient-to-br from-slate-900/70 to-black/80 backdrop-blur-xl"
                >
                  <div className="relative flex items-center justify-between mb-4">
                    <h4 className="flex items-center gap-2 text-lg font-semibold capitalize text-sky-100">
                      <span className="text-xl">{icon}</span> {key.replace('_', ' ')}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-black/40 border border-sky-700/20 text-sky-200">
                      {list.length}
                    </span>
                  </div>

                  <div className="relative flex flex-wrap gap-2 z-10">
                    {list.length > 0 ? (
                      list.map((fav: any) => (
                        <span
                          key={fav.id}
                          title={String(fav.media_id)}
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-sky-500 to-sky-300 text-xs md:text-sm font-medium shadow-md hover:scale-105 transition border border-sky-700/10 text-black"
                        >
                          {fav?.media_title ?? fav?.title ?? fav?.media_id}
                        </span>
                      ))
                    ) : (
                      <div className="w-full text-xs text-slate-400 italic">No favorites yet</div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
