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

        if (profileData) {
          setUser(profileData)
        } else {
          setUser({
            id: userId,
            username: 'Otaku Explorer ✨',
            bio: 'Lover of anime, manga, manhwa & light novels.',
            avatar_url: '/default.png',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as UserRow)
        }

        // history
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
              watch_count: typeof it.watch_count === 'number' ? it.watch_count : Number(it.watch_count) || 1,
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

        // favorites
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/login')
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user || !session) return

    const formData = new FormData(e.currentTarget)
    const newUsername = (formData.get('username') as string) || ''
    const newBio = (formData.get('bio') as string) || ''

    try {
      const { error } = await supabase.from('users').upsert({
        id: user.id,
        username: newUsername || user.username,
        bio: newBio || user.bio,
        avatar_url: user.avatar_url || '/default.png',
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error('Error saving profile:', error)
      } else {
        setUser({
          ...user,
          username: newUsername || user.username,
          bio: newBio || user.bio,
        })
        setOpenEdit(false)
      }
    } catch (err) {
      console.error('handleSave error:', err)
    }
  }

  if (!session || !user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#121026] to-[#0f172a] p-4 md:p-8 text-white">
      {/* Header */}
      <motion.div
        className="relative overflow-hidden rounded-3xl p-6 md:p-10 backdrop-blur-2xl border border-white/15 shadow-[0_0_35px_rgba(99,102,241,0.45)] mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0">
          <Image src="/background.png" alt="bg" fill className="object-cover opacity-25 blur-sm" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/25 via-purple-500/25 to-pink-500/25 mix-blend-overlay" />

        <div className="relative flex flex-col md:flex-row items-center md:justify-between gap-6">
          {/* Avatar */}
          <motion.div whileHover={{ rotate: 6, scale: 1.05 }} transition={{ type: 'spring', stiffness: 200 }} className="relative">
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500/40 via-purple-500/40 to-fuchsia-500/40 blur-lg" />
            <Image
              src={user.avatar_url || '/default.png'}
              alt="Avatar"
              width={120}
              height={120}
              className="relative rounded-full border-4 border-blue-500/80 shadow-[0_10px_30px_rgba(59,130,246,0.6)]"
            />
          </motion.div>

          {/* Info */}
          <div className="text-center md:text-left max-w-xl">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-wide drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              {user.username ?? 'Otaku Explorer ✨'}
            </h2>
            <p className="text-gray-300 text-sm md:text-base italic">
              {user.bio ?? 'Lover of anime, manga, manhwa & light novels.'}
            </p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">{session.user.email}</p>

            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10">
                History: <b>{history.length}</b>
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10">
                Favorites: <b>{favorites.length}</b>
              </span>
            </div>
          </div>

          {/* Buttons */}
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
              className="bg-[#101827]/95 text-white p-6 rounded-2xl max-w-md w-full mx-4 border border-white/10 shadow-2xl"
            >
              <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold">Username</label>
                  <input
                    name="username"
                    defaultValue={user.username ?? ""}
                    className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold">Bio</label>
                  <textarea
                    name="bio"
                    defaultValue={user.bio ?? ""}
                    rows={3}
                    className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 focus:outline-none"
                  />
                </div>

                {/* Live Preview */}
                <div className="mt-6">
                  <p className="text-sm font-semibold mb-2">Preview</p>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                    <Image
                      src={user.avatar_url || '/default.png'}
                      alt="preview"
                      width={50}
                      height={50}
                      className="rounded-full border-2 border-blue-500"
                    />
                    <div>
                      <p className="font-bold">{user.username ?? "Otaku Explorer ✨"}</p>
                      <p className="text-xs text-gray-300 italic">
                        {user.bio ?? "Lover of anime, manga, manhwa & light novels."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
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

      {/* History Section */}
      <section className="mb-12">
        <h3 className="flex items-center gap-2 text-xl font-bold mb-4">
          <FaHistory className="text-blue-400" /> Watch History
        </h3>
        {history.length === 0 ? (
          <p className="text-gray-400 italic">No history yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((h) => (
              <motion.div
                key={h.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-lg"
              >
                <div className="flex gap-4">
                  <Image
                    src={h.anime?.cover_image || '/default.png'}
                    alt={h.anime?.title_romaji || 'Anime'}
                    width={80}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold">{h.anime?.title_romaji}</p>
                    <p className="text-xs text-gray-400">Watched {h.watch_count}x</p>
                    <p className="text-xs text-gray-500">{new Date(h.watched_at).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Favorites Section */}
      <section>
        <h3 className="flex items-center gap-2 text-xl font-bold mb-4">
          <FaStar className="text-yellow-400" /> Favorites
        </h3>
        {favorites.length === 0 ? (
          <p className="text-gray-400 italic">No favorites yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {favorites.map((f) => (
              <motion.div
                key={f.id}
                whileHover={{ scale: 1.05 }}
                className="relative group rounded-xl overflow-hidden shadow-lg border border-white/10"
              >
                <Image
                  src={f.cover_image || '/default.png'}
                  alt={f.title || 'Favorite'}
                  width={300}
                  height={400}
                  className="object-cover w-full h-48 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 text-white text-sm font-semibold drop-shadow-lg">
                  {f.title}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}   
