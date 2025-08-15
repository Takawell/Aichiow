'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    setErr(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: username } },
    })

    setLoading(false)

    if (error) {
      setErr(error.message)
      return
    }

    if (data.session) {
      router.replace('/profile')
    } else {
      setMsg('Cek email untuk verifikasi, lalu login kembali.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 p-8 rounded-2xl shadow bg-white">
        <h1 className="text-2xl font-bold text-center">Daftar Akun</h1>

        <input
          className="w-full border rounded-xl p-3"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

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
          {loading ? 'Mendaftarkan…' : 'Daftar'}
        </button>

        {err && <p className="text-red-600 text-sm">{err}</p>}
        {msg && <p className="text-green-600 text-sm">{msg}</p>}

        <p className="text-sm text-center">
          Sudah punya akun? <a className="underline text-blue-600" href="/auth/login">Login</a>
        </p>
      </form>
    </div>
  )
}
