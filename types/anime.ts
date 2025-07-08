// types/anime.ts

export interface Anime {
  id: number
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
  description?: string // ✅ tambahkan ini
  trailer?: {
    id: string
    site: string
  }
  nextAiringEpisode?: {
    airingAt: number
    episode: number
  } // ✅ ditambahkan tanpa mengubah struktur lain
}

export interface AnimeDetail extends Anime {
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
