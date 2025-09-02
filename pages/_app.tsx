import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  const router = useRouter()

  const isLanding = router.pathname === '/'
  const isMaintenance = router.pathname === '/maintenance'

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!isLanding && !isMaintenance && <Navbar />}

      <main className="md:pb-0 pb-[calc(var(--bottom-nav,72px)+env(safe-area-inset-bottom))]">
        <Component {...pageProps} />
      </main>
    </QueryClientProvider>
  )
}
