// hooks/useResolvedGogoSlug.ts
import { useEffect, useState } from "react"
import { getGogoSlugFromTitle } from "@/lib/getGogoSlugFromTitle"
import { gogoSlugMap } from "@/lib/gogoSlugMap"

export function useResolvedGogoSlug(title?: string) {
  const [slug, setSlug] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!title) return

    const fallback = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    const manualSlug = gogoSlugMap[fallback]

    const fetch = async () => {
      setIsLoading(true)

      if (manualSlug) {
        setSlug(manualSlug)
        setIsLoading(false)
        return
      }

      const result = await getGogoSlugFromTitle(title)

      if (result) setSlug(result)
      else setSlug(fallback)

      setIsLoading(false)
    }

    fetch()
  }, [title])

  return {
    gogoSlug: slug,
    isLoading
  }
}
