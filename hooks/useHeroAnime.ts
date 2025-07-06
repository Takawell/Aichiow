// hooks/useHeroAnime.ts
import { useQuery } from '@tanstack/react-query'
import { Anime } from '@/types/anime'
import { fetchFromAnilist } from '@/lib/anilist'

export function useHeroAnime() {
  return useQuery<Anime>({
    queryKey: ['hero-anime'],
    queryFn: async () => {
      const query = `
        query {
          Page(perPage: 1) {
            media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
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
              trailer {
                id
                site
              }
            }
          }
        }
      `
      const data = await fetchFromAnilist(query)
      return data.Page.media[0]
    },
  })
}
