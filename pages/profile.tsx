'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import LogoutButton from '@/components/ui/LogoutButton'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'

type Profile = {
  id: string
  username: string | null
  email: string | null
  avatar_url: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/auth/login')
        return
      }

      // ambil profile dari table `users`
      const { data } = await supabase
        .from('users')
        .select('id, username, email, avatar_url')
        .eq('id', session.user.id)
        .single()

      if (data) {
        setProfile(data)
      } else {
        // fallback pake metadata supabase
        setProfile({
          id: session.user.id,
          username: session.user.user_metadata?.username ?? null,
          email: session.user.email ?? null,
          avatar_url: session.user.user_metadata?.avatar_url ?? null,
        })
      }

      setLoading(false)
    }

    loadProfile()
  }, [router])

  if (loading) {
    return <p className="p-6">Loading...</p>
  }

  if (!profile) return null

  const avatar = profile.avatar_url || '/default.png'

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <LogoutButton />
        </header>

        {/* User Info */}
        <div className="flex items-center gap-6">
          <Image
            src={avatar}
            alt="avatar"
            width={112}
            height={112}
            className="rounded-full object-cover border-2 border-gray-300"
          />
          <div>
            <h2 className="text-xl font-semibold">{profile.username ?? 'User'}</h2>
            <p className="text-gray-600">{profile.email ?? ''}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
