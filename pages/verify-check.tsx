import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

export default function VerifyCheck() {
  const router = useRouter()
  const [verifying, setVerifying] = useState(false)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    // Deteksi headless browser seperti Puppeteer / Selenium
    if (navigator.webdriver) {
      setBlocked(true)
      setTimeout(() => {
        router.replace('/403')
      }, 100)
    }
  }, [])

  const handleVerify = () => {
    setVerifying(true)
    Cookies.set('verified', 'true', { expires: 1 }) // 1 hari
    setTimeout(() => {
      router.replace('/')
    }, 1500)
  }

  if (blocked) return null

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1a1a1a] text-white rounded-xl shadow-xl p-6 text-center space-y-6 border border-gray-700 animate-fade-in">
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>

        <h1 className="text-xl font-bold">
          Checking your browser before accessing Aichiow
        </h1>
        <p className="text-sm text-gray-400">
          Please verify you're human to continue. This protects us from bots and scraping.
        </p>

        <button
          onClick={handleVerify}
          disabled={verifying}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded-md font-semibold text-white disabled:opacity-60"
        >
          {verifying ? 'Verifying...' : '✔️ Verify I’m human'}
        </button>

        <p className="text-xs text-gray-500 pt-4">Aichiow Firewall • Protected Access</p>
      </div>
    </div>
  )
}
