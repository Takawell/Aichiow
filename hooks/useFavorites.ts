'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { FavoriteRow } from '@/types'

export function useFavorites(
  userId: string | null,
  media?: { mediaId: number; type: 'anime' | 'manga' | 'manhwa' | 'light_novel' }
) {
  const [favorites, setFavorites] = useState<FavoriteRow[]>([])
  const [loading, setLoading] = useState(true)

  // Load data favorit user
  useEffect(() => {
    if (!userId) return

    const fetchFavorites = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from<FavoriteRow>('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('added_at', { ascending: false })

      if (error) {
        console.error('Error fetching favorites:', error)
      } else {
        setFavorites(data || [])
      }
      setLoading(false)
    }

    fetchFavorites()
  }, [userId])

  // Cek apakah media ini sudah difavoritkan
  const isFavorite = useMemo(() => {
    if (!media) return false
    return favorites.some(
      (f) => f.media_id === media.mediaId && f.media_type === media.type
    )
  }, [favorites, media])

  // Toggle favorite
  const toggleFavorite = useCallback(
    async (fav: {
      mediaId: number
      type: 'anime' | 'manga' | 'manhwa' | 'light_novel'
    }) => {
      if (!userId) return

      const existing = favorites.find(
        (f) => f.media_id === fav.mediaId && f.media_type === fav.type
      )

      if (existing) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id)
          .eq('user_id', userId)

        if (error) {
          console.error('Error removing favorite:', error)
        } else {
          setFavorites((prev) => prev.filter((f) => f.id !== existing.id))
        }
      } else {
        const { data, error } = await supabase
          .from('favorites')
          .insert([
            {
              user_id: userId,
              media_id: fav.mediaId,
              media_type: fav.type,
              added_at: new Date().toISOString(),
            },
          ])
          .select()
          .single()

        if (error) {
          console.error('Error adding favorite:', error)
        } else if (data) {
          setFavorites((prev) => [data, ...prev])
        }
      }
    },
    [userId, favorites]
  )

  return { favorites, isFavorite, loading, toggleFavorite }
}
