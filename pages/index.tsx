import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const router = useRouter()
  const [typedText, setTypedText] = useState('')
  const fullText =
    'A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader.'

  // Typing effect
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
      <main className="min-h-screen bg-black text-white px-6 py-12 flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-10 animate-fade-in">
          {/* Left Section */}
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-blue-500 drop-shadow-md animate-slide-up">
              Welcome to Aichiow!
            </h1>
            <h2 className="text-3xl sm:text-4xl font-extrabold animate-slide-up delay-100">
              Watch Trailers & Explore Anime
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto md:mx-0 text-sm sm:text-base animate-slide-up delay-300">
              {typedText}
              <span className="animate-blink">|</span>
            </p>

            <div className="pt-6 animate-slide-up delay-500">
              <button
                onClick={() => router.push('/home')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl transition-all hover:shadow-blue-500/50"
              >
                Let&apos;s Go →
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="rounded-xl overflow-hidden shadow-lg animate-slide-up delay-700">
            <Image
              src="/landing-visual.png"
              alt="Anime Visual"
              width={400}
              height={400}
              className="object-cover rounded-xl"
              priority
            />
          </div>
        </div>
      </main>

      {/* Animations */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in forwards;
        }
        .animate-slide-up {
          opacity: 0;
          transform: translateY(20px);
          animation: slideUp 0.7s ease-out forwards;
        }
        .animate-slide-up.delay-100 {
          animation-delay: 0.1s;
        }
        .animate-slide-up.delay-300 {
          animation-delay: 0.3s;
        }
        .animate-slide-up.delay-500 {
          animation-delay: 0.5s;
        }
        .animate-slide-up.delay-700 {
          animation-delay: 0.7s;
        }
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
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
