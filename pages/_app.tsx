import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '@/lib/supabaseClient'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  const router = useRouter()
  const isLanding = router.pathname === '/'

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.replace('/profile') // redirect setelah login
      } else if (event === 'SIGNED_OUT') {
        router.replace('/auth/login') // redirect setelah logout
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!isLanding && <Navbar />}
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
