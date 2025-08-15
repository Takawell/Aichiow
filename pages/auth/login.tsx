'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [session, setSession] = useState(null)

  // Cek session awal
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      console.log('Initial session:', data.session)
      setSession(data.session)
      if (data.session) {
        router.replace('/profile')
      }
    }
    checkSession()

    // Listen perubahan auth
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('Auth event:', _event, session)
        setSession(session)
        if (session) {
          router.replace('/profile')
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErr(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('Login result:', data)

    if (error) {
      setErr(error.message)
      setLoading(false)
      return
    }

    // Redirect manual kalo session langsung ada
    if (data.session) {
      router.replace('/profile')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 text-white">
      <motion.form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-6 p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/10"
      >
        <h1 className="text-3xl font-semibold text-center text-white">Welcome Back</h1>

        <motion.input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <motion.input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <motion.button disabled={loading} type="submit">
          {loading ? 'Logging in…' : 'Login'}
        </motion.button>

        {err && <p>{err}</p>}
      </motion.form>
    </div>
  )
}
