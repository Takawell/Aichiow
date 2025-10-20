export type StudioMedia = {
  id: number
  title: { romaji?: string; english?: string; native?: string }
  coverImage?: { large?: string; medium?: string; color?: string }
  bannerImage?: string | null
  averageScore?: number
  genres?: string[]
  seasonYear?: number | null
  format?: string | null
}

export interface StudioDetail {
  id: number
  name: string
  isAnimationStudio: boolean
  favourites?: number
  media?: {
    nodes: StudioMedia[]
  }
  founded?: string 
}
