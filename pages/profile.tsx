'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { Session } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { ProfileRow, HistoryItem, Favorites } from '@/types/supabase'

const USE_JSON_COLUMNS = true

export default function ProfilePage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const [username, setUsername] = useState('User')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [favorites, setFavorites] = useState<Favorites>({
    anime: [],
    manga: [],
    manhwa: [],
    lightNovel: [],
  })

  // 🔹 Fetch session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // 🔹 Fetch profile data
  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile(session.user.id)
    }
  }, [session])

  const fetchProfile = async (userId: string) => {
    setLoading(true)

    const selectColumns = USE_JSON_COLUMNS
      ? 'id, username, bio, avatar, history, favorites'
      : 'id, username, bio, avatar'

    const { data: profile, error } = await supabase
      .from('profiles')
      .select(selectColumns)
      .eq('id', userId)
      .single<ProfileRow>()

    if (error) {
      console.error(error)
    } else if (profile) {
      setUsername(profile.username ?? 'User')
      setBio(profile.bio ?? '')
      setAvatar(profile.avatar ?? null)
      setHistory(profile.history ?? [])
      setFavorites(profile.favorites ?? { anime: [], manga: [], manhwa: [], lightNovel: [] })
    }

    setLoading(false)
  }

  // 🔹 Save profile data
  const handleSave = async () => {
    if (!session?.user?.id) return

    const payload: Partial<ProfileRow> = {
      id: session.user.id,
      username,
      bio,
      avatar,
    }

    if (USE_JSON_COLUMNS) {
      payload.history = history
      payload.favorites = favorites
    }

    const { error } = await supabase.from('profiles').upsert(payload)
    if (error) console.error(error)
    else alert('Profile updated!')
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to view your profile.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Profile
      </motion.h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={avatar ?? '/logo.png'}
          alt="avatar"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
        <button
          className="px-3 py-2 bg-gray-800 text-white rounded-lg"
          onClick={() => setAvatar(prompt('Enter avatar URL') || avatar)}
        >
          Change Avatar
        </button>
      </div>

      {/* Username */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Bio */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Save
      </button>
    </div>
  )
}
