import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchAnimeByGenre } from '@/lib/anilist'
import { Anime } from '@/types/anime'

export function useAnimeByGenre() {
  const router = useRouter()
  const { name } = router.query

  const [anime, setAnime] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!name || typeof name !== 'string') return

    setLoading(true)
    fetchAnimeByGenre(name)
      .then(setAnime)
      .finally(() => setLoading(false))
  }, [name])

  return { anime, loading }
}
