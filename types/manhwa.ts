// types/manhwa.ts

export interface ManhwaTitle {
  romaji: string
  english?: string
  native?: string
}

export interface ManhwaCover {
  large: string
  extraLarge?: string
  medium?: string
  color?: string
}

export interface CharacterNode {
  id: number
  name: {
    full: string
    native?: string
  }
  image: {
    large: string
  }
}

export interface StaffNode {
  id: number
  name: {
    full: string
    native?: string
  }
  image: {
    large: string
  }
}

export interface CharacterEdge {
  role: string
  node: CharacterNode
}

export interface StaffEdge {
  role?: string
  node: StaffNode
}

export interface Manhwa {
  id: number
  title: ManhwaTitle
  description?: string
  bannerImage?: string
  coverImage: ManhwaCover
  averageScore?: number
  genres: string[]
  chapters?: number
  status?: string
  format?: string
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
  characters?: {
    edges: CharacterEdge[]
  }
  staff?: {
    edges: StaffEdge[]
  }
}

export interface ManhwaDetail extends Manhwa {}
