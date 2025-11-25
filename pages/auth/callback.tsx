'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2, XCircle, ArrowLeft, User } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('loading')
  const [lastPage, setLastPage] = useState('/')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('lastPage') || localStorage.getItem('lastPage') || '/'
      setLastPage(stored)
    }

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) throw error

        if (data?.session) {
          setStatus('success')
        } else {
          setStatus('error')
          setTimeout(() => router.replace('/auth/login'), 3000)
        }
      } catch (err) {
        setStatus('error')
        setTimeout(() => router.replace('/auth/login'), 3000)
      }
    }

    checkSession()
  }, [router])

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwYjk1ZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTQtMS43OS00LTQtNC00IDEuNzktNCA0em0wIDI4YzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTQtMS43OS00LTQtNC00IDEuNzktNCA0ek0xNiAzNmMwIDIuMjEgMS43OSA0IDQgNHM0LTEuNzkgNC00LTEuNzktNC00LTQtNCAxLjc5LTQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <AnimatePresence mode="wait">
        {status === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            <motion.div
              className="bg-gradient-to-br from-slate-900/80 via-blue-950/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-sky-500/20 shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex flex-col items-center space-y-6">
                <motion.div
                  className="relative w-24 h-24"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-sky-500/30"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-2 rounded-full border-4 border-blue-400/50"
                    animate={{ 
                      scale: [1.2, 1, 1.2],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <Loader2 className="w-24 h-24 text-sky-400 absolute inset-0" />
                </motion.div>

                <div className="text-center space-y-3">
                  <motion.h1
                    className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-400 via-blue-400 to-sky-500 bg-clip-text text-transparent"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Authenticating
                  </motion.h1>
                  <p className="text-slate-300 text-sm md:text-base">
                    Securing your session and verifying credentials...
                  </p>
                </div>

                <div className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-sky-400"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            <motion.div
              className="bg-gradient-to-br from-slate-900/90 via-blue-950/90 to-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-sky-500/30 shadow-2xl"
              initial={{ boxShadow: "0 0 0 0 rgba(14, 165, 233, 0)" }}
              animate={{ boxShadow: "0 0 60px 10px rgba(14, 165, 233, 0.3)" }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <motion.div
                    className="relative"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-sky-500/30 rounded-full blur-xl"></div>
                    <CheckCircle2 className="w-24 h-24 text-sky-400 relative z-10" strokeWidth={2.5} />
                  </motion.div>
                </motion.div>

                <div className="text-center space-y-3">
                  <motion.h1
                    className="text-3xl md:text-4xl font-bold text-white"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Login Successful!
                  </motion.h1>
                  <motion.p
                    className="text-slate-300 text-sm md:text-base"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Your session is secured and ready to go
                  </motion.p>
                </div>

                <motion.div
                  className="w-full space-y-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    onClick={() => handleNavigation('/profile')}
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-sky-500/30"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(14, 165, 233, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <User className="w-5 h-5" />
                    Go to Profile
                  </motion.button>

                  <motion.button
                    onClick={() => handleNavigation(lastPage)}
                    className="w-full bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 border border-slate-700/50"
                    whileHover={{ scale: 1.02, borderColor: "rgba(148, 163, 184, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Return to Previous Page
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            <motion.div
              className="bg-gradient-to-br from-slate-900/90 via-red-950/30 to-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-red-500/30 shadow-2xl"
              initial={{ boxShadow: "0 0 0 0 rgba(239, 68, 68, 0)" }}
              animate={{ boxShadow: "0 0 60px 10px rgba(239, 68, 68, 0.2)" }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                    <XCircle className="w-24 h-24 text-red-400 relative z-10" strokeWidth={2.5} />
                  </motion.div>
                </motion.div>

                <div className="text-center space-y-3">
                  <motion.h1
                    className="text-3xl md:text-4xl font-bold text-white"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Authentication Failed
                  </motion.h1>
                  <motion.p
                    className="text-slate-300 text-sm md:text-base"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Redirecting you to login page...
                  </motion.p>
                </div>

                <motion.div
                  className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-red-600"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 md:w-2 md:h-2 rounded-full bg-sky-400/40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}
