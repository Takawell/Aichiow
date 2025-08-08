import axios from 'axios'
import { Anime } from '@/types/anime'

const ANILIST_API = 'https://graphql.anilist.co'

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
  return data.Page.media
}

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
  return data.Page.media
}

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
  return data.Page.media
}

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
  return data.Page.media
}

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

  return data?.Media?.characters?.edges || []
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
  return data.Page.media
}

// ✅ Schedule Anime Mingguan
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
  return data.Page.media.filter((m: any) => m.nextAiringEpisode)
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
  return data?.Media
}

// ✅ Anime News (untuk landing)
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
  return data.Page.media
}

// ✅ Trending Anime (Paginated)
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
  return data.Page.media
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
      ?.map((e: any) => e.node.mediaRecommendation)
      ?.filter(Boolean) || []
  )
}

// fetch va detail
export async function fetchVoiceActorById(id: number) {
  const query = `
    query ($id: Int) {
      Staff(id: $id) {
        id
        name {
          full
          native
        }
        image {
          large
        }
        languageV2
        characters(perPage: 50) {
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
            media {
              nodes {
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
        }
      }
    }
  `

  const variables = { id }
  const data = await fetchFromAnilist(query, variables)

  const staff = data?.Staff
  if (!staff) return null

  const characters = staff.characters?.edges?.map((edge: any) => {
    const media = edge.media?.nodes?.[0] // Ambil anime pertama jika ada
    return {
      id: edge.node.id,
      name: edge.node.name,
      image: edge.node.image,
      role: edge.role,
      media: media ? {
        id: media.id,
        title: media.title,
        coverImage: media.coverImage
      } : null
    }
  }) ?? []

  return {
    id: staff.id,
    name: staff.name.full,
    image: staff.image.large,
    language: staff.languageV2,
    characters
  }
}
