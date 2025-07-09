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
      const result = await getGogoSlugFromTitle(title)
      setSlug(result)
      setIsLoading(false)
    }

    fetchSlug()
  }, [title])

  return {
    gogoSlug: slug,
    isLoading
  }
}
