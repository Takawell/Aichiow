import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const router = useRouter()
  const [typedText, setTypedText] = useState('')
  const fullText =
    'A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader.'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i))
      i++
      if (i > fullText.length) clearInterval(interval)
    }, 18)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head>
        <title>Aichiow — Discover Anime Universe</title>
      </Head>
      <main className="min-h-screen bg-black text-white px-6 py-16 flex items-center justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Teks Kiri */}
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-500 drop-shadow-md">
              Welcome to Aichiow!
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Watch Trailers & Explore Anime
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto md:mx-0">
              {typedText}
              <span className="animate-blink">|</span>
            </p>
            <div className="pt-4">
              <button
                onClick={() => router.push('/home')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-base sm:text-lg font-semibold shadow-md transition-all hover:shadow-blue-500/50"
              >
                Let&apos;s Go →
              </button>
            </div>
          </div>

          {/* Gambar Kanan */}
          <div className="flex justify-center">
            <Image
              src="/landing-visual.png"
              alt="Anime Visual"
              width={300}
              height={300}
              className="rounded-xl object-cover shadow-lg"
              priority
            />
          </div>
        </div>
      </main>

      {/* Animasi ketik & blink */}
      <style jsx global>{`
        .animate-blink {
          animation: blink 1s steps(1, start) infinite;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
