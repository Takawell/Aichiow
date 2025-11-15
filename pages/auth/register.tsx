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
  const [verifyType, setVerifyType] = useState<'slider' | 'drag' | 'ai' | 'click' | 'shape' | 'color' | null>(null)
  const [challengeKey, setChallengeKey] = useState(0)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) router.replace('/profile')
    })
    return () => listener.subscription.unsubscribe()
  }, [router])

  const pickRandom = () => {
    const types: Array<'slider' | 'drag' | 'ai' | 'click' | 'shape' | 'color'> = ['slider', 'drag', 'ai', 'click', 'shape', 'color']
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
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { name: username } } })
    setLoading(false)
    if (error) return setErr(error.message)
    setMsg('Account created! Check your inbox for the verification link.')
  }

  useEffect(() => {
    if (verified) {
      setShowVerify(false)
      onSubmitSignup()
    }
  }, [verified])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 text-white">
      <motion.form onSubmit={openVerify} className="w-full max-w-md space-y-6 p-8 rounded-2xl bg-white/5 backdrop-blur-md shadow-xl border border-white/10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
        <h1 className="text-3xl font-semibold text-center text-white">Create your Account</h1>

        <input className="w-full bg-white/5 text-white border border-white/10 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white transition" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />

        <input className="w-full bg-white/5 text-white border border-white/10 rounded-xl p-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white transition" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />

        <div className="relative">
          <input className="w-full bg-white/5 text-white border border-white/10 rounded-xl p-3 pr-12 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white transition" type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-white/60 hover:text-white transition">{showPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
        </div>

        <motion.button disabled={loading} className="w-full rounded-xl p-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50" type="submit" whileTap={{ scale: 0.97 }}>{loading ? 'Registering…' : 'Register'}</motion.button>

        {err && <p className="text-red-400 text-sm text-center">{err}</p>}
        {msg && <p className="text-green-400 text-sm text-center">{msg}</p>}

        <p className="text-sm text-center text-white/70">Already have an account? <a className="underline text-blue-400 hover:text-blue-300 transition" href="/auth/login">Login</a></p>
      </motion.form>

      {showVerify && verifyType && <VerificationModal key={challengeKey} type={verifyType} onClose={() => setShowVerify(false)} onSuccess={() => setVerified(true)} />}
    </div>
  )
}

