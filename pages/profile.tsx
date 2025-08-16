'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { Session } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const USE_JSON_COLUMNS = true

type HistoryItem = {
  id?: string | number
  title: string
  thumbnail: string
  created_at?: string
}

type Favorites = {
  anime: string[]
  manga: string[]
  manhwa: string[]
  lightNovel: string[]
}

type ProfileRow = {
  username: string | null
  bio: string | null
  avatar: string | null
  history?: HistoryItem[] | null
  favorites?: Favorites | null
}

export default function ProfileDashboard() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [username, setUsername] = useState('Otaku Explorer ✨')
  const [bio, setBio] = useState('Lover of anime, manga, manhwa & light novels.')
  const [avatar, setAvatar] = useState<string | null>(null)

  const [history, setHistory] = useState<HistoryItem[]>([])
  const [favorites, setFavorites] = useState<Favorites>({
    anime: [],
    manga: [],
    manhwa: [],
    lightNovel: []
  })

  const [openEdit, setOpenEdit] = useState(false)

  // Helper untuk grup favorites dari tabel terpisah
  const groupFavorites = (rows: any[]): Favorites => {
    const grouped: Favorites = { anime: [], manga: [], manhwa: [], lightNovel: [] }
    for (const r of rows) {
      const cat = (r.category || r.type || r.media_type || '').toString()
      const title = (r.title || r.name || r.item_title || '').toString()
      if (!title) continue
      if (cat === 'anime' || cat === 'manga' || cat === 'manhwa' || cat === 'lightNovel') {
        grouped[cat as keyof Favorites].push(title)
      }
    }
    return grouped
  }

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!data.session) {
          router.replace('/auth/login')
          return
        }
        setSession(data.session)
        const userId = data.session.user.id

        // --- Ambil profil ---
        const selectColumns = USE_JSON_COLUMNS
          ? 'username, bio, avatar, history, favorites'
          : 'username, bio, avatar'

        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select(selectColumns)
          .eq('id', userId)
          .single()

        if (profileErr && profileErr.code !== 'PGRST116') {
          // error selain "no rows"
          console.error('Load profile error:', profileErr)
        }

        // Jika belum ada row profile, upsert minimal
        if (!profile) {
          const fallbackName =
            (data.session.user.user_metadata?.user_name as string) ||
            (data.session.user.user_metadata?.full_name as string) ||
            (data.session.user.email?.split('@')[0] as string) ||
            'User'
          const { error: upsertErr } = await supabase.from('profiles').upsert({
            id: userId,
            username: fallbackName,
            bio: '',
            avatar: null
          })
          if (upsertErr) console.error('Create profile error:', upsertErr)
          setUsername(fallbackName)
          setBio('')
          setAvatar(null)
        } else {
          const p = profile as ProfileRow
          setUsername(p.username || 'User')
          setBio(p.bio || '')
          setAvatar(p.avatar || null)

          if (USE_JSON_COLUMNS) {
            setHistory(Array.isArray(p.history) ? p.history : [])
            setFavorites(
              p.favorites || { anime: [], manga: [], manhwa: [], lightNovel: [] }
            )
          }
        }

        if (!USE_JSON_COLUMNS) {
          // --- Ambil dari tabel history ---
          const { data: histRows, error: histErr } = await supabase
            .from('watch_history')
            .select('id, title, thumbnail, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50)
          if (histErr) console.warn('Load history warning:', histErr)
          setHistory(histRows || [])

          // --- Ambil dari tabel favorites ---
          const { data: favRows, error: favErr } = await supabase
            .from('favorites')
            .select('category, title')
            .eq('user_id', userId)
            .limit(200)
          if (favErr) console.warn('Load favorites warning:', favErr)
          setFavorites(favRows ? groupFavorites(favRows) : { anime: [], manga: [], manhwa: [], lightNovel: [] })
        }
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/login')
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!session) return
    const form = e.currentTarget
    const formData = new FormData(form)
    const newUsername = (formData.get('username') as string)?.trim()
    const newBio = (formData.get('bio') as string)?.trim()

    try {
      setSaving(true)
      const payload: any = { id: session.user.id, username: newUsername, bio: newBio }
      if (USE_JSON_COLUMNS) {
        payload.history = history
        payload.favorites = favorites
      }
      const { error } = await supabase.from('profiles').upsert(payload)
      if (error) {
        console.error('Save profile error:', error)
        return
      }
      setUsername(newUsername)
      setBio(newBio)
      setOpenEdit(false)
    } finally {
      setSaving(false)
    }
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4 md:p-8 text-white">
      {/* Profile Header */}
      <motion.div
        className="relative overflow-hidden rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-2xl border border-white/20 shadow-2xl mb-8 md:mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-6">
          <div className="flex items-center space-x-4 md:space-x-6">
            <Image
              src={avatar || '/default.png'}
              alt="Avatar"
              width={90}
              height={90}
              className="rounded-full border-4 border-blue-500 shadow-lg shadow-blue-500/40 object-cover"
            />
            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-3xl font-bold">{username}</h2>
              <p className="text-gray-300 text-sm md:text-base">{bio || '—'}</p>
              <p className="text-xs md:text-sm text-gray-500">{session.user.email}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={() => setOpenEdit(true)}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-sm md:text-base font-semibold shadow-md transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Loading…' : 'Edit'}
            </motion.button>
            <motion.button
              onClick={handleLogout}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 md:px-6 md:py-3 rounded-xl bg-red-600 hover:bg-red-500 text-sm md:text-base font-semibold shadow-md transition"
            >
              Logout
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
              className="bg-[#1e293b] text-white p-6 rounded-2xl max-w-sm w-full mx-4 shadow-2xl"
            >
              <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold">Username</label>
                  <input
                    name="username"
                    defaultValue={username}
                    className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold">Bio</label>
                  <textarea
                    name="bio"
                    defaultValue={bio}
                    rows={3}
                    className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 focus:outline-none"
                  />
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setOpenEdit(false)}
                    className="flex-1 py-2 rounded-xl bg-gray-600 hover:bg-gray-500 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 font-semibold disabled:opacity-50"
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Section */}
      <section className="mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-lg md:text-2xl font-bold">📺 Watch History</h3>
          {loading && <span className="text-xs opacity-70">Loading…</span>}
        </div>
        {history.length === 0 && !loading ? (
          <p className="text-sm text-gray-400">Belum ada histori.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {history.map((item, idx) => (
              <motion.div
                key={item.id ?? idx}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-xl bg-white/10 backdrop-blur-md border border-white/10"
              >
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  width={400}
                  height={500}
                  className="object-cover w-full h-32 md:h-48"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <span className="text-xs md:text-lg font-semibold">▶ {item.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Favorites Section */}
      <section>
        <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">⭐ Favorites</h3>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {(['anime', 'manga', 'manhwa', 'lightNovel'] as const).map((category) => {
            const list = favorites[category]
            return (
              <motion.div
                key={category}
                whileHover={{ y: -3 }}
                className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 shadow-inner"
              >
                <h4 className="text-base md:text-lg font-semibold capitalize mb-3">
                  {category}
                </h4>
                {list.length === 0 ? (
                  <p className="text-sm text-gray-400">Belum ada favorit.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {list.map((fav, idx) => (
                      <span
                        key={`${category}-${idx}`}
                        className="px-2 md:px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-xs md:text-sm font-medium shadow-md"
                      >
                        {fav}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
            
