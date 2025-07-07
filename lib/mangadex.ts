import axios from 'axios'

const BASE_URL = 'https://api.mangadex.org'

// ✅ Utility: filter manga yang punya cover_art
function hasCoverArt(manga: any) {
  return manga.relationships?.some((rel: any) => rel.type === 'cover_art')
}

// ✅ Fetch populer manga (untuk homepage dan explore)
export async function fetchPopularManga() {
  const res = await axios.get(`${BASE_URL}/manga`, {
    params: {
      limit: 40,
      order: { followedCount: 'desc' },
      includedTagsMode: 'AND',
      contentRating: ['safe', 'suggestive'],
      hasAvailableChapters: true,
      includes: ['cover_art'],
    },
  })

  const filtered = res.data.data.filter(hasCoverArt)
  return filtered
}

// ✅ Fetch detail manga
export async function fetchMangaDetail(id: string) {
  const res = await axios.get(`${BASE_URL}/manga/${id}`, {
    params: {
      includes: ['author', 'artist', 'cover_art'],
    },
  })
  return res.data.data
}

// ✅ Fetch list chapter dari manga
export async function fetchChapters(mangaId: string) {
  const res = await axios.get(`${BASE_URL}/chapter`, {
    params: {
      manga: mangaId,
      limit: 100,
      translatedLanguage: ['en'],
      order: { chapter: 'desc' },
    },
  })
  return res.data.data
}

// ✅ Fetch gambar dari 1 chapter
export async function fetchChapterImages(chapterId: string) {
  const res = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`)
  return {
    baseUrl: res.data.baseUrl,
    hash: res.data.chapter.hash,
    data: res.data.chapter.data,
    dataSaver: res.data.chapter.dataSaver,
  }
}

// ✅ Search manga by title
export async function searchManga(query: string) {
  const res = await axios.get(`${BASE_URL}/manga`, {
    params: {
      title: query,
      limit: 30,
      includes: ['cover_art'],
      contentRating: ['safe', 'suggestive'],
    },
  })

  const filtered = res.data.data.filter(hasCoverArt)
  return filtered
}

// ✅ Fetch all genre tags
export async function fetchGenres() {
  const res = await axios.get(`${BASE_URL}/manga/tag`)
  return res.data.data
}

// ✅ Filter manga by included tags (genre)
export async function getMangaByFilter(params: {
  includedTags: string[]
}): Promise<any[]> {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: 30,
        includedTags: params.includedTags,
        includedTagsMode: 'AND',
        contentRating: ['safe', 'suggestive'],
        includes: ['cover_art'],
        order: { popularity: 'desc' },
      },
    })

    const filtered = res.data.data.filter(hasCoverArt)
    return filtered
  } catch (error) {
    console.error('getMangaByFilter error:', error)
    return []
  }
}

// ✅ Optional filter by genre id (single)
export async function fetchMangaByGenre(tagId: string) {
  const res = await axios.get(`${BASE_URL}/manga`, {
    params: {
      includedTags: [tagId],
      includedTagsMode: 'AND',
      limit: 30,
      contentRating: ['safe', 'suggestive'],
      includes: ['cover_art'],
    },
  })

  const filtered = res.data.data.filter(hasCoverArt)
  return filtered
}

// ✅ Buat cover image URL
export function getCoverImage(mangaId: string, fileName: string) {
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`
}
