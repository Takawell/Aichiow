import axios from 'axios'

// ✅ Utility: filter manga yang punya cover_art
export function hasCoverArt(manga: any) {
  return manga.relationships?.some((rel: any) => rel.type === 'cover_art')
}

// ✅ Fetch populer manga
export async function fetchPopularManga() {
  const res = await axios.get('/api/manga/popular')
  return res.data
}

// ✅ Fetch detail manga
export async function fetchMangaDetail(id: string) {
  const res = await axios.get(`/api/manga/detail?id=${id}`)
  return res.data
}

// ✅ Fetch list chapter dari manga
export async function fetchChapters(mangaId: string) {
  const res = await axios.get(`/api/manga/chapters?mangaId=${mangaId}`)
  return res.data
}

// ✅ FIXED: Fetch gambar dari 1 chapter
export async function fetchChapterImages(chapterId: string) {
  try {
    const res = await axios.get(`/api/manga/chapter-images?chapterId=${chapterId}`)
    const { baseUrl, chapter } = res.data

    if (!baseUrl || !chapter?.hash) {
      throw new Error('Invalid chapter response')
    }

    const cleanBaseUrl = baseUrl.replace(/\\/g, '') // ✅ Fix escaped slashes

    return {
      baseUrl: cleanBaseUrl,
      hash: chapter.hash,
      data: chapter.data || [],
      dataSaver: chapter.dataSaver || [],
    }
  } catch (error) {
    console.error('fetchChapterImages error:', error)
    return null
  }
}

// ✅ FIXED: Search manga by title (akurasi lebih tinggi)
export async function searchManga(query: string) {
  const res = await axios.get(`/api/manga/search?query=${query}`)
  const results = res.data

  const lowered = query.toLowerCase().trim()

  return results.filter((manga: any) => {
    const titles = [
      ...Object.values(manga.attributes.title || {}),
      ...manga.attributes.altTitles.flatMap((alt: any) => Object.values(alt)),
    ]

    return titles.some(
      (title) => typeof title === 'string' && title.toLowerCase().includes(lowered)
    )
  })
}

// ✅ Fetch all genre tags
export async function fetchGenres() {
  const res = await axios.get('/api/manga/genres')
  return res.data
}

// ✅ Filter manga by included tags (genre)
export async function getMangaByFilter(params: { includedTags: string[] }): Promise<any[]> {
  try {
    const res = await axios.post('/api/manga/filter', params)
    return res.data
  } catch (error) {
    console.error('getMangaByFilter error:', error)
    return []
  }
}

// ✅ Optional: get manga by single genre (alias)
export async function fetchMangaByGenre(tagId: string) {
  const res = await axios.get(`/api/manga/genre?id=${tagId}`)
  return res.data
}

// ✅ Buat cover image URL
export function getCoverImage(mangaId: string, fileName: string) {
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`
}

// ✅ Ambil judul lokal manga dengan fallback
export function getLocalizedTitle(titleObj: { [key: string]: string }) {
  return (
    titleObj.en ||
    titleObj.ja ||
    titleObj['en-us'] ||
    Object.values(titleObj)[0] ||
    'Untitled'
  )
}

// ✅ Optional: sort chapter (gunakan jika belum disortir di API)
export function sortChapters(chapters: any[]) {
  return chapters.sort((a, b) => {
    const numA = parseFloat(a.attributes.chapter || '0')
    const numB = parseFloat(b.attributes.chapter || '0')
    return numB - numA
  })
}
