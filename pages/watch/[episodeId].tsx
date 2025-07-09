// pages/watch/[episodeId].tsx

import { useRouter } from 'next/router'
import Head from 'next/head'
import { useEffect, useState } from 'react'

interface Source {
  url: string
  quality: string
  isM3U8: boolean
}

interface EpisodeInfo {
  headers: Record<string, string>
  sources: Source[]
  download: string
}

export default function WatchEpisodePage() {
  const router = useRouter()
  const { episodeId } = router.query

  const [episodeInfo, setEpisodeInfo] = useState<EpisodeInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!episodeId) return

    const fetchEpisode = async () => {
      setIsLoading(true)
      setError(false)

      try {
        const res = await fetch(`https://api.consumet.org/anime/gogoanime/watch/${episodeId}`)
        const data = await res.json()

        if (!data || !data.sources?.length) {
          setError(true)
          return
        }

        setEpisodeInfo(data)
      } catch (err) {
        console.error("Failed to fetch episode:", err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEpisode()
  }, [episodeId])

  return (
    <>
      <Head>
        <title>Nonton Episode {episodeId} | Aichiow</title>
      </Head>

      <main className="min-h-screen bg-black text-white p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Streaming Episode {episodeId}</h1>

        {isLoading && (
          <p className="text-center text-gray-300">Memuat video...</p>
        )}

        {error && (
          <p className="text-center text-red-500">Gagal memuat video. Silakan coba lagi.</p>
        )}

        {!isLoading && episodeInfo && (
          <div className="w-full max-w-5xl mx-auto">
            <video
              controls
              className="w-full aspect-video rounded-md"
              poster="/thumbnail.jpg"
            >
              {episodeInfo.sources.map((source, i) => (
                <source key={i} src={source.url} type={source.isM3U8 ? "application/x-mpegURL" : "video/mp4"} />
              ))}
              Your browser does not support the video tag.
            </video>

            <div className="mt-4 text-center">
              <a
                href={episodeInfo.download}
                className="inline-block px-4 py-2 bg-primary hover:bg-primary/80 rounded text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                ⬇️ Download Episode
              </a>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
