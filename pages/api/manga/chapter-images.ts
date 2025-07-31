import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chapterId } = req.query

  if (!chapterId || typeof chapterId !== 'string') {
    return res.status(400).json({ message: 'Chapter ID is required' })
  }

  try {
    // Fetch server info for the chapter
    const response = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`)
    const { baseUrl, chapter } = response.data

    if (!chapter || !chapter.hash || !chapter.dataSaver) {
      return res.status(500).json({ message: 'Invalid chapter response from MangaDex' })
    }

    // Generate full image URLs using data-saver
    const imageUrls = chapter.dataSaver.map(
      (fileName: string) => `${baseUrl}/data-saver/${chapter.hash}/${fileName}`
    )

    res.status(200).json({
      images: imageUrls,
      pageCount: imageUrls.length,
    })
  } catch (error: any) {
    console.error('[API] /api/manga/chapter-images error:', error.message)
    res.status(500).json({ message: 'Failed to fetch chapter images' })
  }
}
