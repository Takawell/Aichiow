// pages/api/manga/chapter-images.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const BASE_URL = 'https://api.mangadex.org'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chapterId } = req.query

  if (!chapterId || typeof chapterId !== 'string') {
    return res.status(400).json({ message: '❌ Chapter ID is required' })
  }

  try {
    // Fetch server for chapter images
    const server = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`)

    // Fetch chapter metadata
    const chapter = await axios.get(`${BASE_URL}/chapter/${chapterId}`)

    const { hash, data, dataSaver } = chapter.data.data.attributes

    // Cek valid
    if (!server.data?.baseUrl || !hash || (!data?.length && !dataSaver?.length)) {
      return res.status(404).json({ message: '❌ Chapter images not found or incomplete' })
    }

    return res.status(200).json({
      baseUrl: server.data.baseUrl,
      hash,
      data,
      dataSaver
    })
  } catch (err: any) {
    console.error('[chapter-images] Error:', err.message)
    return res.status(500).json({ message: '❌ Failed to fetch chapter images' })
  }
}
