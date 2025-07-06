// types/anime.ts
export interface Anime {
  id: number
  title: {
    romaji: string
    english?: string
  }
  coverImage: {
    large: string
  }
  genres: string[]
  averageScore?: number
  trailer?: {
    id: string
    site: string
  }
}

export interface AnimeDetail extends Anime {
  description?: string
  bannerImage?: string
  format?: string
  season?: string
  seasonYear?: number
  popularity?: number
  studios: {
    nodes: {
      name: string
    }[]
  }
  characters?: {
    edges: CharacterEdge[]
  }
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
