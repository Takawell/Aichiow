import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

export default function VerifyCheck() {
  const router = useRouter()
  const [verifying, setVerifying] = useState(false)

  const handleVerify = () => {
    setVerifying(true)
    Cookies.set('verified', 'true', { expires: 1 })
    setTimeout(() => {
      router.replace('/')
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] px-4">
      <div className="max-w-md w-full bg-[#1a1a1a] text-white rounded-2xl shadow-xl p-8 border border-gray-700 text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-[6px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>

        <h1 className="text-2xl font-bold">Aichiow Shield Verification</h1>
        <p className="text-gray-400 text-sm">
          We’re checking your browser before allowing access.<br />
          This helps us prevent automated bots and protect the site.
        </p>

        <button
          onClick={handleVerify}
          disabled={verifying}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 rounded-lg font-medium text-white disabled:opacity-60"
        >
          {verifying ? 'Verifying...' : '✔️ Verify I’m Human'}
        </button>

        <p className="text-xs text-gray-600 pt-2">Powered by Aichiow Firewall</p>
      </div>
    </div>
  )
}
