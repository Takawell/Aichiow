'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import type { FavoriteRow } from '@/types/supabase'

type MediaType = 'anime' | 'manga' | 'manhwa' | 'light_novel'

interface Params {
  mediaId?: number
  mediaType?: MediaType
}

export function useFavorites(params: Params = {}) {
  const { mediaId, mediaType } = params
  const router = useRouter()

  const [favorites, setFavorites] = useState<FavoriteRow[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFavorites = useCallback(async () => {
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
      console.error('Error fetching favorites:', error.message)
    } else {
      setFavorites(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const isFavorite = useMemo(() => {
    if (!mediaId || !mediaType) return false
    return favorites.some(
      (f) => f.media_id === mediaId && f.media_type === mediaType
    )
  }, [favorites, mediaId, mediaType])

  const toggleFavorite = useCallback(async () => {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      router.push('/auth/login')
      return
    }

    if (!mediaId || !mediaType) {
      await fetchFavorites()
      setLoading(false)
      return
    }

    const existing = favorites.find(
      (f) => f.media_id === mediaId && f.media_type === mediaType
    )

    if (existing) {
      // Hapus favorit
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error removing favorite:', error.message)
      } else {
        // Optimistic update
        setFavorites((prev) => prev.filter((f) => f.id !== existing.id))
      }
    } else {
      // Tambah favorit
      const { data, error } = await supabase
        .from('favorites')
        .insert([
          {
            user_id: user.id,
            media_id: mediaId,
            media_type: mediaType,
            added_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Error adding favorite:', error.message)
      } else if (data) {
        // Optimistic update
        setFavorites((prev) => [data as FavoriteRow, ...prev])
      }
    }

    setLoading(false)
  }, [favorites, mediaId, mediaType, fetchFavorites, router])

  return {
    favorites,        
    isFavorite,       
    loading,
    toggleFavorite,   
    refresh: fetchFavorites,
  }
}
