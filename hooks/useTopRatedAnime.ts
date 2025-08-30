import { useQuery } from '@tanstack/react-query'
import { fetchTopRatedAnime } from '@/lib/anilist'
import { Anime } from '@/types/anime'

export function useTopRatedAnime() {
  return useQuery<Anime[]>({
    queryKey: ['topRatedAnime'],
    queryFn: fetchTopRatedAnime,
  })
}
