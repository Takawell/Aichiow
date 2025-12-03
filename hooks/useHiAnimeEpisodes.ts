import useSWR from 'swr'
import { getHiAnimeInfo, matchAnimeToHiAnime, HiAnimeInfo } from '@/lib/consumet'
import { AnimeDetail } from '@/types/anime'

export function useHiAnimeEpisodes(anime: AnimeDetail | undefined) {
  const { data, error, isLoading } = useSWR<HiAnimeInfo | null>(
    anime ? ['HIANIME_EPISODES', anime.id] : null,
    async () => {
      if (!anime) return null

      console.log('🔍 Searching HiAnime for:', anime.title)

      const match = await matchAnimeToHiAnime(anime.title, anime.seasonYear)
      
      if (!match) {
        console.log('❌ No match found for:', anime.title)
        return null
      }

      console.log('✅ Match found:', match.title, match.id)
      const info = await getHiAnimeInfo(match.id)
      console.log('📺 Episode info:', info)
      
      return info
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, 
      shouldRetryOnError: false,
    }
  )

  console.log('Hook result:', { 
    hasData: !!data, 
    episodeCount: data?.episodes?.length || 0,
    error, 
    isLoading 
  })

  return {
    hiAnimeData: data,
    episodes: data?.episodes || [],
    isLoading,
    isError: error,
    notFound: !isLoading && !data,
  }
}
