'use client'

import React, { useEffect, useState, useRef } from 'react'
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
  const [showVerify, setShowVerify] = useState(false)
  const [verified, setVerified] = useState(false)
  const [verifyType, setVerifyType] = useState<'slider' | 'drag' | 'ai' | 'click' | null>(null)
  const [challengeKey, setChallengeKey] = useState(0)

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

  const pickRandom = () => {
    const types: Array<'slider' | 'drag' | 'ai' | 'click'> = ['slider', 'drag', 'ai', 'click']
    return types[Math.floor(Math.random() * types.length)]
  }

  const openVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setVerified(false)
    setVerifyType(pickRandom())
    setChallengeKey(prev => prev + 1)
    setShowVerify(true)
  }

  const onSubmitSignup = async () => {
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
    setMsg("Account created! Check your inbox for the verification link. Once confirmed, you'll be redirected automatically.")
  }

  useEffect(() => {
    if (verified) {
      setShowVerify(false)
      onSubmitSignup()
    }
  }, [verified])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 text-white">
      <motion.form
        onSubmit={openVerify}
        className="w-full max-w-md space-y-6 p-8 rounded-2xl bg-white/5 backdrop-blur-md shadow-xl border border-white/10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-3xl font-semibold text-center text-white">Create your Account</h1>

        <input
          className="w-full bg-white/5 text-white border border-white/10 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white transition"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <input
          className="w-full bg-white/5 text-white border border-white/10 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white transition"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            className="w-full bg-white/5 text-white border border-white/10 rounded-xl p-3 pr-12 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white transition"
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

        <p className="text-sm text-center text-white/70">Already have an account?{' '}
          <a className="underline text-blue-400 hover:text-blue-300 transition" href="/auth/login">Login</a>
        </p>
      </motion.form>

      {showVerify && verifyType && (
        <VerificationModal
          key={challengeKey}
          type={verifyType}
          onClose={() => setShowVerify(false)}
          onSuccess={() => setVerified(true)}
        />
      )}
    </div>
  )
}

