'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { Mail, Loader2, Sparkles, ArrowLeft, Shield } from 'lucide-react'
import Image from 'next/image'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErr(null)
    setMsg(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
    })

    if (error) setErr(error.message)
    else setMsg('Password reset link sent to your email.')

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
            <Shield className="w-14 h-14 sm:w-16 sm:h-16 text-sky-400 mx-auto opacity-90" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Reset Password
          </h1>

          <p className="text-sky-300 text-xs sm:text-sm">
            Enter your email to receive a reset link.
          </p>
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400/60" />
          <motion.input
            className="w-full bg-white/5 text-white border border-sky-500/30 rounded-xl p-3 pl-11 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm sm:text-base"
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
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
              <span>Send Reset Link</span>
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

        <a
          href="/auth/login"
          className="flex items-center justify-center gap-2 text-sky-400/60 hover:text-sky-400 transition text-xs sm:text-sm pt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </a>
      </motion.form>

      <div className="absolute bottom-4 left-0 right-0 text-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex items-center justify-center gap-2 text-sky-400/40 text-xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Reset securely with encrypted verification</span>
          <Sparkles className="w-3 h-3" />
        </motion.div>
      </div>
    </div>
  )
}
