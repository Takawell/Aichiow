import axios from 'axios'

export function hasCoverArt(manga: any) {
  return manga.relationships?.some((rel: any) => rel.type === 'cover_art')
}

export async function fetchPopularManga() {
  const res = await axios.get('/api/manga/popular')
  return res.data
}

export async function fetchMangaDetail(id: string) {
  const res = await axios.get(`/api/manga/detail?id=${id}`)
  return res.data
}

export async function fetchChapters(mangaId: string) {
  const res = await axios.get(`/api/manga/chapters?mangaId=${mangaId}`)
  return res.data
}

export async function fetchChapterImages(chapterId: string) {
  try {
    const res = await axios.get(`/api/manga/chapter-images?chapterId=${chapterId}`)
    const { baseUrl, chapter } = res.data

    if (!baseUrl || !chapter?.hash) throw new Error('Invalid chapter response')

    const cleanBaseUrl = baseUrl.replace(/\\/g, '')

    const mangaRel = chapter?.relationships?.find((rel: any) => rel.type === 'manga')
    const mangaId = mangaRel?.id

    let next: string | null = null
    let prev: string | null = null

    if (mangaId) {
      const listRes = await axios.get(
        `https://api.mangadex.org/chapter?manga=${mangaId}&order[chapter]=asc&limit=500`
      )

      const all = listRes.data?.data || []
      const sorted = all.sort((a: any, b: any) => {
        const numA = parseFloat(a.attributes.chapter)
        const numB = parseFloat(b.attributes.chapter)

        if (isNaN(numA) && isNaN(numB))
          return new Date(a.attributes.createdAt).getTime() - new Date(b.attributes.createdAt).getTime()
        if (isNaN(numA)) return 1
        if (isNaN(numB)) return -1
        return numA - numB
      })

      const index = sorted.findIndex((ch: any) => ch.id === chapterId)

      if (index > 0) prev = sorted[index - 1]?.id || null
      if (index < sorted.length - 1) next = sorted[index + 1]?.id || null

      console.log('Current chapter:', chapterId)
      console.log('Prev:', prev)
      console.log('Next:', next)
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

export async function fetchGenres() {
  const res = await axios.get('/api/manga/genres')
  return res.data
}

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

export async function fetchMangaByGenre(tagId: string) {
  const res = await axios.get(`/api/manga/genre?id=${tagId}`)
  return res.data
}

export function getCoverImage(mangaId: string, fileName: string) {
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`
}

export function getLocalizedTitle(titleObj: { [key: string]: string }) {
  return (
    titleObj.en ||
    titleObj.ja ||
    titleObj['en-us'] ||
    Object.values(titleObj)[0] ||
    'Untitled'
  )
}

export function sortChapters(chapters: any[]) {
  return chapters.sort((a, b) => {
    const numA = parseFloat(a.attributes.chapter || '0')
    const numB = parseFloat(b.attributes.chapter || '0')
    return numB - numA
  })
}

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
