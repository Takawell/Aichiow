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
      },
    })

    res.status(200).json(response.data.data)
  } catch (error: any) {
    console.error('[API] /api/manga/detail error:', error.message)
    res.status(500).json({ message: 'Failed to fetch manga detail' })
  }
}
