// File: pages/api/manga/genres.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const BASE_URL = 'https://api.mangadex.org'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get(`${BASE_URL}/manga/tag`)
    res.status(200).json(response.data.data)
  } catch (error: any) {
    console.error('[API] Failed to fetch genres:', error.message)
    res.status(500).json({ error: 'Failed to fetch genres' })
  }
}
