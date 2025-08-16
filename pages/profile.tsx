'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { Session } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Dummy data untuk demo (nanti diisi dari Anilist API)
const dummyHistory = [
  { id: 1, title: 'Jujutsu Kaisen Season 2', thumbnail: '/demo/jjk.jpg' },
  { id: 2, title: 'Attack on Titan Final Season', thumbnail: '/demo/aot.jpg' },
  { id: 3, title: 'Sousou no Frieren', thumbnail: '/demo/frieren.jpg' }
]

const dummyFavorites = {
  anime: ['Chainsaw Man', 'One Piece', 'Solo Leveling'],
  manga: ['Oshi no Ko', 'Blue Lock'],
  manhwa: ['Omniscient Reader', 'Tower of God'],
  lightNovel: ['Mushoku Tensei', 'Re:Zero']
}

export default function ProfileDashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.replace('/auth/login')
      } else {
        setSession(data.session)
      }
    }
    loadSession()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/login')
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 text-white">
      {/* Profile Header */}
      <motion.div
        className="flex flex-col md:flex-row items-center md:items-start md:justify-between mb-12 bg-white/5 rounded-2xl p-6 backdrop-blur-lg border border-white/10 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-6">
          <Image
            src="https://i.pravatar.cc/150"
            alt="Avatar"
            width={96}
            height={96}
            className="rounded-full border-4 border-blue-500 shadow-md"
          />
          <div>
            <h2 className="text-2xl font-bold">{session.user.email}</h2>
            <p className="text-gray-400">Otaku Explorer ✨</p>
          </div>
        </div>
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.95 }}
          className="mt-6 md:mt-0 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-semibold shadow-md transition"
        >
          Logout
        </motion.button>
      </motion.div>

      {/* History Section */}
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-4">📺 Watch History</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {dummyHistory.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-xl shadow-lg bg-white/10 backdrop-blur-md border border-white/10"
            >
              <Image
                src={item.thumbnail}
                alt={item.title}
                width={300}
                height={400}
                className="object-cover w-full h-40"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-sm font-semibold">
                {item.title}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Favorites Section */}
      <section>
        <h3 className="text-xl font-bold mb-4">⭐ Favorites</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(dummyFavorites).map(([category, list]) => (
            <motion.div
              key={category}
              whileHover={{ y: -3 }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-inner"
            >
              <h4 className="text-lg font-semibold capitalize mb-3">{category}</h4>
              <ul className="space-y-2 text-gray-300">
                {list.map((fav, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-blue-400">•</span> {fav}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
