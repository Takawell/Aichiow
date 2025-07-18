import { useRouter } from 'next/router'
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function WatchEpisodePage() {
  const router = useRouter()
  const { episodeId, src } = router.query // src = URL episode dari Oploverz

  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!src) return

    const fetchStream = async () => {
      try {
        const res = await fetch(`/api/anime/video?url=${encodeURIComponent(src as string)}`)
        const data = await res.json()

        if (data?.videoUrl) {
          setVideoUrl(data.videoUrl)
        } else {
          setIsError(true)
        }
      } catch (err) {
        console.error('❌ Gagal memuat video:', err)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStream()
  }, [src])

  return (
    <>
      <Head>
        <title>Tonton Episode | Aichiow</title>
      </Head>
      <main className="bg-black min-h-screen flex flex-col items-center justify-center text-white px-4 py-8">
        {isLoading && <p className="text-white text-center">Memuat video...</p>}

        {isError && (
          <div className="text-center">
            <p className="text-red-500 mb-4">Gagal memuat video. Silakan coba lagi.</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg text-white"
            >
              🔙 Kembali
            </button>
          </div>
        )}

        {videoUrl && (
          <div className="w-full max-w-5xl aspect-video">
            <iframe
              src={videoUrl}
              allowFullScreen
              className="w-full h-full rounded-xl border-2 border-white"
            />
          </div>
        )}
      </main>
    </>
  )
}
