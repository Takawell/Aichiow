import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chapterId } = req.query

  if (!chapterId || typeof chapterId !== 'string') {
    return res.status(400).json({ message: 'Chapter ID is required' })
  }

  try {
    // Step 1: Fetch server info (baseUrl)
    const serverRes = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`)

    // Step 2: Fetch chapter metadata (hash, data, dataSaver)
    const chapterRes = await axios.get(`https://api.mangadex.org/chapter/${chapterId}`)

    const chapter = chapterRes.data.data.attributes

    res.status(200).json({
      baseUrl: serverRes.data.baseUrl,
      hash: chapter.hash,
      data: chapter.data,
      dataSaver: chapter.dataSaver,
    })
  } catch (error: any) {
    console.error('[API] /chapter-images error:', error.message)
    res.status(500).json({ message: 'Failed to fetch chapter images' })
  }
}
