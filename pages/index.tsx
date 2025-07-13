// pages/index.tsx
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function LandingPage() {
  const router = useRouter()

  const handleEnter = () => {
    router.push('/home')
  }

  return (
    <>
      <Head>
        <title>Aichiow — Anime & Manga Platform</title>
        <meta name="description" content="A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-black to-zinc-900 text-white font-montserrat">
        <Image
          src="/logo.png"
          alt="Aichiow Logo"
          width={100}
          height={100}
          className="mb-4"
        />
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome to Aichiow</h1>
        <p className="text-sm md:text-lg text-zinc-300 max-w-xl mb-6">
          A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader.
        </p>

        <button
          onClick={handleEnter}
          className="bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white font-semibold px-6 py-3 rounded-full text-lg shadow-md"
        >
          Let&apos;s Go
        </button>
      </main>
    </>
  )
}
