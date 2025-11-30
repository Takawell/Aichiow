import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const BASE_URL = 'https://api.mangadex.org'
const MAX_PAGES = 10

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { mangaId } = req.query

  if (!mangaId || typeof mangaId !== 'string') {
    return res.status(400).json({ message: 'Manga ID is required' })
  }

  try {
    let allChapters: any[] = []
    let offset = 0
    const limit = 100
    let page = 0

    while (page < MAX_PAGES) {
      const response = await axios.get(`${BASE_URL}/chapter`, {
        params: {
          manga: mangaId,
          limit: limit,
          offset: offset,
          translatedLanguage: ['en', 'id'],
          order: { chapter: 'desc' },
          contentRating: ['safe', 'suggestive', 'erotica'],
          includeFutureUpdates: '0',
        },
      })

      const chapters = response.data.data
      if (chapters.length === 0) break

      allChapters = [...allChapters, ...chapters]

      const total = response.data.total
      offset += limit
      page++

      if (offset >= total) break
    }

    res.status(200).json(allChapters)
  } catch (error: any) {
    console.error('[API] /api/manga/chapters error:', error.message)
    res.status(500).json({ message: 'Failed to fetch chapters' })
  }
}
