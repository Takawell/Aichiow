import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const BASE_URL = '[https://api.mangadex.org](https://api.mangadex.org)'

export default async function handler(
req: NextApiRequest,
res: NextApiResponse
) {
const { mangaId } = req.query

if (!mangaId || typeof mangaId !== 'string') {
return res.status(400).json({ message: 'Manga ID is required' })
}

try {
const limit = 100
let offset = 0
let chapters: any[] = []
let hasMore = true

```
while (hasMore) {
  const { data } = await axios.get(`${BASE_URL}/chapter`, {
    params: {
      manga: mangaId,
      limit,
      offset,
      translatedLanguage: ['en', 'id'],
      'order[chapter]': 'desc',
    },
  })

  const validChapters = data.data.filter((chapter: any) => {
    const attr = chapter?.attributes
    return (
      chapter?.id &&
      !attr?.externalUrl &&                     // Skip external chapter
      attr?.hash &&                             // Punya hash (wajib utk at-home)
      (attr?.data?.length > 0 || attr?.dataSaver?.length > 0) // Ada gambar
    )
  })

  chapters.push(...validChapters)

  offset += limit
  hasMore = offset < data.total
}

return res.status(200).json(chapters)
```

} catch (error: any) {
console.error('[API ERROR] /api/manga/chapters:', error.message)
return res.status(500).json({ message: 'Failed to fetch chapters' })
}
}
