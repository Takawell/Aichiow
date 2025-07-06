// hooks/useSeasonalAnime.ts
import { useQuery } from '@tanstack/react-query'
import { fetchSeasonalAnime } from '@/lib/anilist'
import { Anime } from '@/types/anime'

export function useSeasonalAnime() {
  return useQuery<Anime[]>({
    queryKey: ['seasonalAnime'],
    queryFn: fetchSeasonalAnime,
  })
}
