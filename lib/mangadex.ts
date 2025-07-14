import axios from 'axios'

// ✅ Cek apakah manga punya cover_art
export function hasCoverArt(manga: any) {
  return manga.relationships?.some((rel: any) => rel.type === 'cover_art')
}

// ✅ Ambil manga populer
export async function fetchPopularManga() {
  const res = await axios.get('/api/manga/popular')
  return res.data
}

// ✅ Ambil detail manga
export async function fetchMangaDetail(id: string) {
  const res = await axios.get(`/api/manga/detail?id=${id}`)
  return res.data
}

// ✅ Ambil semua chapter dari manga tertentu
export async function fetchChapters(mangaId: string) {
  const res = await axios.get(`/api/manga/chapters?mangaId=${mangaId}`)
  return res.data
}

// ✅ Ambil gambar dari chapter (image URLs)
export async function fetchChapterImages(chapterId: string) {
  try {
    const res = await axios.get(`/api/manga/chapter-images?chapterId=${chapterId}`)
    const { baseUrl, chapter } = res.data

    if (!baseUrl || !chapter?.hash) throw new Error('Invalid chapter response')

    const cleanBaseUrl = baseUrl.replace(/\\/g, '') // Bersihkan slash

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

// ✅ Cari manga dari judul
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

// ✅ Ambil semua genre manga
export async function fetchGenres() {
  const res = await axios.get('/api/manga/genres')
  return res.data
}

// ✅ Ambil manga berdasarkan filter tag
export async function getMangaByFilter(params: { includedTags: string[] }) {
  try {
    const res = await axios.post('/api/manga/filter', params)
    const results = res.data
    return results.filter((manga: any) => hasCoverArt(manga))
  } catch (error) {
    console.error('getMangaByFilter error:', error)
    return []
  }
}

// ✅ Ambil manga berdasarkan genre ID
export async function fetchMangaByGenre(tagId: string) {
  const res = await axios.get(`/api/manga/genre?id=${tagId}`)
  return res.data
}

// ✅ Buat URL gambar cover dari MangaDex
export function getCoverImage(mangaId: string, fileName: string) {
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`
}

// ✅ Ambil judul lokal dengan fallback
export function getLocalizedTitle(titleObj: { [key: string]: string }) {
  return (
    titleObj.en ||
    titleObj.ja ||
    titleObj['en-us'] ||
    Object.values(titleObj)[0] ||
    'Untitled'
  )
}

// ✅ Urutkan chapter secara descending (chapter terbaru duluan)
export function sortChapters(chapters: any[]) {
  return chapters.sort((a, b) => {
    const numA = parseFloat(a.attributes.chapter || '0')
    const numB = parseFloat(b.attributes.chapter || '0')
    return numB - numA
  })
}

// ✅ Section tambahan: ongoing, completed, top rated, latest
export async function getMangaSection(type: 'ongoing' | 'completed' | 'top_rated' | 'latest') {
  try {
    const res = await axios.get(`/api/manga/section?type=${type}`)
    const results = res.data
    return results.filter((manga: any) => hasCoverArt(manga))
  } catch (err) {
    console.error('getMangaSection error:', err)
    return []
  }
}

// ✅ Genre populer bawaan (pakai id tag MangaDex)
const genreMap: Record<string, string> = {
  action: '391b0423-d847-456f-aff0-8b0cfc03066b',
  romance: '423e2eae-a7a2-c800-2d73-c3bffcd2f0c3',
  fantasy: 'cdc58593-87dd-415e-bbc0-2ec27bf404cc',
}

export async function getMangaByGenre(name: keyof typeof genreMap) {
  const tagId = genreMap[name]
  return fetchMangaByGenre(tagId)
}
