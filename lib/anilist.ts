import axios from 'axios'
import { Anime } from '@/types/anime'

const ANILIST_API = 'https://graphql.anilist.co'

function normalizeImageUrl(url?: string | null): string {
  if (!url) return ''
  return url.replace('s4.anilist.co', 'img.anili.st')
}

export async function fetchFromAnilist(query: string, variables?: Record<string, any>) {
  try {
    const res = await axios.post(
      ANILIST_API,
      { query, variables },
      { headers: { 'Content-Type': 'application/json' } }
    )
    return res.data.data
  } catch (error: any) {
    console.error('Anilist Error:', error.message)
    throw new Error('Failed to fetch from Anilist')
  }
}

// ✅ Trending Anime
export async function fetchTrendingAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 10) {
        media(type: ANIME, sort: TRENDING_DESC) {
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
  return data.Page.media.map((anime: Anime) => ({
    ...anime,
    coverImage: { ...anime.coverImage, large: normalizeImageUrl(anime.coverImage.large) },
    bannerImage: normalizeImageUrl(anime.bannerImage),
  }))
}

// ✅ Ongoing Anime
export async function fetchOngoingAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 10) {
        media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
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
  return data.Page.media.map((anime: Anime) => ({
    ...anime,
    coverImage: { ...anime.coverImage, large: normalizeImageUrl(anime.coverImage.large) },
    bannerImage: normalizeImageUrl(anime.bannerImage),
  }))
}

// ✅ Seasonal Anime
export async function fetchSeasonalAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 10) {
        media(type: ANIME, season: SUMMER, seasonYear: 2025, sort: POPULARITY_DESC) {
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
  return data.Page.media.map((anime: Anime) => ({
    ...anime,
    coverImage: { ...anime.coverImage, large: normalizeImageUrl(anime.coverImage.large) },
    bannerImage: normalizeImageUrl(anime.bannerImage),
  }))
}

// ✅ Top Rated Anime
export async function fetchTopRatedAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 10) {
        media(type: ANIME, sort: SCORE_DESC) {
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
  return data.Page.media.map((anime: Anime) => ({
    ...anime,
    coverImage: { ...anime.coverImage, large: normalizeImageUrl(anime.coverImage.large) },
    bannerImage: normalizeImageUrl(anime.bannerImage),
  }))
}

// ✅ Characters Manga
export async function fetchMangaCharacters(title: string) {
  const query = `
    query ($search: String) {
      Media(search: $search, type: MANGA) {
        characters(sort: [ROLE, RELEVANCE], perPage: 10) {
          edges {
            role
            node {
              id
              name {
                full
              }
              image {
                large
              }
            }
            voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
              id
              name {
                full
              }
              image {
                large
              }
            }
          }
        }
      }
    }
  `
  const variables = { search: title }
  const data = await fetchFromAnilist(query, variables)
  return (
    data?.Media?.characters?.edges?.map((c: any) => ({
      ...c,
      node: {
        ...c.node,
        image: { ...c.node.image, large: normalizeImageUrl(c.node.image.large) },
      },
      voiceActors: c.voiceActors?.map((va: any) => ({
        ...va,
        image: { ...va.image, large: normalizeImageUrl(va.image.large) },
      })),
    })) || []
  )
}

// ✅ Upcoming Anime
export async function fetchUpcomingAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 20) {
        media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
  `
  const data = await fetchFromAnilist(query)
  return data.Page.media.map((anime: Anime) => ({
    ...anime,
    coverImage: { ...anime.coverImage, large: normalizeImageUrl(anime.coverImage.large) },
  }))
}

// ✅ Schedule Anime
export async function fetchScheduleAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 50) {
        media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          nextAiringEpisode {
            airingAt
            episode
          }
        }
      }
    }
  `
  const data = await fetchFromAnilist(query)
  return data.Page.media
    .filter((m: any) => m.nextAiringEpisode)
    .map((anime: Anime) => ({
      ...anime,
      coverImage: { ...anime.coverImage, large: normalizeImageUrl(anime.coverImage.large) },
    }))
}

// ✅ Detail Anime
export async function fetchAnimeDetail(id: number): Promise<any> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
          color
        }
        bannerImage
        genres
        averageScore
        description
        format
        status
        episodes
        duration
        season
        seasonYear
        popularity
        nextAiringEpisode {
          airingAt
          episode
        }
        trailer {
          id
          site
        }
        studios {
          nodes {
            name
          }
        }
        characters(sort: [ROLE, RELEVANCE], perPage: 10) {
          edges {
            role
            node {
              name {
                full
              }
              image {
                large
              }
            }
            voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
              name {
                full
              }
              image {
                large
              }
            }
          }
        }
      }
    }
  `
  const variables = { id }
  const data = await fetchFromAnilist(query, variables)
  const anime = data?.Media
  return {
    ...anime,
    coverImage: {
      ...anime.coverImage,
      large: normalizeImageUrl(anime.coverImage.large),
      medium: normalizeImageUrl(anime.coverImage.medium),
    },
    bannerImage: normalizeImageUrl(anime.bannerImage),
    characters: {
      ...anime.characters,
      edges: anime.characters.edges.map((c: any) => ({
        ...c,
        node: {
          ...c.node,
          image: { ...c.node.image, large: normalizeImageUrl(c.node.image.large) },
        },
        voiceActors: c.voiceActors?.map((va: any) => ({
          ...va,
          image: { ...va.image, large: normalizeImageUrl(va.image.large) },
        })),
      })),
    },
  }
}

// ✅ News Anime
export async function fetchNewsAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 10) {
        media(type: ANIME, sort: UPDATED_AT_DESC) {
          id
          title {
            romaji
          }
          coverImage {
            large
          }
        }
      }
    }
  `
  const data = await fetchFromAnilist(query)
  return data.Page.media.map((anime: Anime) => ({
    ...anime,
    coverImage: { ...anime.coverImage, large: normalizeImageUrl(anime.coverImage.large) },
  }))
}

// ✅ Trending Anime Paginated
export async function fetchTrendingAnimePaginated(page = 1, perPage = 20): Promise<Anime[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            color
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
  const variables = { page, perPage }
  const data = await fetchFromAnilist(query, variables)
  return data.Page.media.map((anime: Anime) => ({
    ...anime,
    coverImage: { ...anime.coverImage, large: normalizeImageUrl(anime.coverImage.large) },
    bannerImage: normalizeImageUrl(anime.bannerImage),
  }))
}

// ✅ Similar Anime
export async function fetchSimilarAnime(id: number): Promise<Anime[]> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        recommendations(perPage: 10, sort: RATING_DESC) {
          edges {
            node {
              mediaRecommendation {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                genres
                averageScore
              }
            }
          }
        }
      }
    }
  `
  const variables = { id }
  const data = await fetchFromAnilist(query, variables)
  return (
    data?.Media?.recommendations?.edges
      ?.map((e: any) => ({
        ...e.node.mediaRecommendation,
        coverImage: {
          ...e.node.mediaRecommendation.coverImage,
          large: normalizeImageUrl(e.node.mediaRecommendation.coverImage.large),
        },
      }))
      ?.filter(Boolean) || []
  )
}
