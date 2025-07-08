// hooks/useAnimeByGenre.ts
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchAnimeByGenre } from '@/lib/api'
import { Anime } from '@/types/anime'

export function useAnimeByGenre() {
  const router = useRouter()
  const { name } = router.query

  const [anime, setAnime] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!name || typeof name !== 'string') return

    const fetchData = async () => {
      setLoading(true)
      const data = await fetchAnimeByGenre(name.toLowerCase())
      setAnime(data)
      setLoading(false)
    }

    fetchData()
  }, [name])

  return { anime, loading }
}
