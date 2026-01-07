import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url } = req.query

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' })
  }

  if (!url.includes('donmai.us')) {
    return res.status(400).json({ error: 'Invalid image source' })
  }

  try {
    const imageResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Aichiow/1.0',
        'Referer': 'https://danbooru.donmai.us/'
      }
    })

    if (!imageResponse.ok) {
      console.error('Image fetch failed:', imageResponse.status, url)
      return res.status(imageResponse.status).json({ error: 'Failed to fetch image' })
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'
    const imageBuffer = await imageResponse.arrayBuffer()

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.setHeader('Access-Control-Allow-Origin', '*')
    
    res.send(Buffer.from(imageBuffer))

  } catch (error) {
    console.error('Image proxy error:', error)
    return res.status(500).json({ error: 'Failed to proxy image' })
  }
}
