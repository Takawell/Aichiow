import { GetServerSidePropsContext, GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import LogoutButton from '@/components/ui/LogoutButton'

type Profile = {
  id: string
  username: string | null
  email: string | null
  avatar_url: string | null
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return { redirect: { destination: '/auth/login', permanent: false } }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id, username, email, avatar_url')
    .eq('id', session.user.id)
    .single()

  return { props: { profile } }
}

export default function ProfilePage({ profile }: { profile: Profile }) {
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history')
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
          <img
            src={avatar}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
            onError={(e: any) => { e.currentTarget.src = '/default.png' }}
          />
          <div>
            <h2 className="text-xl font-semibold">{profile?.username ?? 'User'}</h2>
            <p className="text-gray-600">{profile?.email ?? ''}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-gray-200">
          <button
            className={`px-4 py-2 -mb-2 font-semibold ${activeTab === 'history' ? 'border-b-4 border-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('history')}
          >
            Watch History
          </button>
          <button
            className={`px-4 py-2 -mb-2 font-semibold ${activeTab === 'favorites' ? 'border-b-4 border-black' : 'text-gray-500'}`}
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
                <img src="/default.png" alt="Anime" className="w-16 h-16 rounded-lg object-cover" />
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
                <img src="/default.png" alt="Anime" className="w-24 h-24 rounded-lg object-cover mb-2" />
                <h3 className="font-semibold text-sm text-center">Anime Title</h3>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-xl shadow-sm hover:shadow-md transition">
                <img src="/default.png" alt="Anime" className="w-24 h-24 rounded-lg object-cover mb-2" />
                <h3 className="font-semibold text-sm text-center">Anime Title</h3>
              </div>
              {/* Add more favorites dynamically later */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
