'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { Loader2, Lock, Eye, EyeOff, CheckCircle, Sparkles } from 'lucide-react'
import { useRouter } from 'next/router'

export default function UpdatePassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) return
    })
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    setMsg(null)

    if (password !== confirm) {
      setErr('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) setErr(error.message)
    else {
      setMsg('Password successfully updated.')
      setTimeout(() => router.replace('/auth/login'), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-950 to-black p-4 sm:p-6 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-sky-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-600/10 rounded-full blur-3xl"
        />
      </div>

      <motion.form
        onSubmit={onSubmit}
        className="relative w-full max-w-md space-y-6 p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-md shadow-xl border border-sky-500/20 z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className="inline-block"
          >
            <Lock className="w-14 h-14 sm:w-16 sm:h-16 text-sky-400 mx-auto opacity-90" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Update Password
          </h1>

          <p className="text-sky-300 text-xs sm:text-sm">
            Create a new secure password for your account.
          </p>
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400/60" />
          <motion.input
            type={showPassword ? 'text' : 'password'}
            className="w-full bg-white/5 text-white border border-sky-500/30 rounded-xl p-3 pl-11 pr-12 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm sm:text-base"
            placeholder="New Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
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

        <div className="relative">
          <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400/60" />
          <motion.input
            type={showPassword ? 'text' : 'password'}
            className="w-full bg-white/5 text-white border border-sky-500/30 rounded-xl p-3 pl-11 pr-12 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm sm:text-base"
            placeholder="Confirm Password"
            required
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            whileFocus={{ scale: 1.02 }}
          />
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
              <span>Update Password</span>
            </>
          )}
        </motion.button>

        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center"
          >
            <p className="text-green-400 text-xs sm:text-sm">{msg}</p>
          </motion.div>
        )}

        {err && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center"
          >
            <p className="text-red-400 text-xs sm:text-sm">{err}</p>
          </motion.div>
        )}
      </motion.form>

      <div className="absolute bottom-4 left-0 right-0 text-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex items-center justify-center gap-2 text-sky-400/40 text-xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Password encryption enabled</span>
          <Sparkles className="w-3 h-3" />
        </motion.div>
      </div>
    </div>
  )
} 
