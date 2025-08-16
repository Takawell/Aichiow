export type HistoryItem = {
  id?: string | number
  title: string
  thumbnail: string
  created_at?: string
}

export type Favorites = {
  anime: string[]
  manga: string[]
  manhwa: string[]
  lightNovel: string[]
}

export interface ProfileRow {
  id: string
  username: string | null
  bio: string | null
  avatar: string | null
  history: HistoryItem[] | null
  favorites: Favorites | null
  created_at?: string | null
  updated_at?: string | null
}
