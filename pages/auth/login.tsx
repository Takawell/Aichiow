'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/profile')
      }
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/profile')
      }
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
    if (error) {
      setErr(error.message)
      setLoading(false)
      return
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 text-white">
      <motion.form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-6 p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-3xl font-semibold text-center text-white">Welcome Back</h1>

        <motion.input
          className="w-full bg-white/10 text-white border border-white/20 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white transition"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <motion.input
          className="w-full bg-white/10 text-white border border-white/20 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white transition"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <motion.button
          disabled={loading}
          className="w-full rounded-xl p-3 bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50"
          type="submit"
        >
          {loading ? 'Logging in…' : 'Login'}
        </motion.button>

        {err && <p className="text-red-400 text-sm text-center">{err}</p>}

        <p className="text-sm text-center text-white/70">
          Don't have an account yet?{' '}
          <a className="underline text-blue-400 hover:text-blue-300" href="/auth/register">
            Register
          </a>
        </p>
      </motion.form>
    </div>
  )
}
