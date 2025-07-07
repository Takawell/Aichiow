import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const BASE_URL = 'https://api.mangadex.org'

function hasCoverArt(manga: any) {
  return manga.relationships?.some((rel: any) => rel.type === 'cover_art')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q } = req.query

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ message: 'Query is required' })
  }

  try {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: {
        title: q,
        limit: 30,
        includes: ['cover_art'],
        contentRating: ['safe', 'suggestive'],
      },
    })

    const filtered = response.data.data.filter(hasCoverArt)
    res.status(200).json(filtered)
  } catch (error: any) {
    console.error('[API] /api/manga/search error:', error.message)
    res.status(500).json({ message: 'Failed to search manga' })
  }
}
