'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
}

export default function CTACommunityFooter() {
  return (
    <section className="w-full mt-24 bg-gradient-to-br from-[#0f0f10] via-[#16171a] to-[#0a0a0a] rounded-t-3xl overflow-hidden relative border-t border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ffffff0b] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-24 text-center relative z-10">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={0}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-primary to-white text-transparent bg-clip-text"
        >
          Dive into your dream world
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={1}
          viewport={{ once: true }}
          className="text-neutral-400 mt-6 max-w-2xl mx-auto text-base md:text-lg"
        >
          Discover anime, manga, manhwa & light novels — all in one epic platform built for you.
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
            href="/manga"
            className="bg-gradient-to-tr from-primary to-purple-600 hover:brightness-110 text-white font-semibold px-6 py-3 rounded-full transition-all shadow-md shadow-primary/30"
          >
            Explore Manga
          </Link>
          <Link
            href="/manhwa"
            className="border border-white/20 hover:bg-white/10 text-white px-6 py-3 rounded-full transition-all"
          >
            Explore Manhwa
          </Link>
        </motion.div>
      </div>

      <footer className="w-full px-6 md:px-12 pb-16 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-white">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={0}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold tracking-wide">Aichiow Plus</h2>
            <p className="text-sm text-neutral-400">
              Uniting otakus worldwide anime & beyond.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={1}
            viewport={{ once: true }}
            className="text-sm"
          >
            <h3 className="font-semibold mb-2">Explore</h3>
            <ul className="space-y-1">
              <li><Link href="/explore" className="hover:text-primary transition">All Anime</Link></li>
              <li><Link href="/upcoming" className="hover:text-primary transition">Schedule</Link></li>
              <li><Link href="/manga" className="hover:text-primary transition">Manga</Link></li>
              <li><Link href="/light-novel" className="hover:text-primary transition">Light Novel</Link></li>
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={2}
            viewport={{ once: true }}
            className="text-sm"
          >
            <h3 className="font-semibold mb-2">Platform</h3>
            <ul className="space-y-1">
              <li><Link href="/auth/register" className="hover:text-primary transition">Sign Up</Link></li>
              <li><Link href="/community" className="hover:text-primary transition">Community</Link></li>
              <li><Link href="/status" className="hover:text-primary transition">Status Server</Link></li>
              <li><Link href="/API" className="hover:text-primary transition">API for Developers</Link></li>
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={3}
            viewport={{ once: true }}
            className="text-sm"
          >
            <h3 className="font-semibold mb-2">Follow Us</h3>
            <div className="flex gap-5 text-2xl mt-3">
              <motion.a
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="hover:text-[#5865F2] transition"
              >
                <FaDiscord />
              </motion.a>
              <motion.a
                href="https://youtube.com/TakaDevelopment"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="hover:text-[#FF0000] transition"
              >
                <FaYoutube />
              </motion.a>
              <motion.a
                href="https://tiktok.com/@putrawangyyy"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="hover:text-[#69C9D0] transition"
              >
                <FaTiktok />
              </motion.a>
              <motion.a
                href="https://instagram.com/putrasenpaiii"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
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
          custom={4}
          viewport={{ once: true }}
          className="mt-12 border-t border-white/5"
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={5}
          viewport={{ once: true }}
          className="mt-6 text-center text-neutral-500 text-xs flex flex-col md:flex-row justify-center gap-4"
        >
          <span>© {new Date().getFullYear()} Aichiow Plus. All Rights Reserved.</span>
        </motion.div>
      </footer>
    </section>
  )
}