function VerificationModal({ type, onClose, onSuccess }: { type: 'slider' | 'drag' | 'ai' | 'click' | 'shape' | 'color'; onClose: () => void; onSuccess: () => void }) {
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
  const [shapeIndex, setShapeIndex] = useState(0)
  const [shapeTarget, setShapeTarget] = useState(0)
  const [shapeSuccess, setShapeSuccess] = useState(false)
  const [colorBoxes, setColorBoxes] = useState<string[]>([])
  const [colorTarget, setColorTarget] = useState('')
  const [colorSuccess, setColorSuccess] = useState(false)

  useEffect(() => {
    if (type === 'slider') {
      targetRef.current = 10 + Math.floor(Math.random() * 80)
      setSliderPos(0)
      setSliderSuccess(false)
    }
    if (type === 'drag') setDragSuccess(false)
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
      moveClickTarget()
    }
    if (type === 'shape') {
      const t = Math.floor(Math.random() * 4)
      setShapeTarget(t)
      setShapeIndex(-1)
      setShapeSuccess(false)
    }
    if (type === 'color') {
      const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
      const shuffled = [...colors].sort(() => Math.random() - 0.5)
      setColorBoxes(shuffled.slice(0, 4))
      setColorTarget(shuffled[Math.floor(Math.random() * 4)])
      setColorSuccess(false)
    }
  }, [type])

  useEffect(() => {
    let t: any
    if (type === 'click' && clickTimer > 0) t = setTimeout(() => setClickTimer(clickTimer - 1), 1000)
    if (clickTimer === 0 && clickCount < 3) setClickCount(-999)
    return () => clearTimeout(t)
  }, [clickTimer, clickCount, type])

  useEffect(() => {
    if (sliderSuccess || dragSuccess || aiSuccess || (clickCount >= 3 && clickTimer >= 0) || shapeSuccess || colorSuccess) onSuccess()
  }, [sliderSuccess, dragSuccess, aiSuccess, clickCount, shapeSuccess, colorSuccess])

  const checkSlider = () => {
    if (Math.abs(sliderPos - (targetRef.current || 0)) <= 5) setSliderSuccess(true)
  }

  const dragDown = (e: React.PointerEvent) => {
    const el = dragRef.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    const startX = e.clientX
    const startY = e.clientY
    const rect = el.getBoundingClientRect()
    const offsetX = startX - rect.left
    const offsetY = startY - rect.top
    const move = (ev: PointerEvent) => {
      el.style.position = 'absolute'
      el.style.left = ev.clientX - offsetX + 'px'
      el.style.top = ev.clientY - offsetY + 'px'
    }
    const up = (ev: PointerEvent) => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
      const drop = dropRef.current
      if (!drop) return
      const d = drop.getBoundingClientRect()
      const eRect = el.getBoundingClientRect()
      const cx = eRect.left + eRect.width / 2
      const cy = eRect.top + eRect.height / 2
      if (cx > d.left && cx < d.right && cy > d.top && cy < d.bottom) setDragSuccess(true)
      else {
        el.style.position = ''
        el.style.left = ''
        el.style.top = ''
      }
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
  }

  const submitAI = () => {
    if (parseInt(aiInput || '0') === aiA + aiB) setAiSuccess(true)
  }

  const moveClickTarget = () => {
    const x = 10 + Math.floor(Math.random() * 80)
    const y = 10 + Math.floor(Math.random() * 70)
    setClickPos({ x, y })
  }

  const clickTarget = () => {
    setClickCount(prev => prev + 1)
    moveClickTarget()
  }

  const clickShape = (i: number) => {
    if (i === shapeTarget) setShapeSuccess(true)
  }

  const clickColor = (c: string) => {
    if (c === colorTarget) setColorSuccess(true)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-3xl w-full max-w-lg p-6 md:max-w-2xl">

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Human Verification</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-4">

            {type === 'slider' && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="h-32 bg-white/10 rounded-lg relative overflow-hidden">
                  <div style={{ left: sliderPos + '%' }} className="absolute top-0 h-full w-24 bg-black/40 backdrop-blur-sm border border-white/10 rounded-md -translate-x-1/2" />
                </div>
                <input type="range" min={0} max={100} value={sliderPos} onChange={e => setSliderPos(parseInt(e.target.value))} className="w-full mt-4" />
                <button onClick={checkSlider} className="mt-3 w-full p-2 rounded-lg bg-green-500">Check</button>
              </div>
            )}

            {type === 'drag' && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="h-40 bg-white/10 rounded-lg relative overflow-hidden">
                  <div ref={dropRef} className="absolute right-4 top-4 w-24 h-24 border-2 border-dashed border-white/40 rounded-lg flex items-center justify-center">Drop</div>
                  <div ref={dragRef} onPointerDown={dragDown} className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center cursor-grab">Drag</div>
                </div>
              </div>
            )}

            {type === 'ai' && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-lg text-white font-semibold">{aiA} + {aiB} = ?</div>
                <input value={aiInput} onChange={e => setAiInput(e.target.value)} className="w-full mt-4 p-2 bg-white/10 rounded-lg text-white" />
                <button onClick={submitAI} className="mt-3 w-full p-2 rounded-lg bg-blue-500">Submit</button>
              </div>
            )}

            {type === 'click' && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="relative h-40 bg-white/10 rounded-lg overflow-hidden">
                  <div style={{ left: clickPos.x + '%', top: clickPos.y + '%' }} onClick={clickTarget} className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 flex items-center justify-center cursor-pointer -translate-x-1/2 -translate-y-1/2">●</div>
                </div>
              </div>
            )}

            {type === 'shape' && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-white mb-3">Select the highlighted shape</div>
                <div className="grid grid-cols-4 gap-3">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} onClick={() => clickShape(i)} className={`h-16 flex items-center justify-center rounded-lg cursor-pointer ${i === shapeTarget ? 'bg-purple-500' : 'bg-white/10'}`}>{['▲','■','●','◆'][i]}</div>
                  ))}
                </div>
              </div>
            )}

            {type === 'color' && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-white mb-3">Tap the box with color: {colorTarget}</div>
                <div className="grid grid-cols-4 gap-3">
                  {colorBoxes.map(c => (
                    <div key={c} onClick={() => clickColor(c)} className="h-16 rounded-lg" style={{ background: c }}></div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="text-white text-sm">Status</div>
              <div className="mt-3 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${sliderSuccess || dragSuccess || aiSuccess || (clickCount >= 3 && clickTimer >= 0) || shapeSuccess || colorSuccess ? 'bg-green-400' : 'bg-yellow-400'}`} />
                <div className="text-white text-sm">{sliderSuccess || dragSuccess || aiSuccess || (clickCount >= 3 && clickTimer >= 0) || shapeSuccess || colorSuccess ? 'Verified' : 'Awaiting action'}</div>
              </div>
            </div>

            <button onClick={onClose} className="w-full p-3 rounded-xl bg-white/10 text-white">Close</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
