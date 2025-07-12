import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

export default function VerifyCheck() {
  const router = useRouter()

  useEffect(() => {
    Cookies.set('verified', 'true', { expires: 1 })
    const timeout = setTimeout(() => {
      router.replace('/')
    }, 2500)
    return () => clearTimeout(timeout)
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white px-4">
      <div className="max-w-md w-full text-center space-y-5 animate-fade-in">
        <div className="text-4xl font-extrabold tracking-tight">
          Checking your browser...
        </div>
        <p className="text-sm text-gray-400">
          Just a moment while we verify you're a real human.
        </p>
        <div className="w-16 h-16 mx-auto border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
        <p className="text-xs text-gray-600">Powered by Aichiow Shield</p>
      </div>
    </main>
  )
}
