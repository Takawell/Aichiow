'use client'
import { supabase } from '@/lib/supabaseClient'

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    location.href = '/auth/login'
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-xl border hover:bg-gray-100 transition"
    >
      Logout
    </button>
  )
}
