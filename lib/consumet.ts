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
  type?: string
  japaneseTitle?: string
  duration?: string
  nsfw?: boolean
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
  },
  seasonYear?: number
): Promise<HiAnimeSearchResult | null> {
  const searchQueries = [
    anilistTitle.english,
    anilistTitle.romaji,
  ].filter(Boolean) as string[]

  for (const query of searchQueries) {
    const results = await searchHiAnime(query)
    
    if (results.length === 0) continue

    console.log(`🔍 Search results for "${query}":`, results.map(r => ({
      title: r.title,
      type: r.type,
      episodes: r.episodes,
      id: r.id
    })))

    const exactMatch = results.find(r => {
      const titleMatch = r.title.toLowerCase().trim() === query.toLowerCase().trim()
      const japaneseMatch = r.japaneseTitle?.toLowerCase().trim() === query.toLowerCase().trim()
      return titleMatch || japaneseMatch
    })

    if (exactMatch) {
      console.log('✅ Exact match:', exactMatch.title)
      return exactMatch
    }

    const tvMatches = results.filter(r => {
      const titleLower = r.title.toLowerCase()
      const queryLower = query.toLowerCase()
      const japaneseLower = r.japaneseTitle?.toLowerCase() || ''
      
      const queryWords = queryLower.split(' ')
      const titleContainsQuery = queryWords.every(word => 
        titleLower.includes(word) || japaneseLower.includes(word)
      )
      
      return (
        r.type === 'TV' &&
        (r.episodes || 0) > 10 &&
        titleContainsQuery
      )
    })

    if (tvMatches.length > 0) {
      tvMatches.sort((a, b) => (b.episodes || 0) - (a.episodes || 0))
      console.log('✅ Best TV match:', tvMatches[0].title, `(${tvMatches[0].episodes} eps)`)
      return tvMatches[0]
    }

    const partialMatch = results.find(r => {
      const titleLower = r.title.toLowerCase()
      const queryLower = query.toLowerCase()
      return (r.episodes || 0) > 0 && titleLower.includes(queryLower)
    })
    
    if (partialMatch) {
      console.log('⚠️ Partial match:', partialMatch.title)
      return partialMatch
    }

    const firstWithEpisodes = results.find(r => (r.episodes || 0) > 0)
    if (firstWithEpisodes) {
      console.log('⚠️ Fallback to first result:', firstWithEpisodes.title)
      return firstWithEpisodes
    }
  }

  console.log('❌ No match found for:', anilistTitle)
  return null
}
