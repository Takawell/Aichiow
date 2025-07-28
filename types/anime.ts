// types/anime.ts

/** Title Variants */
export interface AnimeTitle {
  romaji: string
  english?: string
  native?: string
}

/** Image Variants */
export interface AnimeImage {
  extraLarge?: string
  large: string
  medium?: string
  color?: string
}

/** Trailer */
export interface AnimeTrailer {
  id: string
  site: string // "youtube" or "dailymotion"
  thumbnail?: string
}

/** Next Airing Info */
export interface NextAiringEpisode {
  airingAt: number
  episode: number
  timeUntilAiring?: number
}

/** Character Voice Actor */
export interface VoiceActor {
  name: {
    full: string
  }
  image: {
    large: string
  }
}

/** Character Node */
export interface CharacterNode {
  name: {
    full: string
    native?: string
  }
  image: {
    large: string
  }
}

/** Character Edge */
export interface CharacterEdge {
  role: string
  node: CharacterNode
  voiceActors: VoiceActor[]
}

/** Studio Info */
export interface StudioNode {
  name: string
}

/** Anime Base Interface */
export interface Anime {
  id: number
  slug: string
  title: AnimeTitle
  coverImage: AnimeImage
  bannerImage?: string
  genres: string[]
  averageScore?: number
  description?: string
  trailer?: AnimeTrailer
  nextAiringEpisode?: NextAiringEpisode
  episodes?: number
  duration?: number
}

/** Anime Detail Full Info */
export interface AnimeDetail extends Anime {
  format?: string // TV, OVA, MOVIE
  source?: string // "MANGA", "LIGHT_NOVEL", etc.
  season?: string
  seasonYear?: number
  popularity?: number
  status?: string
  meanScore?: number
  startDate?: {
    year: number
    month: number
    day: number
  }
  endDate?: {
    year: number
    month: number
    day: number
  }
  studios: {
    nodes: StudioNode[]
  }
  characters?: {
    edges: CharacterEdge[]
  }
  rankings?: {
    rank: number
    type: string
    season?: string
    context?: string
  }[]
  streamingEpisodes?: {
    title: string
    thumbnail: string
    url: string
    site: string
  }[]
  externalLinks?: {
    site: string
    url: string
    icon?: string
  }[]
  recommendations?: {
    edges: {
      node: {
        mediaRecommendation: Anime
      }
    }[]
  }
}
