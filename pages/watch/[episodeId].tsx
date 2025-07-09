import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { fetchEpisodeSources } from "@/lib/consumet"
import ReactPlayer from "react-player"
import Head from "next/head"

export default function WatchPage() {
  const router = useRouter()
  const { episodeId } = router.query
  const [videoUrl, setVideoUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!episodeId || typeof episodeId !== "string") return

    const load = async () => {
      setLoading(true)
      const data = await fetchEpisodeSources(episodeId)
      if (!data || !data.sources || data.sources.length === 0) {
        setError(true)
      } else {
        const bestSource =
          data.sources.find((s: any) => s.quality === "1080p") ||
          data.sources.find((s: any) => s.quality === "720p") ||
          data.sources[0]

        setVideoUrl(bestSource?.url)
      }
      setLoading(false)
    }

    load()
  }, [episodeId])

  return (
    <>
      <Head>
        <title>Streaming {episodeId} - Aichiow</title>
      </Head>
      <div className="min-h-screen bg-background text-foreground p-4">
        <h1 className="text-2xl font-semibold mb-4 text-center">Streaming Episode</h1>

        {loading && <p className="text-center">Loading video...</p>}
        {error && <p className="text-center text-red-500">Gagal memuat video. Silakan coba lagi.</p>}

        {!loading && !error && videoUrl && (
          <div className="aspect-video max-w-5xl mx-auto rounded overflow-hidden">
            <ReactPlayer url={videoUrl} controls width="100%" height="100%" />
          </div>
        )}
      </div>
    </>
  )
}
