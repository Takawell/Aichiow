import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Image from 'next/image'

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/home')
    }, 8000)
    return () => clearTimeout(timeout)
  }, [router])

  return (
    <>
      <Head>
        <title>Aichiow — Welcome</title>
        <meta name="description" content="A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader." />
        <meta name="viewport" content="width=1920" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className="w-screen h-screen relative overflow-hidden bg-black">
        {/* 🎞 Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/landing-bg.mp4" type="video/mp4" />
        </video>

        {/* 🔲 Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-10" />

        {/* 🎨 Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Aichiow Logo"
            width={160}
            height={160}
            className="animate-bounce-slow drop-shadow-lg mb-6"
          />
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-wide drop-shadow-xl mb-4">
            Welcome to <span className="text-purple-500">Aichiow</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-3xl text-slate-200 drop-shadow-md px-4 mb-10">
            A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader.
          </p>
          <button
            onClick={() => router.push('/home')}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-lg rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
          >
            Let&apos;s Go →
          </button>
        </div>
      </main>
    </>
  )
}
