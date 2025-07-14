'use client'
import React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const SearchBar = () => {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return
    router.push(`/manga/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center mb-6">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search manga..."
        className="w-full px-4 py-2 rounded-lg bg-background border border-muted"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  )
}
