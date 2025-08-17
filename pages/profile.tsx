'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaTv, FaBook, FaDragon, FaBookOpen } from 'react-icons/fa'
import { useUser } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabaseClient'
import { FavoriteRow } from '@/types/supabase'
import { useFavoriteDetails } from '@/hooks/useFavoriteDetails'
import FavoriteCard from '@/components/favorites/FavoriteCard'

export default function ProfilePage() {
  const user = useUser()
  const router = useRouter()
  const [favorites, setFavorites] = useState<FavoriteRow[]>([])

  useEffect(() => {
    if (!user) {
      router.push('/home')
      return
    }
    async function fetchFavorites() {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching favorites:', error)
      } else {
        setFavorites(data || [])
      }
    }
    fetchFavorites()
  }, [user, router])

  if (!user) return null

  return (
    <>
      <Head>
        <title>{user.email} - Profile | Aichiow</title>
      </Head>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Profile</h1>

        <div className="space-y-6">
          {[
            { key: 'anime', icon: <FaTv /> },
            { key: 'manga', icon: <FaBook /> },
            { key: 'manhwa', icon: <FaDragon /> },
            { key: 'light_novel', icon: <FaBookOpen /> },
          ].map(({ key, icon }) => {
            const list = favorites.filter((f) => f.media_type === key)
            const { details, loading } = useFavoriteDetails(list)

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
                  {loading ? (
                    <span className="text-xs text-gray-400 italic">
                      Loading...
                    </span>
                  ) : details.length > 0 ? (
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
      </main>
    </>
  )
}
