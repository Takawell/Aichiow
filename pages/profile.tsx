import { GetServerSidePropsContext, GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import LogoutButton from '@/components/ui/LogoutButton'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

type Profile = {
  id: string
  username: string | null
  email: string | null
  avatar_url: string | null
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabaseServer = createServerSupabaseClient(ctx)
  const {
    data: { session }
  } = await supabaseServer.auth.getSession()

  if (!session?.user) {
    return { redirect: { destination: '/auth/login', permanent: false } }
  }

  const { data: profile } = await supabaseServer
    .from('users')
    .select('id, username, email, avatar_url')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    return {
      props: {
        profile: {
          id: session.user.id,
          username: session.user.user_metadata?.username ?? null,
          email: session.user.email ?? null,
          avatar_url: session.user.user_metadata?.avatar_url ?? null
        }
      }
    }
  }

  return { props: { profile } }
}

export default function ProfilePage({ profile }: { profile: Profile }) {
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history')
  const router = useRouter()

  // Client-side guard: kalau nggak ada session di client, balik ke login
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/auth/login')
    })
  }, [router])

  const avatar = profile?.avatar_url || '/default.png'

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
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default.png'
            }}
          />
          <div>
            <h2 className="text-xl font-semibold">{profile?.username ?? 'User'}</h2>
            <p className="text-gray-600">{profile?.email ?? ''}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-gray-200">
          <button
            className={`px-4 py-2 -mb-2 font-semibold ${
              activeTab === 'history' ? 'border-b-4 border-black' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('history')}
          >
            Watch History
          </button>
          <button
            className={`px-4 py-2 -mb-2 font-semibold ${
              activeTab === 'favorites' ? 'border-b-4 border-black' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'history' ? (
            <div className="space-y-4">
              <p className="text-gray-500">Your watch history will appear here.</p>
              {/* Example history item */}
              <div className="flex items-center gap-4 p-4 border rounded-xl shadow-sm hover:shadow-md transition">
                <Image
                  src="/default.png"
                  alt="Anime"
                  width={64}
                  height={64}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold">Anime Title</h3>
                  <p className="text-gray-500 text-sm">Watched 2 hours ago</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Example favorite item */}
              <div className="flex flex-col items-center p-4 border rounded-xl shadow-sm hover:shadow-md transition">
                <Image
                  src="/default.png"
                  alt="Anime"
                  width={96}
                  height={96}
                  className="rounded-lg object-cover mb-2"
                />
                <h3 className="font-semibold text-sm text-center">Anime Title</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
