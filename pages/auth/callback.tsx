'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data?.session) {
        router.replace('/profile')
      } else {
        router.replace('/auth/login')
      }
    }

    checkSession()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-6 px-10 py-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12 text-purple-400" />
        </motion.div>
        <h1 className="text-2xl font-semibold text-center">Finishing up...</h1>
        <p className="text-white/60 text-center max-w-sm">
          We’re securing your session and getting everything ready. You’ll be redirected in a moment 🚀
        </p>
      </motion.div>
    </div>
  )
}
