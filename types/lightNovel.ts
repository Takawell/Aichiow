// types/lightNovel.ts

export interface LightNovelTitle {
  romaji: string
  english?: string
  native?: string
}

export interface LightNovelCover {
  large: string
  extraLarge?: string
  medium?: string
  color?: string
}

export interface LightNovelCharacter {
  id: number
  name: {
    full: string
    native?: string
  }
  image: {
    large: string
  }
  role?: string
}

export interface LightNovelStaff {
  id: number
  name: {
    full: string
  }
  image: {
    large: string
  }
}

export interface LightNovel {
  id: number
  title: LightNovelTitle
  description?: string
  bannerImage?: string
  coverImage: LightNovelCover
  averageScore?: number
  genres: string[]
  status?: string
  format?: string
  volumes?: number
  chapters?: number
  popularity?: number
  source?: string
  countryOfOrigin?: string
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
  staff?: LightNovelStaff[]
  characters?: LightNovelCharacter[]
}
