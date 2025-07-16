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

// ✅ Ambil gambar dari chapter (image URLs) + support next & prev
export async function fetchChapterImages(chapterId: string) {
  try {
    const res = await axios.get(`/api/manga/chapter-images?chapterId=${chapterId}`)
    const { baseUrl, chapter } = res.data

    if (!baseUrl || !chapter?.hash) throw new Error('Invalid chapter response')

    const cleanBaseUrl = baseUrl.replace(/\\/g, '')

    // Dapatkan mangaId dan currentChapter dari relationships
    const mangaRel = chapter?.relationships?.find((rel: any) => rel.type === 'manga')
    const mangaId = mangaRel?.id
    const currentChapter = chapter?.chapter || null

    let next: string | null = null
    let prev: string | null = null

    if (mangaId && currentChapter) {
      const chapterListRes = await axios.get(
        `https://api.mangadex.org/chapter?manga=${mangaId}&translatedLanguage[]=en&order[chapter]=asc&limit=500`
      )

      const allChapters = chapterListRes.data?.data || []
      const index = allChapters.findIndex((ch: any) => ch.id === chapterId)

      if (index > 0) {
        prev = allChapters[index - 1]?.id || null
      }

      if (index < allChapters.length - 1) {
        next = allChapters[index + 1]?.id || null
      }
    }

    return {
      baseUrl: cleanBaseUrl,
      hash: chapter.hash,
      data: chapter.data || [],
      dataSaver: chapter.dataSaver || [],
      next,
      prev,
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
