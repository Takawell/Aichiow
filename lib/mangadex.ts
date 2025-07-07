import axios from 'axios'

const BASE_URL = 'https://api.mangadex.org'

export async function fetchPopularManga() {
  const res = await axios.get(`${BASE_URL}/manga`, {
    params: {
      limit: 20,
      order: { followedCount: 'desc' },
      includedTagsMode: 'AND',
      contentRating: ['safe', 'suggestive'],
      hasAvailableChapters: true,
      includes: ['cover_art'], // ✅ WAJIB untuk dapet fileName cover
    },
  })
  return res.data.data
}

export async function fetchMangaDetail(id: string) {
  const res = await axios.get(`${BASE_URL}/manga/${id}`, {
    params: {
      includes: ['author', 'artist', 'cover_art'], // ✅ lengkap
    },
  })
  return res.data.data
}

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

export async function fetchChapterImages(chapterId: string) {
  const res = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`)
  return {
    baseUrl: res.data.baseUrl,
    hash: res.data.chapter.hash,
    data: res.data.chapter.data,
    dataSaver: res.data.chapter.dataSaver,
  }
}

export async function searchManga(query: string) {
  const res = await axios.get(`${BASE_URL}/manga`, {
    params: {
      title: query,
      limit: 20,
      includes: ['cover_art'], // ✅ supaya bisa render hasil search
      contentRating: ['safe', 'suggestive'],
    },
  })
  return res.data.data
}

export async function fetchGenres() {
  const res = await axios.get(`${BASE_URL}/manga/tag`)
  return res.data.data
}

// ✅ Gunakan untuk /manga/genre/[name].tsx
export async function getMangaByFilter(params: {
  includedTags: string[]
}): Promise<any[]> {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: 20,
        includedTags: params.includedTags,
        includedTagsMode: 'AND',
        contentRating: ['safe', 'suggestive'],
        includes: ['cover_art'],
        order: { popularity: 'desc' },
      },
    })
    return res.data.data
  } catch (error) {
    console.error('getMangaByFilter error:', error)
    return []
  }
}

// Optional: masih bisa dipakai
export async function fetchMangaByGenre(tagId: string) {
  const res = await axios.get(`${BASE_URL}/manga`, {
    params: {
      includedTags: [tagId],
      includedTagsMode: 'AND',
      limit: 20,
      contentRating: ['safe', 'suggestive'],
      includes: ['cover_art'],
    },
  })
  return res.data.data
}

// ✅ Util bikin URL cover
export function getCoverImage(mangaId: string, fileName: string) {
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`
        }
