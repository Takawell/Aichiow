export interface ProfileRow {
  id: string
  username: string | null
  bio: string | null
  avatar: string | null
  history: string[] | null 
  favorites: {
    anime: string[]
    manga: string[]
    manhwa: string[]
    lightNovel: string[]
  } | null
  created_at?: string | null 
  updated_at?: string | null 
}
