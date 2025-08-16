'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type MediaType = 'anime' | 'manga' | 'manhwa' | 'light_novel'

interface Favorite {
  id: number
  user_id: string
  media_id: number
  media_type: MediaType
  added_at: string
}

export function useFavorites(mediaId?: number, mediaType?: MediaType) {
  const supabase = createClientComponentClient()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Load all favorites for current user
  const getFavorites = useCallback(async () => {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setFavorites([])
      setIsFavorite(false)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false })

    if (error) {
      console.error('Error fetching favorites:', error.message)
    } else {
      setFavorites(data || [])

      if (mediaId && mediaType) {
        setIsFavorite(
          data?.some(
            (fav) =>
              fav.media_id === mediaId && fav.media_type === mediaType
          ) || false
        )
      }
    }
    setLoading(false)
  }, [mediaId, mediaType, supabase])

  // Toggle favorite
  const toggleFavorite = useCallback(async () => {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !mediaId || !mediaType) {
      setLoading(false)
      return
    }

    if (isFavorite) {
      // remove
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('media_id', mediaId)
        .eq('media_type', mediaType)

      if (error) console.error('Error removing favorite:', error.message)
    } else {
      // insert
      const { error } = await supabase.from('favorites').insert([
        {
          user_id: user.id,
          media_id: mediaId,
          media_type: mediaType,
        },
      ])

      if (error) console.error('Error adding favorite:', error.message)
    }

    await getFavorites()
    setLoading(false)
  }, [isFavorite, mediaId, mediaType, supabase, getFavorites])

  // Auto load on mount
  useEffect(() => {
    getFavorites()
  }, [getFavorites])

  return {
    favorites,
    isFavorite,
    loading,
    toggleFavorite,
    refresh: getFavorites,
  }
}
