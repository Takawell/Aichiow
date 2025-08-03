'use client'
import { useEffect, useState } from 'react'
import { fetchTopRatedAnime, fetchAnimeDetail } from '@/lib/anilist'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Studio {
  name: string
}

export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([])

  useEffect(() => {
    const loadStudios = async () => {
      try {
        const topAnime = await fetchTopRatedAnime()
        const studioSet = new Set<string>()

        // Ambil studio dari 5 anime teratas
        for (let i = 0; i < Math.min(topAnime.length, 5); i++) {
          const detail = await fetchAnimeDetail(topAnime[i].id)
          const animeStudios = detail?.studios?.nodes || []
          animeStudios.forEach((studio: Studio) => {
            studioSet.add(studio.name)
          })
        }

        const studioArray = Array.from(studioSet).map((name) => ({ name }))
        setStudios(studioArray)
      } catch (err) {
        console.error('Failed to load studios:', err)
      }
    }

    loadStudios()
  }, [])

  if (studios.length === 0) return null

  return (
    <section className="w-full px-4 md:px-10 py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        🏢 Featured Studios
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
        {studios.map((studio, index) => (
          <motion.div
            key={studio.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1b1b1f] rounded-xl px-4 py-6 flex flex-col items-center text-center hover:shadow-xl transition-all border border-neutral-800"
          >
            <div className="relative w-14 h-14 mb-3">
              <Image
                src="/studio-placeholder.svg"
                alt={studio.name}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-white font-medium">{studio.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
