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
    const response = await axios.get(`${BASE_URL}/chapter`, {
      params: {
        manga: mangaId,
        translatedLanguage: ['en', 'id'], // ✅ English + Indonesia
        limit: 100,
        order: { chapter: 'desc' },
        includes: ['scanlation_group', 'user'],
        contentRating: ['safe', 'suggestive'],
      },
    })

    const filteredChapters = response.data.data.filter(
      (chapter: any) =>
        chapter.attributes.pages > 0 &&
        !chapter.attributes.externalUrl // ✅ buang chapter eksternal
    )

    res.status(200).json(filteredChapters)
  } catch (error: any) {
    console.error('[API] /api/manga/chapters error:', error.message)
    res.status(500).json({ message: 'Failed to fetch chapters' })
  }
}
