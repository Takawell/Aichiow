import { useQuery } from '@tanstack/react-query'
import { fetchTopRatedAnime } from '@/lib/anilist'
import { Anime } from '@/types/anime'

interface UseTopRatedAnimeOptions {
  page?: number
  perPage?: number
  sort?: string[] 
}

export function useTopRatedAnime({
  page = 1,
  perPage = 10,
  sort = ['SCORE_DESC'],
}: UseTopRatedAnimeOptions = {}) {
  return useQuery<Anime[]>({
    queryKey: ['topRatedAnime', page, perPage, sort],
    queryFn: () => fetchTopRatedAnime(page, perPage, sort),
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
  })
}
