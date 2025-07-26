// pages/user/index.tsx
'use client'

import { useState, useRef } from 'react'
import Head from 'next/head'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function UserProfile() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [avatar, setAvatar] = useState('/avatar.png') // default avatar

  // Fetch favorites
  const { data: favorites = [], isLoading: favLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => (await fetch('/api/user/favorites')).json(),
  })

  // Fetch bookmarks
  const { data: bookmarks = [], isLoading: bmLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => (await fetch('/api/user/bookmarks')).json(),
  })

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('avatar', file)
    setUploading(true)

    try {
      const { data } = await axios.post('/api/user/avatar', formData)
      setAvatar(data.avatar)
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <Head>
        <title>User Profile | Aichiow</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white p-6">
        {/* Profile Header */}
        <div className="max-w-5xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative inline-block cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Image
              src={avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className="rounded-full border-4 border-blue-500 shadow-lg hover:scale-105 transition-transform"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                <span className="text-sm">Uploading...</span>
              </div>
            )}
          </motion.div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <h1 className="text-3xl font-extrabold mt-4">Your Profile</h1>
        </div>

        {/* Favorites Section */}
        <section className="max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-4">Favorites</h2>
          {favLoading ? (
            <p>Loading favorites...</p>
          ) : favorites.length === 0 ? (
            <p className="text-gray-400">No favorites yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {favorites.map((fav: any) => (
                <motion.div
                  key={fav.id}
                  whileHover={{ scale: 1.05 }}
                  className="backdrop-blur-md bg-white/5 p-3 rounded-xl border border-white/10 shadow-lg"
                >
                  <Image
                    src={fav.image}
                    alt={fav.title}
                    width={150}
                    height={200}
                    className="rounded-md"
                  />
                  <p className="mt-2 text-sm">{fav.title}</p>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Bookmarks Section */}
        <section className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Bookmarks</h2>
          {bmLoading ? (
            <p>Loading bookmarks...</p>
          ) : bookmarks.length === 0 ? (
            <p className="text-gray-400">No bookmarks yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {bookmarks.map((bm: any) => (
                <motion.div
                  key={bm.id}
                  whileHover={{ scale: 1.05 }}
                  className="backdrop-blur-md bg-white/5 p-3 rounded-xl border border-white/10 shadow-lg"
                >
                  <Image
                    src={bm.image}
                    alt={bm.title}
                    width={150}
                    height={200}
                    className="rounded-md"
                  />
                  <p className="mt-2 text-sm">{bm.title}</p>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
