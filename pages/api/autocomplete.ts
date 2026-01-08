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

  try {
    const params = new URLSearchParams({
      'search[query]': q.trim(),
      'search[type]': 'tag_query',
      'limit': '10'
    })

    const url = `https://danbooru.donmai.us/autocomplete.json?${params.toString()}`

    console.log('Fetching autocomplete:', url)

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Danbooru autocomplete error:', response.status, errorText)
      throw new Error(`Danbooru autocomplete error: ${response.status}`)
    }

    const data: AutocompleteResult[] = await response.json()

    console.log('Autocomplete response:', data)

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
