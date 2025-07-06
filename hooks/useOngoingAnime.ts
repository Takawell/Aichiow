// hooks/useOngoingAnime.ts
import { useQuery } from '@tanstack/react-query'
import { fetchOngoingAnime } from '@/lib/anilist'
import { Anime } from '@/types/anime'

export function useOngoingAnime() {
  return useQuery<Anime[]>({
    queryKey: ['ongoingAnime'],
    queryFn: fetchOngoingAnime,
  })
}
