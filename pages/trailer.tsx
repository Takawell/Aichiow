// pages/trailer.tsx
import Head from 'next/head'
import TrailerGrid from '@/components/trailer/TrailerGrid'

export default function TrailerPage() {
  return (
    <>
      <Head>
        <title>Anime Trailers | Aichiow</title>
      </Head>
      <main className="bg-dark min-h-screen text-white">
        <TrailerGrid />
      </main>
    </>
  )
}
