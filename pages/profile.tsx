'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { Session } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Types
export interface UserRow {
  id: string
  username: string | null
  email: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface WatchHistoryRow {
  id: number
  user_id: string
  media_id: number
  media_type: 'anime' | 'manga' | 'manhwa' | 'light_novel'
  title: string
  thumbnail: string
  watched_at: string
}

export interface FavoriteRow {
  id: number
  user_id: string
  media_id: number
  media_type: 'anime' | 'manga' | 'manhwa' | 'light_novel'
  title: string
}

export default function ProfileDashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<UserRow | null>(null)
  const [history, setHistory] = useState<WatchHistoryRow[]>([])
  const [favorites, setFavorites] = useState<Record<string, FavoriteRow[]>>({})
  const [openEdit, setOpenEdit] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.replace('/auth/login')
        return
      }
      setSession(data.session)
      const userId = data.session.user.id

      // Fetch user
      const { data: userData, error: userError } = await supabase
        .from<'users', UserRow>('users')
        .select('*')
        .eq('id', userId)
        .single()
      if (userError) console.error(userError)
      else setUser(userData)

      // Fetch watch history
      const { data: historyData, error: historyError } = await supabase
        .from<'watch_history', WatchHistoryRow>('watch_history')
        .select('*')
        .eq('user_id', userId)
        .order('watched_at', { ascending: false })
      if (historyError) console.error(historyError)
      else setHistory(historyData || [])

      // Fetch favorites
      const { data: favData, error: favError } = await supabase
        .from<'favorites', FavoriteRow>('favorites')
        .select('*')
        .eq('user_id', userId)
      if (favError) console.error(favError)
      else {
        const grouped: Record<string, FavoriteRow[]> = {}
        favData?.forEach((fav) => {
          if (!grouped[fav.media_type]) grouped[fav.media_type] = []
          grouped[fav.media_type].push(fav)
        })
        setFavorites(grouped)
      }
    }

    loadProfile()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/login')
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return
    const form = e.currentTarget
    const formData = new FormData(form)
    const updated = {
      username: formData.get('username') as string,
      avatar_url: formData.get('avatar_url') as string | null,
    }
    const { error } = await supabase
      .from<'users', UserRow>('users')
      .update(updated)
      .eq('id', user.id)
    if (error) console.error(error)
    else setUser({ ...user, ...updated })
    setOpenEdit(false)
  }

  if (!session || !user) return null

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
              src={user.avatar_url || '/default.png'}
              alt="Avatar"
              width={90}
              height={90}
              className="rounded-full border-4 border-blue-500 shadow-lg shadow-blue-500/40"
            />
            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-3xl font-bold">{user.username || 'No username'}</h2>
              <p className="text-xs md:text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={() => setOpenEdit(true)}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-sm md:text-base font-semibold shadow-md transition"
            >
              Edit
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
                    defaultValue={user.username || ''}
                    className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold">Avatar URL</label>
                  <input
                    name="avatar_url"
                    defaultValue={user.avatar_url || ''}
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
      <section className="mb-8 md:mb-12">
        <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">📺 Watch History</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {history.map((item) => (
            <motion.div
              key={item.id}
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
      </section>

      {/* Favorites Section */}
      <section>
        <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">⭐ Favorites</h3>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {Object.entries(favorites).map(([category, list]) => (
            <motion.div
              key={category}
              whileHover={{ y: -3 }}
              className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 shadow-inner"
            >
              <h4 className="text-base md:text-lg font-semibold capitalize mb-3">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {list.map((fav) => (
                  <span
                    key={fav.id}
                    className="px-2 md:px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-xs md:text-sm font-medium shadow-md"
                  >
                    {fav.title}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
