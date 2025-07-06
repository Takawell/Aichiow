// types/anime.ts
export interface Anime {
  id: number
  title: {
    romaji: string
    english: string
  }
  coverImage: {
    large: string
  }
  bannerImage?: string
  genres: string[]
  averageScore?: number
  episodes?: number
  season?: string
  seasonYear?: number
  format?: string
}

export interface AnimeDetail extends Anime {
  description?: string
  popularity?: number
  studios: {
    nodes: {
      name: string
    }[]
  }
  trailer?: {
    id: string
    site: string
    thumbnail: string
  }
  characters?: {
    edges: CharacterEdge[]
  }
}

export interface CharacterEdge {
  role: string
  node: {
    id: number
    name: {
      full: string
    }
    image: {
      large: string
    }
  }
  voiceActors: {
    id: number
    name: {
      full: string
    }
    image: {
      large: string
    }
    language: string
  }[]
}
