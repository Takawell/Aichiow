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
    title_romaji: string
    cover_image: string
  }
}

export default function ProfileDashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<UserRow | null>(null)
  const [history, setHistory] = useState<TrailerHistoryRow[]>([])
  const [favorites, setFavorites] = useState<FavoriteRow[]>([])
  const [openEdit, setOpenEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.replace('/auth/login')
        return
      }
      setSession(data.session)

      const userId = data.session.user.id

      // Load user profile
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileData) setUser(profileData)

      // ✅ Load trailer watch history (join anime)
      const { data: historyData } = await supabase
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

      if (historyData) setHistory(historyData as TrailerHistoryRow[])

      // Load favorites
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)

      if (favoritesData) setFavorites(favoritesData)

      setLoading(false)
    }

    loadSession()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/login')
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const newUsername = formData.get('username') as string
    const newBio = formData.get('bio') as string

    if (user) {
      setUser({ ...user, username: newUsername, bio: newBio })
    }
    setOpenEdit(false)
  }

  if (!session || !user) return null

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(59,130,246,0.2),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(236,72,153,0.15),transparent)] from-[#0f172a] via-[#121026] to-[#0f172a] p-4 md:p-8 text-white">
      
      {/* ... header dan modal edit (biarkan sama persis punyamu) ... */}

      {/* Trailer Watch History Section */}
      <section className="mb-12">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-2xl font-bold mb-6"
        >
          <FaHistory /> Trailer Watch History
        </motion.h3>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl h-36 md:h-52 bg-white/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {history.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-2xl shadow-xl bg-white/10 backdrop-blur-md border border-white/10"
              >
                <Image
                  src={item.anime.cover_image}
                  alt={item.anime.title_romaji}
                  width={400}
                  height={500}
                  className="object-cover w-full h-36 md:h-52"
                />
                <span className="absolute left-2 top-2 z-10 px-2 py-0.5 rounded-full text-[10px] bg-black/70">
                  {item.watch_count}x Watched
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                  <button className="w-full py-1.5 rounded-lg bg-white/90 text-black text-xs font-bold shadow">
                    ▶ Watch Again
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="mt-6 text-center text-sm text-gray-400">
            Belum ada riwayat trailer ditonton.
          </div>
        )}
      </section>

      // Load favorites
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId) as { data: FavoriteRow[] | null; error: any }

      if (favoritesData) setFavorites(favoritesData)

      setLoading(false)
    }

    loadSession()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/login')
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const newUsername = formData.get('username') as string
    const newBio = formData.get('bio') as string

    if (user) {
      setUser({ ...user, username: newUsername, bio: newBio })
    }
    setOpenEdit(false)
  }

  if (!session || !user) return null

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(59,130,246,0.2),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(236,72,153,0.15),transparent)] from-[#0f172a] via-[#121026] to-[#0f172a] p-4 md:p-8 text-white">
      {/* Profile Header */}
      <motion.div
        className="relative overflow-hidden rounded-3xl p-6 md:p-10 backdrop-blur-2xl border border-white/15 shadow-[0_0_35px_rgba(99,102,241,0.45)] mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Avatar Background */}
        <div className="absolute inset-0">
          <Image src="/background.png" alt="bg" fill className="object-cover opacity-25 blur-sm" />
        </div>

        {/* Gradient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/25 via-purple-500/25 to-pink-500/25 mix-blend-overlay" />

        <div className="relative flex flex-col md:flex-row items-center md:justify-between gap-6">
          <motion.div
            whileHover={{ rotate: 6, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="relative"
          >
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500/40 via-purple-500/40 to-fuchsia-500/40 blur-lg" />
            <Image
              src={user.avatar_url || '/default.png'}
              alt="Avatar"
              width={120}
              height={120}
              className="relative rounded-full border-4 border-blue-500/80 shadow-[0_10px_30px_rgba(59,130,246,0.6)]"
            />
          </motion.div>

          <div className="text-center md:text-left max-w-xl">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-wide drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              {user.username || 'Otaku Explorer ✨'}
            </h2>
            <p className="text-gray-300 text-sm md:text-base italic">
              {user.bio || 'Lover of anime, manga, manhwa & light novels.'}
            </p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">{session.user.email}</p>

            {/* Stats chips */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10">History: <b>{history.length}</b></span>
              <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10">Favorites: <b>{favorites.length}</b></span>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={() => setOpenEdit(true)}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 font-semibold shadow-lg"
            >
              <FaUserEdit /> Edit
            </motion.button>
            <motion.button
              onClick={handleLogout}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-semibold shadow-lg"
            >
              <FaSignOutAlt /> Logout
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {openEdit && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#101827]/95 text-white p-6 rounded-2xl max-w-sm w-full mx-4 shadow-[0_0_25px_rgba(59,130,246,0.7)] border border-white/10"
            >
              <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold">Username</label>
                  <input
                    name="username"
                    defaultValue={user.username || ''}
                    className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold">Bio</label>
                  <textarea
                    name="bio"
                    defaultValue={user.bio || ''}
                    rows={3}
                    className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 focus:outline-none"
                  />
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setOpenEdit(false)}
                    className="flex-1 py-2 rounded-xl bg-gray-600/90 hover:bg-gray-500 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 font-semibold"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Watch History Section */}
      <section className="mb-12">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-2xl font-bold mb-6"
        >
          <FaHistory /> Watch History
        </motion.h3>

        {/* Skeleton shimmer while loading */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl h-36 md:h-52 bg-white/10 border border-white/10">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {history.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-2xl shadow-xl bg-white/10 backdrop-blur-md border border-white/10"
              >
                <Image
                  src={`/demo/${item.media_id}.jpg`}
                  alt={item.media_type}
                  width={400}
                  height={500}
                  className="object-cover w-full h-36 md:h-52"
                />
                {/* Top-left badge */}
                <span className="absolute left-2 top-2 z-10 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide bg-black/60 border border-white/10">
                  {item.media_type}
                </span>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                  <button className="w-full py-1.5 rounded-lg bg-white/90 text-black text-xs font-bold shadow">
                    ▶ Continue
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && history.length === 0 && (
          <div className="mt-6 text-center text-sm text-gray-400">Belum ada riwayat tontonan.</div>
        )}
      </section>

      {/* Favorites Section */}
      <section>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-2xl font-bold mb-6"
        >
          <FaStar /> Favorites
        </motion.h3>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl p-6 border border-white/10 bg-white/5">
                <div className="h-5 w-40 rounded bg-white/10 mb-4 animate-pulse" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 8 }).map((__, j) => (
                    <span key={j} className="px-6 py-2 rounded-full bg-white/10 animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { key: 'anime', icon: <FaTv /> },
              { key: 'manga', icon: <FaBook /> },
              { key: 'manhwa', icon: <FaDragon /> },
              { key: 'light_novel', icon: <FaBookOpen /> },
            ].map(({ key, icon }) => {
              const list = favorites.filter((f) => f.media_type === key)
              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden rounded-2xl p-6 border border-white/10 shadow-lg bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-2xl opacity-40" />
                  <div className="relative flex items-center justify-between mb-4">
                    <h4 className="flex items-center gap-2 text-lg font-semibold capitalize">
                      <span className="text-xl">{icon}</span> {key.replace('_', ' ')}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 border border-white/10">{list.length}</span>
                  </div>

                  <div className="relative flex flex-wrap gap-2 z-10">
                    {list.map((fav) => (
                      <span
                        key={fav.id}
                        title={String(fav.media_id)}
                        className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-xs md:text-sm font-medium shadow-md hover:scale-105 transition border border-white/10"
                      >
                        {fav.media_id}
                      </span>
                    ))}
                    {list.length === 0 && (
                      <div className="w-full text-xs text-gray-400 italic">No favorites yet</div>
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
