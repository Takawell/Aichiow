'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Session } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'
import { FaGithub, FaDiscord, FaGoogle } from 'react-icons/fa'

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

  const handleOAuthLogin = async (provider: 'github' | 'discord' | 'google') => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
    })
    if (error) setErr(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 text-white relative overflow-hidden">
      {/* Background efek blur */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 8 }}
        />
      </div>

      {/* Card */}
      <motion.form
        onSubmit={onSubmit}
        className="relative w-full max-w-md space-y-6 p-8 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-3xl font-semibold text-center text-white">Welcome back</h1>
        <p className="text-center text-white/60 text-sm">Login to continue your journey 🚀</p>

        {/* Email input */}
        <motion.input
          className="w-full bg-white/10 text-white border border-white/20 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          whileFocus={{ scale: 1.02 }}
        />

        {/* Password input */}
        <motion.input
          className="w-full bg-white/10 text-white border border-white/20 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          whileFocus={{ scale: 1.02 }}
        />

        {/* Login button */}
        <motion.button
          disabled={loading}
          className="w-full flex items-center justify-center rounded-xl p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-white/40 text-sm">or continue with</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Social buttons grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* GitHub */}
          <motion.button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
            className="flex items-center justify-center rounded-xl p-4 bg-gray-900 text-white shadow-lg hover:bg-gray-800 transition disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGithub className="w-6 h-6" />
          </motion.button>

          {/* Discord */}
          <motion.button
            type="button"
            onClick={() => handleOAuthLogin('discord')}
            disabled={loading}
            className="flex items-center justify-center rounded-xl p-4 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg hover:from-indigo-400 hover:to-indigo-600 transition disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDiscord className="w-6 h-6" />
          </motion.button>

          {/* Google */}
          <motion.button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="relative flex items-center justify-center rounded-xl p-4 bg-white text-gray-800 shadow-lg border border-gray-200 overflow-hidden disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-300 to-blue-500 opacity-30 blur-2xl"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            />
            <FaGoogle className="w-6 h-6 relative z-10 text-red-500" />
          </motion.button>
        </div>

        {err && <p className="text-red-400 text-sm text-center">{err}</p>}

        <p className="text-sm text-center text-white/70">
          Don’t have an account?{' '}
          <a className="underline text-blue-400 hover:text-blue-300" href="/auth/register">
            Register
          </a>
        </p>
      </motion.form>
    </div>
  )
}
