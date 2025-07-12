import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { useState } from 'react'

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
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-[#1e1e1e] text-white shadow-lg p-6 space-y-6 text-center border border-gray-700">
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-xl font-semibold">
          Checking your browser before accessing
        </h1>
        <p className="text-sm text-gray-400">
          This process is automatic. Your browser will redirect once verification is complete.
        </p>
        <button
          onClick={handleVerify}
          disabled={verifying}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded-md font-semibold text-white disabled:opacity-60"
        >
          {verifying ? 'Verifying...' : 'Verify I’m human'}
        </button>
        <p className="text-xs text-gray-500 pt-2">
          Aichiow Firewall • Browser Protection Enabled
        </p>
      </div>
    </div>
  )
}
