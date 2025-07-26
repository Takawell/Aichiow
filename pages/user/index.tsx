// pages/user/index.tsx
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaBookmark, FaFireAlt } from 'react-icons/fa'

// Dummy data (nanti bisa diganti dengan data dari API / database)
const userData = {
  name: 'Taka dev',
  avatar: '/default-avatar.png',
  level: 12,
  xp: 3500,
  nextLevelXp: 5000,
  favorites: [
    { id: 1, title: 'Attack on Titan', image: '/dummy/aot.jpg' },
    { id: 2, title: 'Jujutsu Kaisen', image: '/dummy/jujutsu.jpg' },
  ],
  bookmarks: [
    { id: 3, title: 'Naruto Shippuden', image: '/dummy/naruto.jpg' },
    { id: 4, title: 'One Piece', image: '/dummy/onepiece.jpg' },
  ],
}

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<'favorites' | 'bookmarks'>('favorites')

  const xpProgress = (userData.xp / userData.nextLevelXp) * 100

  return (
    <>
      <Head>
        <title>{userData.name} | Profile</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-6 md:p-10">
        {/* Profile Header */}
        <section className="max-w-5xl mx-auto bg-neutral-800/70 rounded-2xl shadow-xl p-6 mb-10 border border-white/10">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
              <Image src={userData.avatar} alt="User Avatar" fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">{userData.name}</h1>
              <p className="text-sm text-white/60">Level {userData.level}</p>

              {/* XP Progress */}
              <div className="mt-3 w-full bg-neutral-700 rounded-full h-3 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-600"
                />
              </div>
              <p className="text-xs text-white/50 mt-1">
                {userData.xp} / {userData.nextLevelXp} XP
              </p>
            </div>
          </div>
        </section>

        {/* Tabs: Favorite vs Bookmark */}
        <div className="max-w-5xl mx-auto mb-6 flex justify-center gap-6">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'favorites'
                ? 'bg-blue-600 shadow-lg scale-105'
                : 'bg-neutral-700 hover:bg-neutral-600'
            }`}
          >
            <FaStar /> Favorites
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'bookmarks'
                ? 'bg-blue-600 shadow-lg scale-105'
                : 'bg-neutral-700 hover:bg-neutral-600'
            }`}
          >
            <FaBookmark /> Bookmarks
          </button>
        </div>

        {/* Content Widget */}
        <section className="max-w-5xl mx-auto">
          {activeTab === 'favorites' && (
            <WidgetGrid title="Your Favorites" items={userData.favorites} icon={<FaFireAlt />} />
          )}
          {activeTab === 'bookmarks' && (
            <WidgetGrid title="Your Bookmarks" items={userData.bookmarks} icon={<FaBookmark />} />
          )}
        </section>
      </main>
    </>
  )
}

function WidgetGrid({
  title,
  items,
  icon,
}: {
  title: string
  items: { id: number; title: string; image: string }[]
  icon: React.ReactNode
}) {
  return (
    <div className="bg-neutral-800/50 border border-white/10 rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-blue-400 text-2xl">{icon}</div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-white/60">No items yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/anime/${item.id}`}
              className="group rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700 hover:border-blue-500/50 shadow hover:shadow-lg transition"
            >
              <div className="relative w-full h-40">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-2">
                <p className="text-sm font-medium truncate group-hover:text-blue-400 transition">
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
