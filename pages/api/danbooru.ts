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
  media_asset: {
    variants: Array<{
      type: string
      url: string
      width: number
      height: number
      file_ext: string
    }>
  }
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

  const { tags = '', page = '1', limit = '20', rating = 'safe' } = req.query

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

    const searchTags = tags as string
    const ratingTag = rating as string

    let finalTags = ''
    if (searchTags.trim()) {
      finalTags = `${searchTags.trim()} rating:${ratingTag}`
    } else {
      finalTags = `rating:${ratingTag}`
    }

    const params = new URLSearchParams({
      tags: finalTags,
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
      const errorText = await response.text()
      console.error('Danbooru API error:', response.status, errorText)
      throw new Error(`Danbooru API error: ${response.status}`)
    }

    const data: DanbooruPost[] = await response.json()

    const processedData = data
      .filter(post => {
        const hasValidImage = post.file_url || post.large_file_url || post.preview_file_url
        const validExt = ['jpg', 'png', 'jpeg', 'gif', 'webp'].includes(post.file_ext?.toLowerCase())
        return hasValidImage && validExt
      })
      .map(post => {
        const imageUrl = post.large_file_url || post.file_url || post.preview_file_url
        const previewUrl = post.preview_file_url || post.large_file_url || post.file_url
        
        return {
          ...post,
          file_url: imageUrl,
          large_file_url: imageUrl,
          preview_file_url: previewUrl
        }
      })

    console.log(`Fetched ${processedData.length} posts for tags: "${finalTags}"`)

    return res.status(200).json({
      success: true,
      data: processedData,
      page: pageNum,
      hasMore: processedData.length === limitNum
    })

  } catch (error) {
    console.error('Danbooru API error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch from Danbooru'
    })
  }
}
