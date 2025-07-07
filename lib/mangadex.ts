import axios from 'axios'

export function getCoverImage(mangaId: string, fileName: string) {
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`
}

// ✅ Utility filter cover
function hasCoverArt(manga: any) {
  return manga.relationships?.some((rel: any) => rel.type === 'cover_art')
}

// ✅ Fetch populer manga
export async function fetchPopularManga() {
  try {
    const res = await axios.get('/api/manga/popular')
    const filtered = res.data.filter(hasCoverArt)
    return filtered
  } catch (error) {
    console.error('fetchPopularManga error:', error)
    return []
  }
}

// ✅ Search manga by title
export async function searchManga(query: string) {
  try {
    const res = await axios.get('/api/manga/search', {
      params: { title: query },
    })
    const filtered = res.data.filter(hasCoverArt)
    return filtered
  } catch (error) {
    console.error('searchManga error:', error)
    return []
  }
}

// ✅ Fetch detail manga
export async function fetchMangaDetail(id: string) {
  try {
    const res = await axios.get('/api/manga/detail', {
      params: { id },
    })
    return res.data
  } catch (error) {
    console.error('fetchMangaDetail error:', error)
    return null
  }
}

// ✅ Fetch list chapters
export async function fetchChapters(mangaId: string) {
  try {
    const res = await axios.get('/api/manga/chapters', {
      params: { mangaId },
    })
    return res.data
  } catch (error) {
    console.error('fetchChapters error:', error)
    return []
  }
}

// ✅ Fetch chapter images langsung ke mangadex (butuh original link)
export async function fetchChapterImages(chapterId: string) {
  try {
    const res = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`)
    return {
      baseUrl: res.data.baseUrl,
      hash: res.data.chapter.hash,
      data: res.data.chapter.data,
      dataSaver: res.data.chapter.dataSaver,
    }
  } catch (error) {
    console.error('fetchChapterImages error:', error)
    return null
  }
}
