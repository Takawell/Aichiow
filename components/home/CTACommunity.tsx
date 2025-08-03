'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTACommunity() {
  return (
    <section className="w-full px-4 md:px-10 py-16 bg-gradient-to-r from-[#0f0f10] via-[#1c1c1f] to-[#0a0a0a] rounded-t-3xl mt-20 border-t border-white/10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center space-y-6"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
          🌌 Dive Deeper Into The Anime Realm
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto text-base md:text-lg">
          Discover hand-picked seasonal highlights, studio masterpieces, and hidden anime gems. 
          No login needed — just your curiosity.
        </p>

        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <Link
            href="/manhwa"
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-full transition-all"
          >
            Explore manhwa
          </Link>
          <Link
            href="/manga"
            className="border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white/5 transition-all"
          >
            Explore Manga
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
