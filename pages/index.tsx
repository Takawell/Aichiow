// pages/index.tsx
import Head from 'next/head'
import TrendingSection from '@/components/home/TrendingSection'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Aichiow — Anime Showcase</title>
      </Head>
      <main className="bg-dark min-h-screen">
        <TrendingSection />
      </main>
    </>
  )
}
