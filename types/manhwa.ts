// types/manhwa.ts
export interface Manhwa {
  id: number
  title: {
    romaji: string
    english?: string
    native?: string
  }
  coverImage: {
    large: string
    extraLarge?: string
  }
  bannerImage?: string
  averageScore?: number
  genres: string[]
  description?: string
}
