import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chapterId } = req.query

  if (!chapterId || typeof chapterId !== 'string') {
    return res.status(400).json({ message: 'Chapter ID is required' })
  }

  try {
    const response = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`)    
    const { baseUrl, chapter } = response.data
    const images = chapter.data.map((file: string) => ({
      url: `${baseUrl}/data/${chapter.hash}/${file}`,
      file,
    }))

    res.status(200).json({
      baseUrl,
      hash: chapter.hash,
      images,
    })

  } catch (error: any) {
    console.error('[API] /api/manga/chapter-images error:', error.message)
    res.status(500).json({ message: 'Failed to fetch chapter images' })
  }
}
