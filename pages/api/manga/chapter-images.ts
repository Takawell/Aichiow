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

    const metaRes = await axios.get(`https://api.mangadex.org/chapter/${chapterId}`)
    const chapterData = metaRes.data?.data

    if (!baseUrl || !chapter || !chapterData) {
      return res.status(500).json({ message: 'Invalid chapter response' })
    }

    const result = {
      baseUrl,
      chapter: {
        id: chapterData.id,
        hash: chapter.hash,
        data: chapter.data,
        dataSaver: chapter.dataSaver,
        relationships: chapterData.relationships,
        chapter: chapterData.attributes.chapter,
      },
    }

    return res.status(200).json(result)
  } catch (error: any) {
    console.error('[API] /api/manga/chapter-images error:', error.message)
    return res.status(500).json({ message: 'Failed to fetch chapter images' })
  }
}
