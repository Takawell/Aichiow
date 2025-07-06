// hooks/useSeasonalAnime.ts
import { useQuery } from '@tanstack/react-query'
import { Anime } from '@/types/anime'
import { fetchFromAnilist } from '@/lib/anilist'

export function useSeasonalAnime() {
  return useQuery<Anime[]>({
    queryKey: ['seasonalAnime'],
    queryFn: async () => {
      const query = `
        query {
          Page(perPage: 12) {
            media(season: SUMMER, seasonYear: 2024, type: ANIME, sort: POPULARITY_DESC) {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              bannerImage
              genres
              averageScore
              description
              trailer {
                id
                site
              }
            }
          }
        }
      `
      const data = await fetchFromAnilist(query)
      return data?.Page?.media ?? []
    }
  })
}
