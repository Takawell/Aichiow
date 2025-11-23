'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ArrowRight, LogIn, UserPlus, Zap, Shield } from 'lucide-react'
import { FaGoogle, FaGithub, FaDiscord } from 'react-icons/fa'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function WelcomeAuthModal() {
  const router = useRouter()
  const [step, setStep] = useState<'welcome' | 'auth' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
      
      if (!session && !hasSeenWelcome) {
        setStep('welcome')
        localStorage.setItem('hasSeenWelcome', 'true')
      }
    }

    checkAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        handleClose()
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleClose = () => {
    setStep(null)
    setError(null)
  }
  
  const handleWelcomeNext = () => setStep('auth')

  const handleSocialAuth = async (provider: 'google' | 'github' | 'discord') => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setIsLoading(false)
    }
  }

  const handleNavigateAuth = (path: string) => {
    handleClose()
    router.push(path)
  }

  return (
    <AnimatePresence>
      {step && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-3xl p-4"
          onClick={handleClose}
        >
          {step === 'welcome' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="relative w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-gradient-to-br from-black via-sky-950/40 to-black border border-sky-500/30 rounded-3xl shadow-[0_0_100px_-10px_rgba(56,189,248,0.7)] text-white overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e908_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e908_1px,transparent_1px)] bg-[size:3rem_3rem]" />
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500" />

              <div className="absolute top-10 right-10 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

              <button
                onClick={handleClose}
                className="absolute top-5 right-5 p-3 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-full transition-all z-10 group backdrop-blur-sm"
              >
                <X className="w-5 h-5 text-sky-300 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="relative p-8 md:p-12 lg:p-16 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 180, 360] }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="inline-block mb-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full blur-2xl opacity-60 animate-pulse" />
                    <div className="relative bg-gradient-to-br from-sky-500 to-blue-600 p-6 rounded-full shadow-2xl shadow-sky-500/50">
                      <Sparkles className="w-14 h-14 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent leading-tight"
                >
                  WELCOME TO AICHIOW
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-sky-100/80 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                  Discover endless anime content with smart features and modern design. Your ultimate anime companion starts here.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-12 max-w-4xl mx-auto"
                >
                  <div className="group bg-gradient-to-br from-sky-500/10 to-blue-600/10 backdrop-blur-sm border border-sky-500/30 rounded-2xl p-6 hover:scale-105 hover:border-sky-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/20">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎬</div>
                    <h3 className="text-white font-bold text-lg mb-2">Vast Library</h3>
                    <p className="text-sky-200/70 text-sm">Thousands of anime titles at your fingertips</p>
                  </div>
                  <div className="group bg-gradient-to-br from-sky-500/10 to-blue-600/10 backdrop-blur-sm border border-sky-500/30 rounded-2xl p-6 hover:scale-105 hover:border-sky-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/20">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🤖</div>
                    <h3 className="text-white font-bold text-lg mb-2">Smart Tech</h3>
                    <p className="text-sky-200/70 text-sm">AI-powered recommendations & features</p>
                  </div>
                  <div className="group bg-gradient-to-br from-sky-500/10 to-blue-600/10 backdrop-blur-sm border border-sky-500/30 rounded-2xl p-6 hover:scale-105 hover:border-sky-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/20 sm:col-span-3 lg:col-span-1">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
                    <h3 className="text-white font-bold text-lg mb-2">Lightning Fast</h3>
                    <p className="text-sky-200/70 text-sm">Optimized for best performance</p>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={handleWelcomeNext}
                  className="group relative px-10 py-5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-black text-base sm:text-lg md:text-xl shadow-2xl shadow-sky-500/50 hover:shadow-sky-500/80 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative flex items-center gap-3">
                    Get Started
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'auth' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="relative w-full max-w-md md:max-w-lg lg:max-w-xl bg-gradient-to-br from-black via-slate-950 to-sky-950/50 border border-sky-500/30 rounded-3xl shadow-[0_0_100px_-10px_rgba(56,189,248,0.7)] text-white overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-500/15 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e908_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e908_1px,transparent_1px)] bg-[size:3rem_3rem]" />

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500" />

              <div className="absolute top-10 right-10 w-32 h-32 bg-sky-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

              <button
                onClick={handleClose}
                className="absolute top-5 right-5 p-3 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-full transition-all z-10 group backdrop-blur-sm"
              >
                <X className="w-5 h-5 text-sky-300 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="relative p-8 md:p-10 lg:p-12">
                <div className="text-center mb-10">
                  <div className="inline-block mb-5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full blur-xl opacity-60" />
                      <div className="relative bg-gradient-to-br from-sky-500 to-blue-600 p-4 rounded-full shadow-2xl shadow-sky-500/50">
                        <Shield className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent leading-tight">
                    Choose Your Path
                  </h2>
                  <p className="text-base sm:text-lg text-sky-200/70 max-w-md mx-auto">
                    Sign in to unlock all features or create a new account
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <motion.button
                    onClick={() => handleNavigateAuth('/auth/login')}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full py-5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-bold text-base sm:text-lg shadow-2xl shadow-sky-500/50 hover:shadow-sky-500/80 transition-all duration-300 overflow-hidden disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative flex items-center justify-center gap-3">
                      <LogIn className="w-5 h-5" />
                      Login with Email
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>

                  <motion.button
                    onClick={() => handleNavigateAuth('/auth/register')}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full py-5 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border-2 border-sky-500/40 text-white rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/30 transition-all duration-300 overflow-hidden disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative flex items-center justify-center gap-3">
                      <UserPlus className="w-5 h-5" />
                      Create New Account
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </div>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-sky-500/30" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-black/50 backdrop-blur-sm text-sky-300 font-medium">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <motion.button
                    onClick={() => handleSocialAuth('google')}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex flex-col items-center justify-center gap-3 py-5 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-sky-500/30 rounded-2xl hover:border-sky-400 hover:bg-sky-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/20 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 to-blue-600/0 group-hover:from-sky-500/10 group-hover:to-blue-600/10 rounded-2xl transition-all duration-300" />
                    <FaGoogle className="relative w-7 h-7 text-sky-400 group-hover:text-sky-300 group-hover:scale-110 transition-all" />
                    <span className="relative text-xs font-semibold text-sky-300 group-hover:text-white transition-colors">Google</span>
                  </motion.button>

                  <motion.button
                    onClick={() => handleSocialAuth('github')}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex flex-col items-center justify-center gap-3 py-5 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-sky-500/30 rounded-2xl hover:border-sky-400 hover:bg-sky-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/20 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 to-blue-600/0 group-hover:from-sky-500/10 group-hover:to-blue-600/10 rounded-2xl transition-all duration-300" />
                    <FaGithub className="relative w-7 h-7 text-sky-400 group-hover:text-sky-300 group-hover:scale-110 transition-all" />
                    <span className="relative text-xs font-semibold text-sky-300 group-hover:text-white transition-colors">GitHub</span>
                  </motion.button>

                  <motion.button
                    onClick={() => handleSocialAuth('discord')}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex flex-col items-center justify-center gap-3 py-5 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-sky-500/30 rounded-2xl hover:border-sky-400 hover:bg-sky-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/20 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 to-blue-600/0 group-hover:from-sky-500/10 group-hover:to-blue-600/10 rounded-2xl transition-all duration-300" />
                    <FaDiscord className="relative w-7 h-7 text-sky-400 group-hover:text-sky-300 group-hover:scale-110 transition-all" />
                    <span className="relative text-xs font-semibold text-sky-300 group-hover:text-white transition-colors">Discord</span>
                  </motion.button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm"
                  >
                    <p className="text-red-400 text-sm text-center font-medium">{error}</p>
                  </motion.div>
                )}

                <div className="mt-8 flex items-center justify-center gap-2 text-xs text-sky-200/60">
                  <Zap className="w-4 h-4 text-sky-400" />
                  <span>Secured with enterprise-grade encryption</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
