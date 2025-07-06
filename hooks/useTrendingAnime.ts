// hooks/useTrendingAnime.ts
import { useQuery } from '@tanstack/react-query'
import { fetchTrendingAnime } from '@/lib/anilist'
import { Anime } from '@/types/anime'

export function useTrendingAnime() {
  return useQuery<Anime[]>({
    queryKey: ['trendingAnime'],
    queryFn: fetchTrendingAnime,
  })
}
