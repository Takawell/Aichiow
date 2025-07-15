import { useEffect, useState } from 'react'
import { Anime } from '@/types/anime'
import { fetchTrendingAnimePaginated } from '@/lib/anilist'

export function useExploreAnime() {
  const [anime, setAnime] = useState<Anime[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnime()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  async function loadAnime() {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const newAnime = await fetchTrendingAnimePaginated(page, 50)
      setAnime((prev) => [...prev, ...newAnime])
      if (newAnime.length < 50) {
        setHasMore(false)
      }
    } catch (err: any) {
      console.error('Failed to fetch explore anime:', err.message)
      setError('Failed to load more anime.')
    } finally {
      setLoading(false)
    }
  }

  function loadMore() {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1)
    }
  }

  return { anime, isLoading: loading, error, loadMore, hasMore }
}
