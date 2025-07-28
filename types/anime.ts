// types/anime.ts

export interface Anime {
  id: number
  slug: string
  title: {
    romaji: string
    english?: string
    native?: string
  }
  coverImage: {
    large: string
    medium?: string
    color?: string
  }
  bannerImage?: string
  genres: string[]
  averageScore?: number
  description?: string
  trailer?: {
    id: string
    site: string
  }
  nextAiringEpisode?: {
    airingAt: number
    episode: number
  }
  episodes?: number
  duration?: number 
}

export interface AnimeDetail extends Anime {
  format?: string
  source?: string
  season?: string
  seasonYear?: number
  popularity?: number
  status?: string
  studios: {
    nodes: {
      name: string
    }[]
  }
  characters?: {
    edges: CharacterEdge[]
  }
  duration?: number
}

export interface CharacterEdge {
  role: string
  node: {
    name: {
      full: string
    }
    image: {
      large: string
    }
  }
  voiceActors: {
    name: {
      full: string
    }
    image: {
      large: string
    }
  }[]
}
