// hooks/useHeroAnime.ts
import { useQuery } from '@tanstack/react-query'
import { fetchTrendingAnime } from '@/lib/anilist'
import { Anime } from '@/types/anime'

export function useHeroAnime() {
  return useQuery<Anime[]>({
    queryKey: ['heroAnime'],
    queryFn: async () => {
      const data = await fetchTrendingAnime()
      return data.slice(0, 1) // hanya ambil satu untuk Hero
    },
  })
}
