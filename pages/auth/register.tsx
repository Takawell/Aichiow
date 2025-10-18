'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.replace('/profile')
        }
      }
    )
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    setErr(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: username } },
    })

    setLoading(false)

    if (error) {
      setErr(error.message)
      return
    }

    setMsg(
      "Account created! Check your inbox for the verification link. Once confirmed, you'll be redirected automatically."
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 text-white">
      <motion.form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-6 p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-white/10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-3xl font-semibold text-center text-white">
          Create your Account
        </h1>

        <motion.input
          className="w-full bg-white/10 text-white border border-white/20 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white transition"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <motion.input
          className="w-full bg-white/10 text-white border border-white/20 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white transition"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <motion.input
            className="w-full bg-white/10 text-white border border-white/20 rounded-xl p-3 pr-12 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white transition"
            type={showPass ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 text-white/60 hover:text-white transition"
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <motion.button
          disabled={loading}
          className="w-full rounded-xl p-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
          type="submit"
          whileTap={{ scale: 0.97 }}
        >
          {loading ? 'Registering…' : 'Register'}
        </motion.button>

        {err && <p className="text-red-400 text-sm text-center">{err}</p>}
        {msg && <p className="text-green-400 text-sm text-center">{msg}</p>}

        <p className="text-sm text-center text-white/70">
          Already have an account?{' '}
          <a
            className="underline text-blue-400 hover:text-blue-300 transition"
            href="/auth/login"
          >
            Login
          </a>
        </p>
      </motion.form>
    </div>
  )
}
