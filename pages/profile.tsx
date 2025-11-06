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

        const userData = sess.user
        const avatarUrl =
          userData?.user_metadata?.avatar_url ||
          userData?.user_metadata?.picture ||
          '/default.png'

        const baseUser: UserRow = {
          id: userData.id,
          username: userData.user_metadata?.username || userData.email || 'Otaku Explorer ✨',
          bio: userData.user_metadata?.bio || 'Lover of anime, manga, manhwa & light novels.',
          avatar_url: avatarUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        setUser(baseUser)

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
          .eq('user_id', userData.id)
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

        const { data: favoritesData } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', userData.id)

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

  if (!session || !user) return null

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/default.png'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#121026] to-[#0f172a] p-4 md:p-8 text-white">
      <motion.div
        className="relative overflow-hidden rounded-3xl p-6 md:p-10 backdrop-blur-2xl border border-white/15 shadow-[0_0_35px_rgba(99,102,241,0.45)] mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0">
          <Image
            src="/background.png"
            alt="bg"
            fill
            className="object-cover opacity-25 blur-sm"
            onError={handleImageError}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/25 via-purple-500/25 to-pink-500/25 mix-blend-overlay" />

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
              onError={handleImageError}
              className="relative rounded-full border-4 border-blue-500/80 shadow-[0_10px_30px_rgba(59,130,246,0.6)] object-cover"
            />
          </motion.div>

          <div className="text-center md:text-left max-w-xl">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-wide drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              {user.username}
            </h2>
            <p className="text-gray-300 text-sm md:text-base italic">
              {user.bio}
            </p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              {session.user.email}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10">
                History: <b>{history.length}</b>
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10">
                Favorites: <b>{favorites.length}</b>
              </span>
            </div>
          </div>

          <div className="flex gap-3">
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

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl h-36 md:h-52 bg-white/10 border border-white/10 animate-pulse"
              />
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
                  src={
                    item.anime?.cover_image ||
                    item.trailer_thumbnail ||
                    '/default.png'
                  }
                  alt={item.anime?.title_romaji || 'Trailer'}
                  width={400}
                  height={500}
                  onError={handleImageError}
                  className="object-cover w-full h-36 md:h-52"
                />
                <span className="absolute left-2 top-2 z-10 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide bg-black/60 border border-white/10">
                  {item.watch_count}x
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="mt-6 text-center text-sm text-gray-400">
            No viewing history yet.
          </div>
        )}
      </section>

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
          <div className="text-sm text-gray-400">Loading favorites...</div>
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
                  className="relative overflow-hidden rounded-2xl p-6 border border-white/10 shadow-lg bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl"
                >
                  <div className="relative flex items-center justify-between mb-4">
                    <h4 className="flex items-center gap-2 text-lg font-semibold capitalize">
                      <span className="text-xl">{icon}</span>{' '}
                      {key.replace('_', ' ')}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 border border-white/10">
                      {list.length}
                    </span>
                  </div>

                  <div className="relative flex flex-wrap gap-2 z-10">
                    {list.length > 0 ? (
                      list.map((fav: any) => (
                        <span
                          key={fav.id}
                          title={String(fav.media_id)}
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-xs md:text-sm font-medium shadow-md hover:scale-105 transition border border-white/10"
                        >
                          {fav?.media_title ?? fav?.title ?? fav?.media_id}
                        </span>
                      ))
                    ) : (
                      <div className="w-full text-xs text-gray-400 italic">
                        No favorites yet
                      </div>
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
