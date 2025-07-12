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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] px-4">
      <div className="max-w-md w-full bg-[#1a1a1a] text-white rounded-2xl shadow-xl border border-neutral-800 p-8 text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-[6px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight">Aichiow Shield</h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          Verifying your browser before allowing access.  
          This helps us prevent bots and malicious activity.
        </p>

        <div
          onClick={handleVerify}
          className={`group relative cursor-pointer inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300
            shadow-md hover:shadow-blue-700/50 font-medium text-white text-base ${
              verifying && 'pointer-events-none opacity-60'
            }`}
        >
          {verifying ? 'Verifying...' : '✔️ Verify I’m Human'}
          <span className="absolute inset-0 rounded-lg ring-1 ring-white/10 group-hover:ring-blue-400 transition" />
        </div>

        <p className="text-xs text-gray-500">Powered by Aichiow Firewall</p>
      </div>
    </div>
  )
}
