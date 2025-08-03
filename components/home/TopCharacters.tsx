'use client'
import { useEffect, useState } from 'react'
import { fetchTopRatedAnime, fetchAnimeDetail } from '@/lib/anilist'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Character {
  id: number
  name: { full: string }
  image: { large: string }
  voiceActor?: {
    name: { full: string }
    image: { large: string }
  }
}

export default function TopCharacters() {
  const [characters, setCharacters] = useState<Character[]>([])

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const topAnime = await fetchTopRatedAnime()
        const firstAnime = topAnime?.[0]
        if (!firstAnime) return

        const detail = await fetchAnimeDetail(firstAnime.id)
        const charEdges = detail?.characters?.edges || []

        const topChars = charEdges.map((edge: any) => ({
          id: edge.node.id,
          name: edge.node.name,
          image: edge.node.image,
          voiceActor: edge.voiceActors?.[0]
        }))

        setCharacters(topChars)
      } catch (err) {
        console.error('Failed to load characters:', err)
      }
    }

    loadCharacters()
  }, [])

  if (characters.length === 0) return null

  return (
    <section className="w-full px-4 md:px-10 py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        🌟 Top Characters
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
        {characters.map((char, index) => (
          <motion.div
            key={char.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#1a1a1f] rounded-xl overflow-hidden border border-neutral-800 hover:shadow-lg transition-all"
          >
            <div className="relative w-full aspect-[3/4]">
              <Image
                src={char.image?.large || '/character-placeholder.png'}
                alt={char.name.full}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3 space-y-1 text-center">
              <p className="text-sm font-medium text-white line-clamp-1">{char.name.full}</p>
              {char.voiceActor && (
                <p className="text-xs text-neutral-400 line-clamp-1">
                  VA: {char.voiceActor.name.full}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
