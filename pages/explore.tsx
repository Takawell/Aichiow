'use client'

import { useState } from 'react'
import Head from 'next/head'
import { useExploreAnime } from '@/hooks/useExploreAnime'
import { useSearchAnime } from '@/hooks/useSearchAnime'
import AnimeCard from '@/components/anime/AnimeCard'
import SectionTitle from '@/components/shared/SectionTitle'
import GenreFilter from '@/components/shared/GenreFilter'
import { motion } from 'framer-motion'
import { FaSearch, FaArrowDown } from 'react-icons/fa'

export default function ExplorePage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [input, setInput] = useState('')

  const { anime: exploreAnime, isLoading, loadMore, hasMore } = useExploreAnime()
  const { anime: searchAnime, isLoading: searchLoading } = useSearchAnime(query)

  const animeData = query ? searchAnime : exploreAnime

  const filtered = selectedGenre
    ? animeData.filter((a) => a.genres.includes(selectedGenre))
    : animeData

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setQuery(input.trim())
  }

  return (
    <>
      <Head>
        <title>Explore Anime | Aichiow</title>
        <meta
          name="description"
          content="Discover and search for anime by genre, popularity, and more."
        />
      </Head>

      <main className="bg-gradient-to-b from-[#0f0f10] via-[#111215] to-[#0a0a0a] min-h-screen text-white px-4 md:px-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SectionTitle title="🚀 Explore Anime" />
        </motion.div>

        {/* Search */}
        <motion.form
          onSubmit={handleSubmit}
          className="mt-8 mb-6 flex flex-col sm:flex-row items-stretch gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for anime title..."
              className="w-full pl-11 pr-4 py-3 bg-neutral-900 text-white rounded-lg border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all duration-300"
          >
            Search
          </button>
        </motion.form>

        {/* Genre Filter */}
        {!query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GenreFilter selected={selectedGenre} onSelect={setSelectedGenre} />
          </motion.div>
        )}

        {/* Anime Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          {(isLoading || searchLoading) && animeData.length === 0
            ? [...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="aspect-[2/3] w-full bg-neutral-800 animate-pulse rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                />
              ))
            : filtered.map((a) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <AnimeCard anime={a} />
                </motion.div>
              ))}
        </motion.div>

        {/* No Results */}
        {query && !searchLoading && filtered.length === 0 && (
          <motion.p
            className="text-center text-zinc-400 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            No results found for{' '}
            <span className="text-white font-semibold">"{query}"</span>.
          </motion.p>
        )}

        {/* Load More */}
        {!query && hasMore && (
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 shadow-lg"
            >
              <FaArrowDown className="text-white" />
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </motion.div>
        )}

        {/* End of List */}
        {!query && !hasMore && exploreAnime.length > 0 && (
          <motion.p
            className="text-center text-sm text-neutral-400 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            You've reached the end of the list.
          </motion.p>
        )}
      </main>
    </>
  )
}
