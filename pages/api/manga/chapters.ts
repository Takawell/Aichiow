import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const BASE_URL = 'https://api.mangadex.org/'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { mangaId } = req.query
  if (!mangaId || typeof mangaId !== 'string') {
    return res.status(400).json({ message: 'Manga ID is required' })
  }

  try {
    const response = await axios.get(`${BASE_URL}/chapter`, {
      params: {
        manga: mangaId,
        limit: 100,
        translatedLanguage: ['en', 'id'],
        order: { chapter: 'desc' },
      },
    })

    res.status(200).json(response.data.data)
  } catch (error: any) {
    console.error('[API] /api/manga/chapters error:', error.message)
    res.status(500).json({ message: 'Failed to fetch chapters' })
  }
}
