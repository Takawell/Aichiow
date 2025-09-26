'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { Session } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'
import { FaGithub, FaDiscord } from 'react-icons/fa'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      if (data.session) router.replace('/profile')
    }
    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) router.replace('/profile')
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErr(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setErr(error.message)
    setLoading(false)
  }

  const handleOAuth = async (provider: 'github' | 'discord') => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })
    if (error) setErr(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/95" />
      
      {/* Login Card */}
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-sm space-y-6 p-8 rounded-md bg-black/80 border border-zinc-800 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center">Sign In</h1>

        {/* Email Input */}
        <input
          className="w-full bg-zinc-900 text-white rounded-md p-3 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600"
          type="email"
          placeholder="Email or phone number"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        {/* Password Input */}
        <input
          className="w-full bg-zinc-900 text-white rounded-md p-3 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {/* Login Button */}
        <button
          disabled={loading}
          className="w-full flex items-center justify-center rounded-md p-3 bg-red-600 hover:bg-red-700 font-semibold transition disabled:opacity-50"
          type="submit"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-zinc-700" />
          <span className="text-zinc-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-zinc-700" />
        </div>

        {/* OAuth Buttons */}
        <button
          type="button"
          onClick={() => handleOAuth('github')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 rounded-md p-3 bg-zinc-800 hover:bg-zinc-700 transition disabled:opacity-50"
        >
          <FaGithub className="w-5 h-5" /> GitHub
        </button>

        <button
          type="button"
          onClick={() => handleOAuth('discord')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 rounded-md p-3 bg-zinc-800 hover:bg-zinc-700 transition disabled:opacity-50"
        >
          <FaDiscord className="w-5 h-5" /> Discord
        </button>

        {err && <p className="text-red-500 text-sm text-center">{err}</p>}

        <p className="text-sm text-center text-zinc-400">
          New to Aichiow?{' '}
          <a className="text-white hover:underline" href="/auth/register">
            Sign up now
          </a>
        </p>
      </form>
    </div>
  )
}
