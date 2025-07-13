import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/home')
    }, 6000)
    return () => clearTimeout(timeout)
  }, [router])

  return (
    <>
      <Head>
        <title>Aichiow — Welcome</title>
        <meta
          name="description"
          content="A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader."
        />
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden font-montserrat">
        {/* Background gradient animation */}
        <div className="absolute inset-0 animate-gradient bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-indigo-900 via-purple-900 to-indigo-900 blur-2xl opacity-30" />

        {/* Particles or blur background */}
        <div className="absolute inset-0 z-0 bg-black/70 backdrop-blur-md" />

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <div className="animate-fade-in-up duration-1000">
            <Image
              src="/logo.png"
              width={100}
              height={100}
              alt="Aichiow Logo"
              className="mx-auto mb-6 drop-shadow-lg animate-pulse"
            />
            <h1 className="text-white text-5xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
              Welcome to Aichiow
            </h1>
            <p className="text-slate-300 text-lg md:text-xl font-medium max-w-xl mx-auto mb-8">
              A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader.
            </p>
            <button
              onClick={() => router.push('/home')}
              className="px-8 py-3 text-lg rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition duration-300 hover:scale-105"
            >
              Let&apos;s Go →
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