function VerificationModal({ type, onClose, onSuccess }: { type: 'slider' | 'drag' | 'ai' | 'click'; onClose: () => void; onSuccess: () => void }) {
  const [sliderPos, setSliderPos] = useState(0)
  const targetRef = useRef<number>(50)
  const [sliderSuccess, setSliderSuccess] = useState(false)
  const dragRef = useRef<HTMLDivElement | null>(null)
  const dropRef = useRef<HTMLDivElement | null>(null)
  const [dragSuccess, setDragSuccess] = useState(false)
  const [aiA, setAiA] = useState(0)
  const [aiB, setAiB] = useState(0)
  const [aiInput, setAiInput] = useState('')
  const [aiSuccess, setAiSuccess] = useState(false)
  const [clickPos, setClickPos] = useState({ x: 50, y: 50 })
  const [clickCount, setClickCount] = useState(0)
  const [clickTimer, setClickTimer] = useState(10)

  useEffect(() => {
    if (type === 'slider') {
      targetRef.current = 20 + Math.floor(Math.random() * 60)
      setSliderPos(0)
      setSliderSuccess(false)
    }
    if (type === 'drag') {
      setDragSuccess(false)
    }
    if (type === 'ai') {
      const a = 2 + Math.floor(Math.random() * 8)
      const b = 2 + Math.floor(Math.random() * 8)
      setAiA(a)
      setAiB(b)
      setAiInput('')
      setAiSuccess(false)
    }
    if (type === 'click') {
      setClickCount(0)
      setClickTimer(10)
      positionClickTarget()
    }
  }, [type])

  useEffect(() => {
    let t: any
    if (type === 'click' && clickTimer > 0) {
      t = setTimeout(() => setClickTimer(clickTimer - 1), 1000)
    }
    if (clickTimer === 0 && clickCount < 3) setClickCount(-999)
    return () => clearTimeout(t)
  }, [clickTimer, clickCount, type])

  useEffect(() => {
    if (sliderSuccess || dragSuccess || aiSuccess || (clickCount >= 3 && clickTimer >= 0)) {
      onSuccess()
    }
  }, [sliderSuccess, dragSuccess, aiSuccess, clickCount])

  const handleSliderCheck = () => {
    const diff = Math.abs(sliderPos - (targetRef.current || 0))
    if (diff <= 6) setSliderSuccess(true)
  }

  const onPointerDownDrag = (e: React.PointerEvent) => {
    const el = dragRef.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    const startX = e.clientX
    const startY = e.clientY
    const rect = el.getBoundingClientRect()
    const offsetX = startX - rect.left
    const offsetY = startY - rect.top
    const onMove = (ev: PointerEvent) => {
      el.style.position = 'absolute'
      el.style.left = `${ev.clientX - offsetX}px`
      el.style.top = `${ev.clientY - offsetY}px`
    }
    const onUp = (ev: PointerEvent) => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      const drop = dropRef.current
      if (!drop) return
      const dRect = drop.getBoundingClientRect()
      const eRect = el.getBoundingClientRect()
      const cx = eRect.left + eRect.width / 2
      const cy = eRect.top + eRect.height / 2
      if (cx > dRect.left && cx < dRect.right && cy > dRect.top && cy < dRect.bottom) {
        setDragSuccess(true)
      } else {
        el.style.left = ''
        el.style.top = ''
        el.style.position = ''
      }
    }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }

  const handleAiSubmit = () => {
    if (parseInt(aiInput || '0') === aiA + aiB) setAiSuccess(true)
  }

  const positionClickTarget = () => {
    const x = 10 + Math.floor(Math.random() * 80)
    const y = 20 + Math.floor(Math.random() * 60)
    setClickPos({ x, y })
  }

  const handleClickTarget = () => {
    setClickCount(prev => prev + 1)
    positionClickTarget()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-b from-white/6 to-white/3 border border-white/10 rounded-3xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Human Verification</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/8">
              <p className="text-sm text-white/80">Complete the challenge shown to proceed. Type: <span className="font-semibold">{type.toUpperCase()}</span></p>
            </div>

            {type === 'slider' && (
              <div className="p-4 rounded-xl bg-white/4 border border-white/8">
                <div className="relative h-32 bg-white/3 rounded-lg overflow-hidden">
                  <img src="/default.png" className="absolute inset-0 w-full h-full object-cover" alt="p" />
                  <div style={{ left: `${sliderPos}%` }} className="absolute top-0 h-full w-28 transform -translate-x-1/2 rounded-md bg-black/50 backdrop-blur-sm border border-white/10" />
                </div>
                <input className="w-full mt-4" type="range" min={0} max={100} value={sliderPos} onChange={e => setSliderPos(Number(e.target.value))} />
                <div className="flex items-center justify-between text-sm text-white/70 mt-2">
                  <span>Move to match the hidden notch</span>
                  <button onClick={handleSliderCheck} className="px-3 py-1 rounded-md bg-green-500/80">Check</button>
                </div>
              </div>
            )}

            {type === 'drag' && (
              <div className="p-4 rounded-xl bg-white/4 border border-white/8">
                <div className="h-40 relative bg-white/3 rounded-lg flex items-center justify-center">
                  <div ref={dropRef} className="absolute right-6 top-6 w-28 h-28 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-sm text-white/70">Drop Here</div>
                  <div ref={dragRef} onPointerDown={onPointerDownDrag} className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg cursor-grab flex items-center justify-center">Drag</div>
                </div>
                <div className="mt-3 text-sm text-white/70">Drag the colored card into the drop zone</div>
              </div>
            )}

            {type === 'ai' && (
              <div className="p-4 rounded-xl bg-white/4 border border-white/8">
                <div className="text-white/80">Mini brain test</div>
                <div className="mt-2 p-3 bg-white/5 rounded-md">
                  <div className="text-lg font-semibold">{aiA} + {aiB} = ?</div>
                  <input value={aiInput} onChange={e => setAiInput(e.target.value)} className="mt-3 w-full rounded-md p-2 bg-white/6 text-white outline-none" />
                  <div className="flex gap-2 mt-3">
                    <button onClick={handleAiSubmit} className="px-4 py-2 rounded-md bg-green-500 font-semibold">Submit</button>
                    <button onClick={() => { setAiA(2 + Math.floor(Math.random() * 8)); setAiB(2 + Math.floor(Math.random() * 8)); setAiInput('') }} className="px-4 py-2 rounded-md bg-white/6">New</button>
                  </div>
                </div>
              </div>
            )}

            {type === 'click' && (
              <div className="p-4 rounded-xl bg-white/4 border border-white/8">
                <div className="text-white/80">Click the moving target 3 times within the time limit</div>
                <div className="relative mt-4 h-40 bg-white/3 rounded-lg overflow-hidden">
                  <div style={{ left: `${clickPos.x}%`, top: `${clickPos.y}%` }} onClick={handleClickTarget} className="absolute transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full shadow-xl cursor-pointer animate-pulse bg-gradient-to-br from-yellow-400 to-pink-500 flex items-center justify-center text-black font-bold">●</div>
                </div>
                <div className="flex items-center justify-between mt-3 text-sm text-white/70">
                  <div>Clicks: {clickCount > 0 ? clickCount : 0}/3</div>
                  <div>Time: {clickTimer > 0 ? clickTimer : 0}s</div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/8 h-full flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white">Why this check?</h4>
                <p className="text-sm text-white/70 mt-2">This helps keep bots out and secures your account. Complete the interactive task shown on the left.</p>
              </div>

              <div className="mt-4">
                <div className="flex gap-3">
                  <button onClick={onClose} className="flex-1 px-4 py-2 rounded-xl bg-white/6">Cancel</button>
                  <button onClick={() => { if (type === 'slider') handleSliderCheck(); if (type === 'drag' && dragSuccess) {} }} className="px-4 py-2 rounded-xl bg-white/6">Verify</button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/6 border border-white/8">
              <div className="text-sm text-white/70">Status</div>
              <div className="mt-3 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${sliderSuccess || dragSuccess || aiSuccess || (clickCount >= 3 && clickTimer >= 0) ? 'bg-green-400' : 'bg-yellow-400'}`} />
                <div className="text-sm text-white/80">{sliderSuccess || dragSuccess || aiSuccess || (clickCount >= 3 && clickTimer >= 0) ? 'Verified' : 'Awaiting action'}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/6 border border-white/8 text-sm text-white/70">
              If verification fails you can try again and a new challenge will be chosen.
              <div className="mt-3"><button onClick={() => { onClose(); }} className="underline">Close</button></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
