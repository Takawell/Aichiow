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
  FaCamera,
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

        let finalProfile: UserRow = profileData || {
          id: userId,
          username: 'Otaku Explorer ✨',
          bio: 'Lover of anime, manga, manhwa & light novels.',
          avatar_url: '/default.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // cek localStorage
        const stored = localStorage.getItem('localProfile')
        if (stored) {
          const parsed = JSON.parse(stored)
          finalProfile = { ...finalProfile, ...parsed }
        }

        setUser(finalProfile)

        // load history
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
              watch_count: Number(it.watch_count) || 1,
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

        // load favorites
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

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return
    const formData = new FormData(e.currentTarget)
    const newUsername = (formData.get('username') as string) || user.username
    const newBio = (formData.get('bio') as string) || user.bio

    const updated = { ...user, username: newUsername, bio: newBio }
    setUser(updated)
    localStorage.setItem('localProfile', JSON.stringify(updated))
    setOpenEdit(false)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const updated = { ...user, avatar_url: reader.result as string }
      setUser(updated)
      localStorage.setItem('localProfile', JSON.stringify(updated))
    }
    reader.readAsDataURL(file)
  }

  if (!session || !user) return null

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(59,130,246,0.2),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(236,72,153,0.15),transparent)] from-[#0f172a] via-[#121026] to-[#0f172a] p-4 md:p-8 text-white">
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
          <motion.div whileHover={{ rotate: 6, scale: 1.05 }} transition={{ type: 'spring', stiffness: 200 }} className="relative">
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500/40 via-purple-500/40 to-fuchsia-500/40 blur-lg" />
            <Image
              src={user.avatar_url || '/default.png'}
              alt="Avatar"
              width={120}
              height={120}
              className="relative rounded-full border-4 border-blue-500/80 shadow-[0_10px_30px_rgba(59,130,246,0.6)] object-cover"
            />
            <label className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500 transition">
              <FaCamera className="text-white text-sm" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </motion.div>

          <div className="text-center md:text-left max-w-xl">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-wide drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              {user.username}
            </h2>
            <p className="text-gray-300 text-sm md:text-base italic">
              {user.bio}
            </p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">{session.user.email}</p>
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

      {/* Edit Modal */}
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
              className="bg-[#101827]/95 text-white p-6 rounded-2xl max-w-sm w-full mx-4 border border-white/10"
            >
              <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold">Username</label>
                  <input
                    name="username"
                    defaultValue={user.username}
                    className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold">Bio</label>
                  <textarea
                    name="bio"
                    defaultValue={user.bio}
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
    </div>
  )
}
