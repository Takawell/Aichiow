import { NextApiRequest, NextApiResponse } from 'next'

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
  tag_string_general: string
  tag_string_meta: string
  rating: string
  score: number
  fav_count: number
  file_ext: string
  image_width: number
  image_height: number
  source: string
  pixiv_id: number | null
  md5: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ success: false, error: 'Invalid post ID' })
  }

  try {
    const postId = parseInt(id)
    
    if (isNaN(postId)) {
      return res.status(400).json({ success: false, error: 'Post ID must be a number' })
    }

    const response = await fetch(
      `https://danbooru.donmai.us/posts/${postId}.json`,
      {
        headers: {
          'User-Agent': 'Aichiow/1.0 (Fanart Gallery App)',
        },
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ success: false, error: 'Post not found' })
      }
      throw new Error(`Danbooru API error: ${response.status}`)
    }

    const post: DanbooruPost = await response.json()

    if (!post.file_url && !post.large_file_url) {
      return res.status(404).json({ 
        success: false, 
        error: 'Post has no accessible image' 
      })
    }

    const cleanPost = {
      id: post.id,
      created_at: post.created_at,
      file_url: post.file_url,
      large_file_url: post.large_file_url,
      preview_file_url: post.preview_file_url,
      tag_string: post.tag_string,
      tag_string_character: post.tag_string_character || '',
      tag_string_copyright: post.tag_string_copyright || '',
      tag_string_artist: post.tag_string_artist || '',
      tag_string_general: post.tag_string_general || '',
      tag_string_meta: post.tag_string_meta || '',
      rating: post.rating,
      score: post.score,
      fav_count: post.fav_count,
      file_ext: post.file_ext,
      image_width: post.image_width,
      image_height: post.image_height,
      source: post.source || '',
      pixiv_id: post.pixiv_id,
      md5: post.md5
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')

    return res.status(200).json({
      success: true,
      data: cleanPost
    })

  } catch (error) {
    console.error('Error fetching post:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch post data'
    })
  }
}
