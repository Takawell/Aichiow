import '@/styles/globals.css'
import "@/styles/Aichixia.css";
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  const router = useRouter()

  const isLanding = router.pathname === '/'

  return (
    <QueryClientProvider client={queryClient}>
      {!isLanding && <Navbar />}
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
