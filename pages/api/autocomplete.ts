import type { NextApiRequest, NextApiResponse } from 'next'

type AutocompleteResult = {
  type: string
  label: string
  value: string
  post_count: number
  category?: number
}

type ApiResponse = {
  success: boolean
  data?: AutocompleteResult[]
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { q } = req.query

  if (!q || typeof q !== 'string' || q.trim().length < 2) {
    return res.status(200).json({ success: true, data: [] })
  }

  const apiKey = process.env.DANBOORU_API_KEY
  const apiUser = process.env.DANBOORU_API_USER || ''

  try {
    const params = new URLSearchParams({
      'search[query]': q.trim(),
      'search[type]': 'tag_query',
      'limit': '10'
    })

    const url = `https://danbooru.donmai.us/autocomplete.json?${params.toString()}`

    const response = await fetch(url, {
      headers: {
        'Authorization': apiKey ? `Basic ${Buffer.from(`${apiUser}:${apiKey}`).toString('base64')}` : '',
        'User-Agent': 'Aichiow/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Danbooru autocomplete error: ${response.status}`)
    }

    const data: AutocompleteResult[] = await response.json()

    const sortedData = data
      .filter(item => item.type === 'tag' && item.post_count > 0)
      .sort((a, b) => b.post_count - a.post_count)
      .slice(0, 10)

    return res.status(200).json({
      success: true,
      data: sortedData
    })

  } catch (error) {
    console.error('Autocomplete error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch autocomplete'
    })
  }
}
