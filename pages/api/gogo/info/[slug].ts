// pages/api/gogo/info/[slug].ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  const url = `https://api.consumet.org/anime/gogoanime/info/${slug}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      return res.status(response.status).json({ error: "Upstream API error" })
    }
    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', detail: err })
  }
}
