import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chapterId } = req.query

  if (!chapterId || typeof chapterId !== 'string') {
    return res.status(400).json({ message: 'Chapter ID is required' })
  }

  try {
    const imageRes = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`)
    const { baseUrl, chapter } = imageRes.data

    const chapterRes = await axios.get(`https://api.mangadex.org/chapter/${chapterId}`)
    const chapterData = chapterRes.data?.data

    if (!baseUrl || !chapterData) {
      return res.status(500).json({ message: 'Invalid chapter data' })
    }

    const result = {
      baseUrl,
      chapter: {
        ...chapter,
        ...chapterData.attributes,
        relationships: chapterData.relationships,
        id: chapterData.id,
      },
    }

    res.status(200).json(result)
  } catch (error: any) {
    console.error('[API] /api/manga/chapter-images error:', error.message)
    res.status(500).json({ message: 'Failed to fetch chapter images' })
  }
}
