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
import { useFavoriteDetails } from '@/hooks/useFavoriteDetails'
import FavoriteCard from '@/components/favorite/FavoriteCard'

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

      // Load user profile
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single() as { data: UserRow | null; error: any }

      if (profileData) setUser(profileData)

      // Load watch history
      const { data: historyData } = await supabase
        .from('watch_history')
        .select('*')
        .eq('user_id', userId) as { data: WatchHistoryRow[] | null; error: any }

      if (historyData) setHistory(historyData)

      // Load favorites
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
      {/* ... Profile Header & Edit Modal ... */}

      {/* Watch History Section */}
      <section className="mb-8 md:mb-12">
        {/* ... kode watch history tetap ... */}
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
            const details = useFavoriteDetails(list) // ✅ ambil detail

            return (
              <motion.div
                key={key}
                whileHover={{ y: -3 }}
                className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 shadow-inner"
              >
                <h4 className="flex items-center gap-2 text-base md:text-lg font-semibold capitalize mb-3">
                  {icon} {key.replace('_', ' ')}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {details.length > 0 ? (
                    details.map((fav) => (
                      <FavoriteCard key={fav.id} data={fav} />
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      No favorites yet
                    </span>
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
