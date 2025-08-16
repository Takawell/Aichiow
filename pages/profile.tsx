'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { Session } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { UserRow, WatchHistoryRow, FavoriteRow } from '@/types/supabase'

export default function ProfileDashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserRow | null>(null)
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

      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from<UserRow>('users')
        .select('*')
        .eq('id', userId)
        .single()
      if (profileError) console.error(profileError)
      else setProfile(profileData)

      // Load watch history
      const { data: historyData, error: historyError } = await supabase
        .from<WatchHistoryRow>('watch_history')
        .select('*')
        .eq('user_id', userId)
        .order('watched_at', { ascending: false })
      if (historyError) console.error(historyError)
      else setHistory(historyData || [])

      // Load favorites
      const { data: favData, error: favError } = await supabase
        .from<FavoriteRow>('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('added_at', { ascending: false })
      if (favError) console.error(favError)
      else {
        const grouped: Record<string, FavoriteRow[]> = {}
        favData?.forEach((f) => {
          if (!grouped[f.media_type]) grouped[f.media_type] = []
          grouped[f.media_type].push(f)
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

  if (!session || !profile) return null

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
              src={profile.avatar_url || '/default.png'}
              alt="Avatar"
              width={90}
              height={90}
              className="rounded-full border-4 border-blue-500 shadow-lg shadow-blue-500/40"
            />
            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-3xl font-bold">{profile.username || 'No username'}</h2>
              <p className="text-gray-300 text-sm md:text-base">{profile.bio || 'No bio yet.'}</p>
              <p className="text-xs md:text-sm text-gray-500">{profile.email}</p>
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

      {/* Watch History */}
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
                src={`/covers/${item.media_id}.jpg`} // atau sesuaikan path cover dari API/asset
                alt={`${item.media_type} ${item.media_id}`}
                width={400}
                height={500}
                className="object-cover w-full h-32 md:h-48"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <span className="text-xs md:text-lg font-semibold">▶ {item.media_type} #{item.media_id}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Favorites */}
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
                    {fav.media_type} #{fav.media_id}
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
