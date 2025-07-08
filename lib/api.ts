// lib/api.ts
import { Anime } from '@/types/anime'

const BASE_URL = 'https://api.consumet.org/anime/gogoanime'

export async function fetchAnimeByGenre(genre: string, page = 1): Promise<Anime[]> {
  try {
    const res = await fetch(`${BASE_URL}/genre/${genre}?page=${page}`)
    if (!res.ok) throw new Error('Failed to fetch genre anime')
    const data = await res.json()
    return data.results || []
  } catch (err) {
    console.error('[fetchAnimeByGenre] Error:', err)
    return []
  }
}
