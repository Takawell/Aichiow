import axios from 'axios'

const CONSUMET_API = 'https://api-aichixia.vercel.app/anime/hianime'

export interface HiAnimeSearchResult {
  id: string
  title: string
  url: string
  image: string
  sub?: number
  dub?: number
  episodes?: number
}

export interface HiAnimeEpisode {
  number: number
  episodeId: string
  title?: string
  isFiller?: boolean
}

export interface HiAnimeInfo {
  id: string
  title: string
  image: string
  cover?: string
  description?: string
  genres?: string[]
  totalEpisodes?: number
  episodes: HiAnimeEpisode[]
}

export interface StreamingSource {
  url: string
  quality: string
  isM3U8: boolean
}

export interface WatchData {
  sources: StreamingSource[]
  subtitles?: any[]
  intro?: {
    start: number
    end: number
  }
  outro?: {
    start: number
    end: number
  }
}

export async function searchHiAnime(query: string): Promise<HiAnimeSearchResult[]> {
  try {
    const res = await axios.get(`${CONSUMET_API}/${encodeURIComponent(query)}`)
    return res.data.results || []
  } catch (error: any) {
    console.error('HiAnime Search Error:', error.message)
    return []
  }
}

export async function getHiAnimeInfo(animeId: string): Promise<HiAnimeInfo | null> {
  try {
    const res = await axios.get(`${CONSUMET_API}/info?id=${animeId}`)
    return res.data
  } catch (error: any) {
    console.error('HiAnime Info Error:', error.message)
    return null
  }
}

export async function getHiAnimeWatch(episodeId: string): Promise<WatchData | null> {
  try {
    const res = await axios.get(`${CONSUMET_API}/watch/${episodeId}`)
    return res.data
  } catch (error: any) {
    console.error('HiAnime Watch Error:', error.message)
    return null
  }
}

export async function matchAnimeToHiAnime(
  anilistTitle: {
    romaji: string
    english?: string
    native?: string
  }
): Promise<HiAnimeSearchResult | null> {
  if (anilistTitle.english) {
    const results = await searchHiAnime(anilistTitle.english)
    if (results.length > 0) return results[0]
  }

  const results = await searchHiAnime(anilistTitle.romaji)
  return results.length > 0 ? results[0] : null
}
