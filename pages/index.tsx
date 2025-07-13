// pages/index.tsx
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Aichiow — Watch Anime Free</title>
        <meta
          name="description"
          content="A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader."
        />
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="min-h-screen bg-[#0f0f0f] text-white font-['Montserrat'] flex flex-col items-center justify-center px-4">
        <Image
          src="/logo.png"
          alt="Aichiow Logo"
          width={100}
          height={100}
          className="mb-6"
        />

        <h1 className="text-3xl sm:text-5xl font-extrabold text-center mb-4">
          Welcome to Aichiow
        </h1>
        <p className="text-center text-white/70 max-w-xl text-base sm:text-lg mb-8">
          A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader.
        </p>

        <Link
          href="/home"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-all"
        >
          Let's Go
        </Link>
      </main>
    </>
  )
}
