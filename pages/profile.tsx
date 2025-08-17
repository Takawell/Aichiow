'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { Session } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { UserRow, WatchHistoryRow, FavoriteRow } from '@/types/supabase'
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

// 🔹 Favorite Card
function FavoriteCard({ fav }: { fav: FavoriteRow }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-24 md:w-32 rounded-xl overflow-hidden shadow-lg bg-white/10 border border-white/10"
    >
      <Image
        src={fav.cover_url || '/demo/default.jpg'}
        alt={fav.title}
        width={200}
        height={250}
        className="object-cover w-full h-32 md:h-40"
      />
      <div className="p-2 text-xs md:text-sm text-center line-clamp-2">
        {fav.title}
      </div>
    </motion.div>
  )
}

export default function ProfileDashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<UserRow | null>(null)
  const [history, setHistory] = useState<WatchHistoryRow[]>([])
  const [favorites, setFavorites] = useState<FavoriteRow[]>([])
  const [openEdit, setOpenEdit] = useState(false)
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

      // User
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single() as { data: UserRow | null; error: any }

      if (profileData) setUser(profileData)

      // History
      const { data: historyData } = await supabase
        .from('watch_history')
        .select('*')
        .eq('user_id', userId) as { data: WatchHistoryRow[] | null; error: any }

      if (historyData) setHistory(historyData)

      // Favorites
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId) as { data: FavoriteRow[] | null; error: any }

      if (favoritesData) setFavorites(favoritesData)
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
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4 md:p-8 text-white">
      {/* Profile Header */}
      {/* ... kode header dan modal tetap sama ... */}

      {/* Watch History Section */}
      <section className="mb-8 md:mb-12">
        <h3 className="flex items-center gap-2 text-lg md:text-2xl font-bold mb-4 md:mb-6">
          <FaHistory /> Watch History
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {history.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-xl bg-white/10 backdrop-blur-md border border-white/10"
            >
              <Image
                src={`/demo/${item.media_id}.jpg`}
                alt={item.media_type}
                width={400}
                height={500}
                className="object-cover w-full h-32 md:h-48"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <span className="text-xs md:text-lg font-semibold">▶ {item.media_type}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Favorites Section */}
      <section>
        <h3 className="flex items-center gap-2 text-lg md:text-2xl font-bold mb-4 md:mb-6">
          <FaStar /> Favorites
        </h3>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
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
                whileHover={{ y: -3 }}
                className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 shadow-inner"
              >
                <h4 className="flex items-center gap-2 text-base md:text-lg font-semibold capitalize mb-3">
                  {icon} {key.replace('_', ' ')}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {list.map((fav) => (
                    <FavoriteCard key={fav.id} fav={fav} />
                  ))}
                  {list.length === 0 && (
                    <span className="text-xs text-gray-400 italic">No favorites yet</span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
