// lib/api.ts
import { Anime } from '@/types/anime'

const BASE_URL = 'https://api.consumet.org/anime/gogoanime'

// Tambahkan mapping genre agar API mengenali genre-genre yang kita pakai
const genreMap: Record<string, string> = {
  'slice-of-life': 'slice of life',
  'avant-garde': 'avant garde',
  'girls-love': 'shoujo ai',
  'boys-love': 'shounen ai',
  'mahou-shoujo': 'magic',
  'sci-fi': 'sci-fi',
  'supernatural': 'supernatural',
  'sports': 'sports',
  'romance': 'romance',
  'action': 'action',
  'adventure': 'adventure',
  'drama': 'drama',
  'fantasy': 'fantasy',
  'comedy': 'comedy',
  'ecchi': 'ecchi',
  'horror': 'horror',
  'mystery': 'mystery',
  'mecha': 'mecha',
  'music': 'music',
  'psychological': 'psychological',
  'thriller': 'thriller',
  'school': 'school',
  // Tambah genre yang kamu dukung di UI
}

export async function fetchAnimeByGenre(genre: string, page = 1): Promise<Anime[]> {
  try {
    const mappedGenre = genreMap[genre.toLowerCase()] || genre
    const res = await fetch(`${BASE_URL}/genre/${mappedGenre}?page=${page}`)
    if (!res.ok) throw new Error('Failed to fetch genre anime')
    const data = await res.json()
    return data.results || []
  } catch (err) {
    console.error('[fetchAnimeByGenre] Error:', err)
    return []
  }
}
