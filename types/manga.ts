export interface Manga {
  id: string
  title: string
  coverFileName: string
  description?: string
  author?: string
  rating?: number
  genres?: string[]
  year?: number
  status?: string
  lastChapter?: string
}
