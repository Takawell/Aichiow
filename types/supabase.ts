export interface UserRow {
  id: string 
  username: string | null
  email: string | null
  avatar_url: string | null
  bio?: string
  created_at: string
  updated_at: string
}

export interface WatchHistoryRow {
  id: number
  user_id: string
  media_id: number
  media_type: 'anime' | 'manga' | 'manhwa' | 'light_novel'
  watched_at: string
}

export interface FavoriteRow {
  id: number
  user_id: string
  media_id: number
  media_type: 'anime' | 'manga' | 'manhwa' | 'light_novel'
  added_at: string
}
