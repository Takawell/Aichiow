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
        if (event === 'SIGNED_IN' && session) router.replace('/profile')
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

    if (error) return setErr(error.message)

    setMsg(
      "Account created! Check your inbox for the verification link. Once confirmed, you'll be redirected automatically."
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#06060f] via-[#0c0c1a] to-[#111122] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(22)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-sky-400/10 rounded-full"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-md z-10 bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_35px_rgba(56,189,248,0.15)]"
      >
        <motion.h1
          className="text-3xl font-bold text-center text-white mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Create your Account
        </motion.h1>

        <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
          <input
            className="w-full bg-white/10 text-white border border-white/20 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400/70 transition"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </motion.div>

        <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2 mt-4">
          <input
            className="w-full bg-white/10 text-white border border-white/20 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400/70 transition"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </motion.div>

        <div className="relative mt-4">
          <input
            className="w-full bg-white/10 text-white border border-white/20 rounded-xl p-3 pr-12 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400/70 transition"
            type={showPass ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3.5 text-white/60 hover:text-white transition"
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <motion.button
          disabled={loading}
          type="submit"
          className="w-full mt-6 p-3 font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 rounded-xl shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-90 active:scale-95 transition disabled:opacity-50"
          whileTap={{ scale: 0.97 }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </motion.button>

        {err && (
          <motion.p
            className="text-red-400 text-sm text-center mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {err}
          </motion.p>
        )}
        {msg && (
          <motion.p
            className="text-green-400 text-sm text-center mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {msg}
          </motion.p>
        )}

        <p className="text-sm text-center mt-6 text-white/60">
          Already have an account?{' '}
          <a
            href="/auth/login"
            className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition"
          >
            Login
          </a>
        </p>
      </motion.form>
    </div>
  )
}
