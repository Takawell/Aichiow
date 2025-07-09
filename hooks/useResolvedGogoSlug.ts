import { useEffect, useState } from 'react'

export function useResolvedGogoSlug(title?: string) {
  const [slug, setSlug] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!title) return

    const fetchSlug = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`https://api.consumet.org/anime/gogoanime/${encodeURIComponent(title)}`)
        const data = await res.json()
        const firstResult = data.results?.[0]
        if (firstResult?.id) {
          setSlug(firstResult.id)
        }
      } catch (err) {
        console.error('Gagal ambil slug:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlug()
  }, [title])

  return { gogoSlug: slug, isLoading }
}
