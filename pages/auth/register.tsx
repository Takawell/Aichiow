'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Shield, CheckCircle2, XCircle, Sparkles, Zap, Target } from 'lucide-react'

function VerificationModal({ isOpen, onVerified, onClose }: any) {
  const [stage, setStage] = useState<'challenge' | 'verifying' | 'success' | 'failed'>('challenge')
  const [challengeType, setChallengeType] = useState<'pattern' | 'slider' | 'math'>('pattern')
  const [progress, setProgress] = useState(0)
  
  const [pattern, setPattern] = useState<number[]>([])
  const [displayNumbers, setDisplayNumbers] = useState<number[]>([])
  const [patternCount, setPatternCount] = useState(4)
  const [isAscending, setIsAscending] = useState(true)
  
  const [sliderValue, setSliderValue] = useState(0)
  const [sliderStartX, setSliderStartX] = useState(0)
  
  const [mathAnswer, setMathAnswer] = useState('')
  const [mathQuestion, setMathQuestion] = useState({ num1: 0, num2: 0, answer: 0 })

  const generatePattern = () => {
    const numbers = Array.from({ length: 8 }, (_, i) => i + 1)
    const shuffled = numbers.sort(() => Math.random() - 0.5)
    setDisplayNumbers(shuffled)
    
    const count = Math.floor(Math.random() * 3) + 3
    setPatternCount(count)
    
    const ascending = Math.random() > 0.5
    setIsAscending(ascending)
  }

  const generateMath = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    const operations = ['+', '-', '×']
    const operation = operations[Math.floor(Math.random() * operations.length)]
    
    let answer = 0
    if (operation === '+') answer = num1 + num2
    else if (operation === '-') answer = num1 - num2
    else answer = num1 * num2    
    setMathQuestion({ num1, num2, answer })
  }

  useEffect(() => {
    if (isOpen) {
      setStage('challenge')
      setPattern([])
      setSliderValue(0)
      setMathAnswer('')
      
      const types: ('pattern' | 'slider' | 'math')[] = ['pattern', 'slider', 'math']
      const selectedType = types[Math.floor(Math.random() * types.length)]
      setChallengeType(selectedType)
      
      if (selectedType === 'pattern') {
        generatePattern()
      } else if (selectedType === 'math') {
        generateMath()
      }
    }
  }, [isOpen])

  const handlePatternClick = (num: number) => {
    if (pattern.includes(num)) return
    
    const newPattern = [...pattern, num]
    setPattern(newPattern)
    
    if (newPattern.length === patternCount) {
      const sortedPattern = [...newPattern].sort((a, b) => isAscending ? a - b : b - a)
      const isCorrect = JSON.stringify(newPattern) === JSON.stringify(sortedPattern)
      verifyChallenge(isCorrect)
    }
  }

  const handleSliderDragStart = (e: any) => {
    setSliderStartX(e.clientX || e.touches?.[0]?.clientX || 0)
  }

  const handleSliderDrag = (e: any) => {
    const currentX = e.clientX || e.touches?.[0]?.clientX || 0
    const container = e.currentTarget.parentElement
    if (!container) return
    
    const rect = container.getBoundingClientRect()
    const maxWidth = rect.width - 60
    const newValue = Math.max(0, Math.min(100, ((currentX - rect.left - 30) / maxWidth) * 100))
    setSliderValue(newValue)
  }

  const handleSliderEnd = () => {
    if (sliderValue >= 95) {
      verifyChallenge(true)
    } else {
      setSliderValue(0)
    }
  }

  const handleMathSubmit = () => {
    const userAnswer = parseInt(mathAnswer)
    verifyChallenge(userAnswer === mathQuestion.answer)
  }

  const verifyChallenge = (success: boolean) => {
    setStage('verifying')
    setProgress(0)
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setStage(success ? 'success' : 'failed')
          
          if (success) {
            setTimeout(() => {
              onVerified()
            }, 1500)
          } else {
            setTimeout(() => {
              setStage('challenge')
              setPattern([])
              setSliderValue(0)
              setMathAnswer('')
              if (challengeType === 'pattern') generatePattern()
              else if (challengeType === 'math') generateMath()
            }, 2000)
          }
          return 100
        }
        return prev + 10
      })
    }, 50)
  }

  if (!isOpen) return null

  const getOperationSymbol = () => {
    if (mathQuestion.num1 + mathQuestion.num2 === mathQuestion.answer) return '+'
    if (mathQuestion.num1 - mathQuestion.num2 === mathQuestion.answer) return '-'
    return '×'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget && stage !== 'verifying') {
            onClose()
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-slate-950 via-sky-950 to-black rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-sky-500/30"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: stage === 'verifying' ? 360 : 0 }}
              transition={{ duration: 2, repeat: stage === 'verifying' ? Infinity : 0, ease: 'linear' }}
            >
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-sky-400" />
            </motion.div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">
            Security Verification
          </h2>
          <p className="text-sky-300 text-center text-xs sm:text-sm mb-6">
            Complete the challenge to prove you're human
          </p>

          {stage === 'challenge' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {challengeType === 'pattern' && (
                <div>
                  <p className="text-white/80 text-xs sm:text-sm mb-4 text-center">
                    Click numbers from{' '}
                    <span className="text-sky-400 font-bold">
                      {isAscending ? 'smallest to largest' : 'largest to smallest'}
                    </span>
                  </p>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {displayNumbers.map((num, i) => (
                      <motion.button
                        key={i}
                        onClick={() => handlePatternClick(num)}
                        disabled={pattern.includes(num)}
                        whileHover={{ scale: pattern.includes(num) ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`aspect-square rounded-xl flex items-center justify-center text-base sm:text-lg font-bold transition-all ${
                          pattern.includes(num)
                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/50'
                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }`}
                      >
                        {num}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: patternCount }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < pattern.length ? 'bg-sky-400' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  {pattern.length > 0 && (
                    <p className="text-white/60 text-xs text-center mt-3">
                      Selected: {pattern.join(' → ')}
                    </p>
                  )}
                </div>
              )}

              {challengeType === 'slider' && (
                <div>
                  <p className="text-white/80 text-xs sm:text-sm mb-4 text-center">
                    Slide to unlock
                  </p>
                  <div className="relative bg-white/10 rounded-full p-1 h-14 sm:h-16 touch-none">
                    <motion.div
                      onMouseDown={handleSliderDragStart}
                      onTouchStart={handleSliderDragStart}
                      onMouseMove={handleSliderDrag}
                      onTouchMove={handleSliderDrag}
                      onMouseUp={handleSliderEnd}
                      onTouchEnd={handleSliderEnd}
                      className="absolute left-1 top-1 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center shadow-lg shadow-sky-500/50"
                      style={{ left: `${sliderValue * 0.01 * (100 - 15)}%` }}
                    >
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-white/60 text-xs sm:text-sm font-medium">
                        {sliderValue >= 95 ? 'Release!' : 'Slide →'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {challengeType === 'math' && (
                <div className="space-y-4">
                  <p className="text-white/80 text-xs sm:text-sm text-center">
                    Solve the math problem
                  </p>
                  <div className="bg-white/5 rounded-2xl p-6 text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                      <span>{mathQuestion.num1}</span>
                      <span className="text-sky-400">{getOperationSymbol()}</span>
                      <span>{mathQuestion.num2}</span>
                      <span className="text-sky-400">=</span>
                      <span className="text-sky-400">?</span>
                    </div>
                    <input
                      type="number"
                      value={mathAnswer}
                      onChange={(e) => setMathAnswer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleMathSubmit()
                      }}
                      placeholder="Answer"
                      className="w-full bg-white/10 text-white text-center text-xl sm:text-2xl border border-sky-500/30 rounded-xl p-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                      autoFocus
                    />
                  </div>
                  <motion.button
                    onClick={handleMathSubmit}
                    disabled={!mathAnswer}
                    whileTap={{ scale: 0.97 }}
                    className="w-full rounded-xl p-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-lg shadow-sky-500/30 hover:opacity-90 transition disabled:opacity-50"
                  >
                    Submit Answer
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {stage === 'verifying' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-sky-400" />
                </motion.div>
              </div>
              <p className="text-white text-center font-medium text-sm sm:text-base">Verifying...</p>
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-500 to-blue-600"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          )}

          {stage === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-400 mx-auto" />
              </motion.div>
              <p className="text-white text-lg sm:text-xl font-bold">Verified!</p>
              <p className="text-green-300 text-xs sm:text-sm">Creating your account...</p>
            </motion.div>
          )}

          {stage === 'failed' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-400 mx-auto" />
              </motion.div>
              <p className="text-white text-lg sm:text-xl font-bold">Verification Failed</p>
              <p className="text-red-300 text-xs sm:text-sm">Try again...</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)
  const [showVerification, setShowVerification] = useState(false)

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowVerification(true)
  }

  const handleVerificationSuccess = async () => {
    setShowVerification(false)
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

  const handleVerificationClose = () => {
    setShowVerification(false)
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
        onSubmit={handleFormSubmit}
        className="w-full max-w-md space-y-5 sm:space-y-6 p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-md shadow-xl border border-sky-500/20 relative z-10"
        initial={{ opacity: 0, y: 30 }}
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
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-sky-400 mx-auto mb-2" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Create your Account
          </h1>
          <p className="text-sky-300 text-xs sm:text-sm">Join us with secure verification</p>
        </div>

        <motion.input
          className="w-full bg-white/5 text-white border border-sky-500/30 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm sm:text-base"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          whileFocus={{ scale: 1.02 }}
        />

        <motion.input
          className="w-full bg-white/5 text-white border border-sky-500/30 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm sm:text-base"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          whileFocus={{ scale: 1.02 }}
        />

        <div className="relative">
          <motion.input
            className="w-full bg-white/5 text-white border border-sky-500/30 rounded-xl p-3 pr-12 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm sm:text-base"
            type={showPass ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
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
          className="w-full rounded-xl p-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-base"
          type="submit"
          whileTap={{ scale: 0.97 }}
        >
          {loading ? 'Registering…' : 'Register'}
        </motion.button>

        {err && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs sm:text-sm text-center"
          >
            {err}
          </motion.p>
        )}
        {msg && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-400 text-xs sm:text-sm text-center"
          >
            {msg}
          </motion.p>
        )}

        <p className="text-xs sm:text-sm text-center text-white/70">
          Already have an account?{' '}
          <a
            className="underline text-sky-400 hover:text-sky-300 transition"
            href="/auth/login"
          >
            Login
          </a>
        </p>
      </motion.form>

      <VerificationModal
        isOpen={showVerification}
        onVerified={handleVerificationSuccess}
        onClose={handleVerificationClose}
      />
    </div>
  )
}
