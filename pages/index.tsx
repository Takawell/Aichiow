// pages/index.tsx
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function LandingPage() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Aichiow — Watch Anime & Manga</title>
        <meta
          name="description"
          content="A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader."
        />
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;600;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main
        className="relative flex items-center justify-center min-h-screen text-white bg-black font-[Montserrat]"
        style={{ backgroundImage: 'url(/landing-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <Image src="/logo.png" alt="Aichiow Logo" width={160} height={160} className="mb-6 rounded-full" />

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Welcome to Aichiow</h1>

          <p className="text-lg md:text-xl max-w-2xl text-gray-300 mb-6">
            A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader.
          </p>

          <button
            onClick={() => router.push('/home')}
            className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold px-6 py-3 rounded-xl shadow-lg transition-all"
          >
            Let&apos;s Go
          </button>
        </div>
      </main>
    </>
  )
}
