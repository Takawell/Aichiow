import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const BASE_URL = 'https://api.mangadex.org'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Manga ID is required' })
  }

  try {
    const response = await axios.get(`${BASE_URL}/manga/${id}`, {
      params: {
        includes: ['author', 'artist', 'cover_art'],
        'contentRating[]': ['safe', 'suggestive', 'erotica', 'pornographic'],
      },
    })

    const manga = response.data?.data

    if (!manga || Object.keys(manga).length === 0) {
      return res.status(404).json({ message: 'Manga not found or removed' })
    }

    res.status(200).json(manga)
  } catch (error: any) {
    console.error('[API] /api/manga/detail error:', error.message)
    res.status(500).json({ message: 'Failed to fetch manga detail' })
  }
}
