import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

export default function VerifyCheck() {
  const router = useRouter()

  useEffect(() => {
    // Set cookie supaya lolos middleware
    Cookies.set('verified', 'true', { expires: 1 })

    // Redirect otomatis setelah 5 detik
    const timeout = setTimeout(() => {
      router.replace('/')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#141414] px-4">
      <div className="max-w-md w-full bg-[#1b1b1b] text-white rounded-2xl shadow-xl p-8 border border-neutral-800 text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-[6px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>

        <h1 className="text-xl font-bold">Verifying your browser...</h1>
        <p className="text-sm text-gray-400">
          Please wait while we confirm you're not a bot.<br />
          You will be redirected shortly.
        </p>

        <p className="text-xs text-gray-600 pt-4">Aichiow Firewall • Anti-Bot Active</p>
      </div>
    </div>
  )
}
