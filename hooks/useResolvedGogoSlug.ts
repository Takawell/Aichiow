// hooks/useResolvedGogoSlug.ts

import { useEffect, useState } from "react"
import { getGogoSlugFromTitle } from "@/lib/getGogoSlugFromTitle"

export function useResolvedGogoSlug(title?: string) {
  const [slug, setSlug] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!title) return

    const fetchSlug = async () => {
      setIsLoading(true)

      // Coba fetch slug dari API pencarian
      const result = await getGogoSlugFromTitle(title)

      if (result) {
        setSlug(result)
      } else {
        // Jika gagal, fallback ke format romaji-lowercase
        const fallback = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
        setSlug(fallback)
      }

      setIsLoading(false)
    }

    fetchSlug()
  }, [title])

  return {
    gogoSlug: slug,
    isLoading
  }
}
