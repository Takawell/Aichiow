'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Props {
  animeId: number
  trailer: {
    id: string
    site: string
    thumbnail?: string | null
  }
}

export default function AnimeTrailer({ animeId, trailer }: Props) {
  const trailerUrl =
    trailer.site === 'youtube' ? `https://www.youtube.com/embed/${trailer.id}` : ''

  useEffect(() => {
    let mounted = true

    const saveWatchHistory = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        const session = (data as any)?.session
        if (!session?.user?.id) return
        const userId = session.user.id
        const { error } = await supabase.from('trailer_watch_history').insert([
          {
            user_id: userId,
            anime_id: animeId,
            trailer_id: trailer.id,
            trailer_site: trailer.site,
            trailer_thumbnail: trailer.thumbnail ?? null,
            watched_at: new Date(),
            watch_count: 1,
          },
        ])

        if (error) {
          console.error('Gagal simpan trailer history:', error)
        } else {
        }
      } catch (err) {
        console.error('saveWatchHistory error', err)
      }
    }

    saveWatchHistory()

    return () => {
      mounted = false
    }
  }, [animeId, trailer.id, trailer.site, trailer.thumbnail])

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
