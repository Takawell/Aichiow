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

export function useFavoritesList() {
  const supabase = createClientComponentClient()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(false)

  const getFavorites = useCallback(async () => {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setFavorites([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false })

    if (error) {
      console.error('Error fetching favorites list:', error.message)
      setFavorites([])
    } else {
      setFavorites(data || [])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    getFavorites()
  }, [getFavorites])

  return { favorites, loading, refresh: getFavorites }
}
