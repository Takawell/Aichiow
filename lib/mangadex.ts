import axios from 'axios'

const BASE_URL = 'https://api.mangadex.org'

export async function fetchPopularManhwa() {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: 20,
        order: { followedCount: 'desc' },
        includedTagsMode: 'AND',
        contentRating: ['safe', 'suggestive'],
        translatedLanguage: ['en'],
      },
    })

    return res.data.data
  } catch (error) {
    console.error('[fetchPopularManhwa]', error)
    return []
  }
}

export async function fetchManhwaDetail(mangaId: string) {
  try {
    const res = await axios.get(`${BASE_URL}/manga/${mangaId}`, {
      params: {
        includes: ['author', 'artist', 'cover_art'],
      },
    })

    return res.data.data
  } catch (error) {
    console.error('[fetchManhwaDetail]', error)
    return null
  }
}

export async function fetchRawManhwaDetail(mangaId: string) {
  try {
    const res = await axios.get(`${BASE_URL}/manga/${mangaId}`)
    return res.data
  } catch (error) {
    console.error('[fetchRawManhwaDetail]', error)
    return null
  }
}

export async function fetchChapters(mangaId: string) {
  try {
    const res = await axios.get(`${BASE_URL}/chapter`, {
      params: {
        manga: mangaId,
        limit: 100,
        order: { chapter: 'desc' },
        translatedLanguage: ['en', 'id'], // ✅ hanya EN dan ID
      },
    })

    return res.data.data
  } catch (error) {
    console.error('[fetchChapters]', error)
    return []
  }
}

export async function fetchChapterImages(chapterId: string) {
  try {
    const res = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`)
    const { baseUrl, chapter } = res.data
    const fileList = chapter.dataSaver // ✅ versi data-saver (bebas watermark)
    const mode = 'data-saver'

    if (!fileList || fileList.length === 0) {
      throw new Error('No pages found for this chapter')
    }

    const images = fileList.map(
      (file: string) => `${baseUrl}/${mode}/${chapter.hash}/${file}`
    )

    return images
  } catch (error) {
    console.error('[fetchChapterImages]', error)
    return []
  }
}

export async function searchManhwa(query: string) {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        title: query,
        limit: 20,
        contentRating: ['safe', 'suggestive'],
        translatedLanguage: ['en'],
      },
    })

    return res.data.data
  } catch (error) {
    console.error('[searchManhwa]', error)
    return []
  }
}

export async function fetchGenres() {
  try {
    const res = await axios.get(`${BASE_URL}/manga/tag`)
    return res.data.data
  } catch (error) {
    console.error('[fetchGenres]', error)
    return []
  }
}

export async function getMangaByFilter(tagId: string) {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        includedTags: [tagId],
        includedTagsMode: 'AND',
        limit: 20,
        order: { followedCount: 'desc' },
        contentRating: ['safe', 'suggestive'],
        translatedLanguage: ['en'],
      },
    })

    return res.data.data
  } catch (error) {
    console.error('[getMangaByFilter]', error)
    return []
  }
}

export async function getTrendingDaily() {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: 20,
        order: { followedCount: 'desc' },
        createdAtSince: new Date(Date.now() - 86400000).toISOString(),
        contentRating: ['safe', 'suggestive'],
        translatedLanguage: ['en'],
      },
    })
    return res.data.data
  } catch (error) {
    console.error('[getTrendingDaily]', error)
    return []
  }
}

export async function getTrendingWeekly() {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: 20,
        order: { followedCount: 'desc' },
        createdAtSince: new Date(Date.now() - 7 * 86400000).toISOString(),
        contentRating: ['safe', 'suggestive'],
        translatedLanguage: ['en'],
      },
    })
    return res.data.data
  } catch (error) {
    console.error('[getTrendingWeekly]', error)
    return []
  }
}

export async function getTrendingMonthly() {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: 20,
        order: { followedCount: 'desc' },
        createdAtSince: new Date(Date.now() - 30 * 86400000).toISOString(),
        contentRating: ['safe', 'suggestive'],
        translatedLanguage: ['en'],
      },
    })
    return res.data.data
  } catch (error) {
    console.error('[getTrendingMonthly]', error)
    return []
  }
}

export function getCoverImage(manga: any) {
  const coverArt = manga.relationships?.find(
    (rel: any) => rel.type === 'cover_art'
  )
  return coverArt
    ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}.256.jpg`
    : '/no-image.png'
}
