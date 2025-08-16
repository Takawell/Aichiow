export interface ProfileRow {
  id: string
  username: string | null
  bio: string | null
  avatar: string | null
  history: string[] | null   // kalau di DB tipe JSON/Text[] lebih aman string[] dulu
  favorites: {
    anime: string[]
    manga: string[]
    manhwa: string[]
    lightNovel: string[]
  } | null
  created_at?: string | null // optional kalau di Supabase schema ada
  updated_at?: string | null // optional juga kalau ada trigger update
}
