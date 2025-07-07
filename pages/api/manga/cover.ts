import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const BASE_URL = 'https://api.mangadex.org'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { mangaId } = req.query

  if (!mangaId || typeof mangaId !== 'string') {
    return res.status(400).json({ message: 'Manga ID is required' })
  }

  try {
    const response = await axios.get(`${BASE_URL}/manga/${mangaId}`, {
      params: { includes: ['cover_art'] },
    })

    const manga = response.data.data
    const coverRel = manga.relationships.find((rel: any) => rel.type === 'cover_art')
    const coverFileName = coverRel?.attributes?.fileName

    if (!coverFileName) {
      return res.status(404).json({ message: 'Cover not found' })
    }

    const coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}`

    res.status(200).json({ url: coverUrl })
  } catch (error: any) {
    console.error('[API] /api/manga/cover error:', error.message)
    res.status(500).json({ message: 'Failed to fetch cover' })
  }
}
