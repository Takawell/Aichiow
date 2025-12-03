import useSWR from 'swr'
import { getHiAnimeInfo, matchAnimeToHiAnime, HiAnimeInfo } from '@/lib/consumet'
import { AnimeDetail } from '@/types/anime'

export function useHiAnimeEpisodes(anime: AnimeDetail | undefined) {
  const { data, error, isLoading } = useSWR<HiAnimeInfo | null>(
    anime ? ['HIANIME_EPISODES', anime.id] : null,
    async () => {
      if (!anime) return null

      const match = await matchAnimeToHiAnime(anime.title)
      if (!match) return null

      const info = await getHiAnimeInfo(match.id)
      return info
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, 
    }
  )

  return {
    hiAnimeData: data,
    episodes: data?.episodes || [],
    isLoading,
    isError: error,
    notFound: !isLoading && !data,
  }
}
