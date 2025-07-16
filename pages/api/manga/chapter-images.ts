import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const BASE_URL = 'https://api.mangadex.org'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chapterId } = req.query

  if (!chapterId || typeof chapterId !== 'string') {
    return res.status(400).json({ message: 'Chapter ID is required' })
  }

  try {
    // Fetch image data (hash, files)
    const imgRes = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`)
    const chapterRes = await axios.get(`${BASE_URL}/chapter/${chapterId}`)

    const baseUrl = imgRes.data.baseUrl
    const chapterData = chapterRes.data.data

    const mangaRel = chapterData.relationships.find((rel: any) => rel.type === 'manga')
    const mangaId = mangaRel?.id
    const currentChapter = chapterData.attributes.chapter

    let next: string | null = null
    let prev: string | null = null

    if (mangaId && currentChapter) {
      const listRes = await axios.get(
        `${BASE_URL}/chapter?manga=${mangaId}&translatedLanguage[]=en&order[chapter]=asc&limit=500`
      )
      const chapters = listRes.data.data || []
      const index = chapters.findIndex((ch: any) => ch.id === chapterId)

      if (index > 0) prev = chapters[index - 1]?.id || null
      if (index < chapters.length - 1) next = chapters[index + 1]?.id || null
    }

    return res.status(200).json({
      baseUrl,
      chapter: {
        ...chapterData.attributes,
        hash: imgRes.data.chapter.hash,
        data: imgRes.data.chapter.data,
        dataSaver: imgRes.data.chapter.dataSaver,
        next,
        prev,
        relationships: chapterData.relationships,
      },
    })
  } catch (error: any) {
    console.error('[API] /api/manga/chapter-images error:', error.message)
    res.status(500).json({ message: 'Failed to fetch chapter images' })
  }
}
