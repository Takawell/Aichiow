// pages/_app.tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
// import UpdateModal from '@/components/shared/UpdateModal' // ❌ Sudah tidak dipakai

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      {/* UpdateModal tidak dipanggil di sini */}
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
