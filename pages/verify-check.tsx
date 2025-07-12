import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { useState } from 'react'

export default function VerifyCheck() {
  const router = useRouter()
  const [verifying, setVerifying] = useState(false)

  const handleVerify = () => {
    setVerifying(true)
    Cookies.set('verified', 'true', { expires: 1 }) // expires in 1 day
    setTimeout(() => {
      router.replace('/')
    }, 1000)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white px-4">
      <div className="text-center space-y-6 max-w-md w-full animate-fade-in">
        <h1 className="text-3xl font-bold">Checking your browser...</h1>
        <p className="text-sm text-gray-400">Please verify that you're human to continue to Aichiow.</p>

        <button
          onClick={handleVerify}
          disabled={verifying}
          className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded-lg text-white font-semibold disabled:opacity-60"
        >
          {verifying ? 'Verifying...' : '✔️ Verify Access'}
        </button>

        <p className="text-xs text-gray-600 pt-4">Protected by Aichiow Firewall</p>
      </div>
    </main>
  )
}
