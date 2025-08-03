'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
}

export default function CTACommunityFooter() {
  return (
    <section className="w-full mt-24 bg-gradient-to-br from-[#0f0f10] via-[#19191c] to-[#0a0a0a] border-t border-white/10 rounded-t-3xl overflow-hidden">
      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-24 text-center relative z-10">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={0}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-primary to-white text-transparent bg-clip-text"
        >
          🌌 Dive Deeper Into The Anime Realm
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={1}
          viewport={{ once: true }}
          className="text-neutral-400 mt-6 max-w-2xl mx-auto text-base md:text-lg"
        >
          Discover hand-picked seasonal highlights, studio masterpieces, and hidden anime gems. No login needed — just your curiosity.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={2}
          viewport={{ once: true }}
          className="flex justify-center gap-4 mt-10 flex-wrap"
        >
          <Link
            href="/manhwa"
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-full transition-all shadow-md shadow-primary/30"
          >
            Explore Manhwa
          </Link>
          <Link
            href="/manga"
            className="border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white/5 transition-all"
          >
            Explore Manga
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full px-6 md:px-12 pb-16 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-white">
          {/* Brand Info */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={0}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold tracking-wide">Aichiow</h2>
            <p className="text-sm text-neutral-400">
              Your anime universe — discover trending shows, top studios, and iconic characters.
            </p>
          </motion.div>

          {/* Nav */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={1}
            viewport={{ once: true }}
            className="space-y-2 text-sm"
          >
            <h3 className="font-semibold">Explore</h3>
            <ul className="space-y-1">
              <li><Link href="/explore" className="hover:text-primary transition">All Anime</Link></li>
              <li><Link href="/genre" className="hover:text-primary transition">Genres</Link></li>
              <li><Link href="/studios" className="hover:text-primary transition">Studios</Link></li>
              <li><Link href="/characters" className="hover:text-primary transition">Characters</Link></li>
            </ul>
          </motion.div>

          {/* Socials */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={2}
            viewport={{ once: true }}
            className="space-y-2 text-sm"
          >
            <h3 className="font-semibold">Follow Us</h3>
            <div className="flex gap-4 text-xl mt-2">
              <motion.a
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.3 }}
                className="hover:text-[#5865F2] transition"
              >
                <FaDiscord />
              </motion.a>
              <motion.a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.3 }}
                className="hover:text-[#FF0000] transition"
              >
                <FaYoutube />
              </motion.a>
              <motion.a
                href="https://tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.3 }}
                className="hover:text-[#69C9D0] transition"
              >
                <FaTiktok />
              </motion.a>
              <motion.a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.3 }}
                className="hover:text-[#E1306C] transition"
              >
                <FaInstagram />
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={3}
          viewport={{ once: true }}
          className="mt-12 text-center text-neutral-500 text-xs border-t border-white/5 pt-6"
        >
          © {new Date().getFullYear()} Aichiow. Built with passion for anime lovers.
        </motion.div>
      </footer>

      {/* background layer (optional nebula particles later) */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />
    </section>
  )
}
