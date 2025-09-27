'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const controls = useAnimation()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data?.session) {
        setTimeout(() => router.replace('/profile'), 1500)
      } else {
        setTimeout(() => router.replace('/auth/login'), 1500)
      }
    }

    checkSession()
  }, [router])

  const particleVariants = {
    float: {
      y: [0, -30, 0],
      x: [0, 20, -20, 0],
      opacity: [0.3, 0.8, 0.3],
      scale: [0.8, 1.2, 0.8],
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 text-white relative overflow-hidden">
      <motion.div
        className="absolute -top-60 -left-60 w-96 h-96 bg-blue-400/40 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-60 -right-60 w-96 h-96 bg-sky-400/40 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 9, repeat: Infinity }}
      />

      <AnimatePresence>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-white/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={particleVariants.float}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatType: 'mirror',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-6 px-12 py-14 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-[0_0_50px_rgba(0,255,255,0.3)] transition-shadow duration-700"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="relative w-20 h-20 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-300/40"
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          />
          <Loader2 className="w-12 h-12 text-blue-500 z-10" />
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-center text-blue-900"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Finalizing Login...
        </motion.h1>

        <motion.p
          className="text-center text-blue-800/80 max-w-md text-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          We’re securing your session and getting everything ready. You’ll be redirected shortly 🚀
        </motion.p>

        <motion.div className="w-full h-2 bg-blue-200/30 rounded-full overflow-hidden mt-4">
          <motion.div
            className="h-2 bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-blue-400/40 pointer-events-none"
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.02, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-200/20 via-sky-300/20 to-blue-400/10 pointer-events-none"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
      />
    </div>
  )
}
