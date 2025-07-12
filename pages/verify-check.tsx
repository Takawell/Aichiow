import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { CheckCircle } from 'react-feather'

export default function VerifyCheck() {
  const router = useRouter()
  const [verified, setVerified] = useState(false)

  const handleVerify = () => {
    setVerified(true)
    Cookies.set('verified', 'true', { expires: 1 })

    setTimeout(() => {
      router.replace('/')
    }, 1600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0d0d] via-[#111] to-[#1a1a1a] px-4">
      <div className="max-w-md w-full bg-[#181818] text-white rounded-2xl shadow-2xl border border-neutral-800 p-8 text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-[6px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>

        <h1 className="text-2xl font-semibold">Aichiow Shield</h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          Please verify you're human to access Aichiow.
        </p>

        <div className="flex justify-center">
          {!verified ? (
            <div
              onClick={handleVerify}
              className="w-12 h-12 rounded-full border-2 border-gray-500 hover:border-blue-500 flex items-center justify-center cursor-pointer transition-colors duration-300"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-gray-500 group-hover:bg-blue-500 transition" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center transition-all duration-500">
              <CheckCircle size={24} className="text-white" />
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 pt-1">
          Protected by Aichiow Firewall • Anti-bot Active
        </p>
      </div>
    </div>
  )
}
