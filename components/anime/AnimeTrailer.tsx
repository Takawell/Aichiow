'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@supabase/auth-helpers-nextjs'

interface Props {
  animeId: number
  trailer: {
    id: string
    site: string
    thumbnail?: string
  }
}

export default function AnimeTrailer({ animeId, trailer }: Props) {
  const user = useUser()

  const trailerUrl =
    trailer.site === 'youtube'
      ? `https://www.youtube.com/embed/${trailer.id}`
      : ''

  useEffect(() => {
    const saveWatchHistory = async () => {
      if (!user) return

      const { error } = await supabase.from('watch_history').insert([
        {
          user_id: user.id,
          anime_id: animeId,
          trailer_id: trailer.id,
          trailer_site: trailer.site,
          trailer_thumbnail: trailer.thumbnail || null,
          watched_at: new Date(),
          watch_count: 1,
        },
      ])

      if (error) console.error('Error saving watch history:', error)
    }

    saveWatchHistory()
  }, [user, animeId, trailer])

  return (
    <section className="px-4 md:px-10 py-10">
      <h2 className="text-2xl font-bold mb-4 text-white">🎬 Trailer</h2>
      <div className="aspect-[16/9] w-full max-w-6xl mx-auto shadow-xl rounded-xl overflow-hidden">
        <iframe
          src={trailerUrl}
          title="Anime Trailer"
          className="w-full h-full"
          allowFullScreen
        />
      </div>
    </section>
  )
}
