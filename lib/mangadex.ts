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
    },
  })
  return res.data.data
}

export async function fetchMangaDetail(id: string) {
  const res = await axios.get(`${BASE_URL}/manga/${id}`, {
    params: { includes: ['author', 'artist', 'cover_art'] },
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
    data: res.data.chapter.data, // original quality
    dataSaver: res.data.chapter.dataSaver, // low quality
  }
}

export async function searchManga(query: string) {
  const res = await axios.get(`${BASE_URL}/manga`, {
    params: {
      title: query,
      limit: 20,
      includes: ['cover_art'],
      contentRating: ['safe', 'suggestive'],
    },
  })
  return res.data.data
}

export async function fetchGenres() {
  const res = await axios.get(`${BASE_URL}/manga/tag`)
  return res.data.data
}

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

export function getCoverImage(mangaId: string, fileName: string) {
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`
}
