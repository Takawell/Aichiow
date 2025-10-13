export interface ManhuaTitle {
  romaji?: string
  english?: string
  native?: string
}

export interface ManhuaDate {
  year?: number
  month?: number
  day?: number
}

export interface ManhuaCharacter {
  id: number
  name: {
    full: string
  }
  image?: {
    large?: string
  }
  role?: string
}

export interface ManhuaStaff {
  role?: string
  node: {
    name: {
      full: string
    }
    image?: {
      large?: string
    }
  }
}

export interface Manhua {
  id: number
  title: ManhuaTitle
  description?: string
  coverImage?: {
    large?: string
    color?: string
  }
  bannerImage?: string
  genres?: string[]
  averageScore?: number
  popularity?: number
  chapters?: number
  volumes?: number
  status?: string
  format?: string
  countryOfOrigin?: string
  isAdult?: boolean
  startDate?: ManhuaDate
  endDate?: ManhuaDate
  characters?: {
    edges: {
      role?: string
      node: ManhuaCharacter
    }[]
  }
  staff?: {
    edges: ManhuaStaff[]
  }
}
