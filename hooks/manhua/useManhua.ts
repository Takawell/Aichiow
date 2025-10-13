import { useEffect, useState } from "react"
import { Manhua } from "@/types/manhua"
import { fetchManhuaList, searchManhua, fetchTopManhua, fetchTrendingManhua } from "@/lib/manhua"

export function useManhua(page = 1, perPage = 20) {
  const [manhuaList, setManhuaList] = useState<Manhua[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadManhua = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchManhuaList(page, perPage)
        setManhuaList(data || [])
      } catch (err: any) {
        console.error("❌ Error loading manhua:", err)
        setError("Failed to load manhua list")
      } finally {
        setLoading(false)
      }
    }

    loadManhua()
  }, [page, perPage])

  return { manhuaList, loading, error }
}

export function useSearchManhua() {
  const [results, setResults] = useState<Manhua[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await searchManhua(query)
      setResults(data || [])
    } catch (err: any) {
      console.error("❌ Error searching manhua:", err)
      setError("Failed to search manhua")
    } finally {
      setLoading(false)
    }
  }

  return { results, search, loading, error }
}

export function useTopManhua() {
  const [topManhua, setTopManhua] = useState<Manhua[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadTop = async () => {
      try {
        const data = await fetchTopManhua()
        setTopManhua(data || [])
      } catch (err) {
        console.error("❌ Error fetching top manhua:", err)
      } finally {
        setLoading(false)
      }
    }

    loadTop()
  }, [])

  return { topManhua, loading }
}

export function useTrendingManhua() {
  const [trendingManhua, setTrendingManhua] = useState<Manhua[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await fetchTrendingManhua()
        setTrendingManhua(data || [])
      } catch (err) {
        console.error("❌ Error fetching trending manhua:", err)
      } finally {
        setLoading(false)
      }
    }

    loadTrending()
  }, [])

  return { trendingManhua, loading }
}
