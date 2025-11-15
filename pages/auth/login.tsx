'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Session } from '@supabase/supabase-js'
import { Loader2, Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react'
import { FaGithub, FaDiscord, FaGoogle } from 'react-icons/fa'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-950 to-black p-4 sm:p-6 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-sky-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-600/10 rounded-full blur-3xl"
        />
      </div>

      <motion.form
        onSubmit={onSubmit}
        className="relative w-full max-w-md space-y-5 sm:space-y-6 p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-md shadow-xl border border-sky-500/20 z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className="inline-block"
          >
            <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-sky-400 mx-auto mb-2" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">Welcome back</h1>
          <p className="text-sky-300 text-xs sm:text-sm">Login to continue your journey</p>
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400/60" />
          <motion.input
            className="w-full bg-white/5 text-white border border-sky-500/30 rounded-xl p-3 pl-11 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm sm:text-base"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400/60" />
          <motion.input
            className="w-full bg-white/5 text-white border border-sky-500/30 rounded-xl p-3 pl-11 pr-12 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm sm:text-base"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400/60 hover:text-sky-400 transition"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <motion.button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl p-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-base"
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Login</span>
            </>
          )}
        </motion.button>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex-1 h-px bg-sky-500/20" />
          <span className="text-white/40 text-xs sm:text-sm">or continue with</span>
          <div className="flex-1 h-px bg-sky-500/20" />
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <motion.button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
            className="flex items-center justify-center rounded-xl p-3 bg-white/5 border border-sky-500/20 hover:bg-sky-500/10 hover:border-sky-500/40 transition disabled:opacity-50 group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGithub className="w-5 h-5 text-white/60 group-hover:text-sky-400 transition" />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => handleOAuthLogin('discord')}
            disabled={loading}
            className="flex items-center justify-center rounded-xl p-3 bg-white/5 border border-sky-500/20 hover:bg-sky-500/10 hover:border-sky-500/40 transition disabled:opacity-50 group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDiscord className="w-5 h-5 text-white/60 group-hover:text-sky-400 transition" />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="flex items-center justify-center rounded-xl p-3 bg-white/5 border border-sky-500/20 hover:bg-sky-500/10 hover:border-sky-500/40 transition disabled:opacity-50 group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGoogle className="w-5 h-5 text-white/60 group-hover:text-sky-400 transition" />
          </motion.button>
        </div>

        {err && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <p className="text-red-400 text-xs sm:text-sm text-center">{err}</p>
          </motion.div>
        )}

        <p className="text-xs sm:text-sm text-center text-white/70">
          Don't have an account?{' '}
          <a className="underline text-sky-400 hover:text-sky-300 transition" href="/auth/register">
            Register
          </a>
        </p>

        <div className="pt-4 border-t border-sky-500/10">
          <a href="/auth/reset-password" className="text-xs text-sky-400/60 hover:text-sky-400 transition block text-center">
            Forgot password?
          </a>
        </div>
      </motion.form>

      <div className="absolute bottom-4 left-0 right-0 text-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex items-center justify-center gap-2 text-sky-400/40 text-xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Secured with modern encryption</span>
          <Sparkles className="w-3 h-3" />
        </motion.div>
      </div>
    </div>
  )
}
