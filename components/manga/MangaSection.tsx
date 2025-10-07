'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FaBookOpen, FaPlayCircle, FaStar, FaUser } from 'react-icons/fa'
import { Manga } from '@/types/manga'
import MangaCard from './MangaCard'

interface Props {
  title: string
  mangas: Manga[]
  icon?: string
}

export const MangaSection = ({ title, mangas, icon }: Props) => {
  const [showPreview, setShowPreview] = useState(false)
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null)

  if (!mangas || mangas.length === 0) return null
  const hero = mangas[0]

  return (
    <section className="space-y-10">
      <div className="relative w-full h-[480px] md:h-[620px] rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={`https://uploads.mangadex.org/covers/${hero.id}/${hero.coverFileName}`}
          alt={hero.title || 'Manga Cover'}
          fill
          className="object-cover brightness-[0.45]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg flex items-center gap-3"
          >
            {icon && <span>{icon}</span>} {title}
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-lg md:text-2xl font-semibold mt-2 text-blue-300 drop-shadow"
          >
            {hero.title}
          </motion.h3>

          {hero.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="text-sm md:text-base text-gray-200 max-w-2xl line-clamp-3 mt-2"
            >
              {hero.description.replace(/<[^>]*>/g, '')}
            </motion.p>
          )}

          <div className="flex items-center gap-4 mt-3 text-gray-300 text-sm">
            {hero.author && (
              <span className="flex items-center gap-1">
                <FaUser className="text-sky-400" /> {hero.author}
              </span>
            )}
            {hero.rating && (
              <span className="flex items-center gap-1">
                <FaStar className="text-yellow-400" /> {hero.rating}/10
              </span>
            )}
          </div>

          <div className="flex gap-3 mt-5">
            <Link href={`/manga/${hero.id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white font-semibold px-6 py-2.5 rounded-full shadow-md hover:shadow-blue-500/40 transition-all"
              >
                <FaBookOpen /> Read
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedManga(hero)
                setShowPreview(true)
              }}
              className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 text-white font-semibold px-6 py-2.5 rounded-full backdrop-blur-sm transition-all"
            >
              <FaPlayCircle /> Preview
            </motion.button>
          </div>
        </div>
      </div>

        <div>
        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-sky-400">More Manga</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mangas.slice(1).map((manga) => (
            <MangaCard
              key={manga.id}
              id={manga.id}
              title={manga.title}
              coverFileName={manga.coverFileName}
            />
          ))}
        </div>
      </div>

        {showPreview && selectedManga && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPreview(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 max-w-lg w-full text-white shadow-2xl border border-gray-700"
          >
            <div className="flex gap-4">
              <Image
                src={`https://uploads.mangadex.org/covers/${selectedManga.id}/${selectedManga.coverFileName}`}
                alt={selectedManga.title}
                width={120}
                height={180}
                className="rounded-lg object-cover"
              />
              <div>
                <h2 className="text-xl font-bold">{selectedManga.title}</h2>
                {selectedManga.rating && (
                  <p className="flex items-center gap-1 text-yellow-400 mt-1">
                    <FaStar /> {selectedManga.rating}/10
                  </p>
                )}
                <p className="text-sm text-gray-300 mt-3 line-clamp-5">
                  {selectedManga.description?.replace(/<[^>]*>/g, '')}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
