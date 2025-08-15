'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErr(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      setErr(error.message)
      return
    }

    router.replace('/profile')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 p-8 rounded-2xl shadow bg-white">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          className="w-full border rounded-xl p-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full border rounded-xl p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full rounded-xl p-3 bg-black text-white disabled:opacity-50"
          type="submit"
        >
          {loading ? 'Masuk…' : 'Login'}
        </button>

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <p className="text-sm text-center">
          Belum punya akun? <a className="underline text-blue-600" href="/auth/register">Daftar</a>
        </p>
      </form>
    </div>
  )
}
