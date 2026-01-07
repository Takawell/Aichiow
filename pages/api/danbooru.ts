import type { NextApiRequest, NextApiResponse } from 'next'

type DanbooruPost = {
  id: number
  created_at: string
  file_url: string
  large_file_url: string
  preview_file_url: string
  tag_string: string
  tag_string_character: string
  tag_string_copyright: string
  tag_string_artist: string
  rating: string
  score: number
  fav_count: number
  file_ext: string
  image_width: number
  image_height: number
  source: string
}

type ApiResponse = {
  success: boolean
  data?: DanbooruPost[]
  error?: string
  page?: number
  hasMore?: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { tags = 'rating:safe', page = '1', limit = '20' } = req.query

  const apiKey = process.env.DANBOORU_API_KEY
  const apiUser = process.env.DANBOORU_API_USER || ''

  if (!apiKey) {
    return res.status(500).json({ 
      success: false, 
      error: 'API key not configured' 
    })
  }

  try {
    const pageNum = parseInt(page as string)
    const limitNum = Math.min(parseInt(limit as string), 200)

    const params = new URLSearchParams({
      tags: tags as string,
      page: pageNum.toString(),
      limit: limitNum.toString()
    })

    const url = `https://danbooru.donmai.us/posts.json?${params.toString()}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${apiUser}:${apiKey}`).toString('base64')}`,
        'User-Agent': 'Aichiow/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Danbooru API error: ${response.status}`)
    }

    const data: DanbooruPost[] = await response.json()

    const filteredData = data.filter(post => 
      post.file_url && 
      ['jpg', 'png', 'jpeg', 'gif'].includes(post.file_ext)
    )

    return res.status(200).json({
      success: true,
      data: filteredData,
      page: pageNum,
      hasMore: filteredData.length === limitNum
    })

  } catch (error) {
    console.error('Danbooru API error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch from Danbooru'
    })
  }
}
