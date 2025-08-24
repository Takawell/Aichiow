'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Session } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'

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

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* ✨ Background Glow */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 8 }}
        />
      </div>

      {/* 🔒 Login Card */}
      <motion.form
        onSubmit={onSubmit}
        className="relative w-full max-w-md space-y-6 p-8 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/10 z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-4xl font-bold text-center text-white">Welcome Back</h1>
        <p className="text-center text-white/60 text-sm">Login to continue your journey 🚀</p>

        <motion.input
          className="w-full bg-white/10 text-white border border-white/20 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          whileFocus={{ scale: 1.02 }}
        />

        <motion.input
          className="w-full bg-white/10 text-white border border-white/20 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          whileFocus={{ scale: 1.02 }}
        />

        <motion.button
          disabled={loading}
          className="w-full flex items-center justify-center rounded-xl p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
        </motion.button>

        {err && <p className="text-red-400 text-sm text-center">{err}</p>}

        <p className="text-sm text-center text-white/70">
          Don&apos;t have an account?{' '}
          <a className="underline text-blue-400 hover:text-blue-300" href="/auth/register">
            Register
          </a>
        </p>
      </motion.form>
    </div>
  )
}
