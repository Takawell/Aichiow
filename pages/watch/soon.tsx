import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaDiscord, FaWhatsapp, FaTiktok, FaInstagram, FaYoutube } from 'react-icons/fa'

export default function ComingSoonPage() {
  const [lang, setLang] = useState<'ID' | 'EN'>('EN')

  const content = {
    ID: (
      <>
        <p className="text-xl text-gray-200 font-light">
          🚧 <span className="text-primary font-semibold">Fitur Streaming Sedang Dikembangkan</span>
        </p>
        <p>
          Aichiow sedang merancang{' '}
          <span className="text-blue-400 font-semibold">pengalaman streaming generasi berikutnya</span> — cepat, bersih, dan sepenuhnya legal.
        </p>
        <p>
          Tidak seperti platform yang hanya menyalin konten tanpa izin, kami membangun ekosistem yang{' '}
          <span className="text-pink-400 font-semibold">menghormati kreator</span>, menjaga kualitas, dan menghadirkan kenyamanan terbaik bagi komunitas anime.
        </p>
        <p>
          💡 Ini adalah bagian dari visi besar kami: <br />
          Menciptakan <span className="text-yellow-400 font-semibold">satu rumah utama</span> bagi penikmat anime di seluruh dunia.
        </p>
        <p>
          🔧 Mohon bersabar. Kami sedang menguji, menyempurnakan, dan menyiapkan sesuatu yang belum pernah ada sebelumnya.
        </p>
        <p className="italic text-gray-400 text-sm">
          Aichiow bukan sekadar streaming — ini adalah standar baru.
        </p>
      </>
    ),
    EN: (
      <>
        <p className="text-xl text-gray-200 font-light">
          🚧 <span className="text-primary font-semibold">Streaming Feature Under Development</span>
        </p>
        <p>
          Aichiow is building the{' '}
          <span className="text-blue-400 font-semibold">next-generation streaming experience</span>: fast, clean, and fully legal.
        </p>
        <p>
          Unlike platforms that simply scrape content without permission, we’re creating an ecosystem that{' '}
          <span className="text-pink-400 font-semibold">respects creators</span>, preserves quality, and delivers true comfort for anime fans.
        </p>
        <p>
          💡 This is part of our bigger vision: <br />
          To build <span className="text-yellow-400 font-semibold">the ultimate home</span> for anime lovers worldwide.
        </p>
        <p>
          🔧 Please be patient. We’re testing, refining, and preparing something the anime world hasn’t seen before.
        </p>
        <p className="italic text-gray-400 text-sm">
          Aichiow is not just streaming — it’s a new standard.
        </p>
      </>
    ),
  }

  return (
    <>
      <Head>
        <title>Coming Soon | Aichiow</title>
      </Head>
      <main className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white min-h-screen flex flex-col items-center justify-center text-center px-6 py-12 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none animate-pulse"></div>

        {/* Shine Effect */}
        <style>{`
          .shine {
            position: relative;
            overflow: hidden;
          }
          .shine::after {
            content: "";
            position: absolute;
            top: 0;
            left: -75%;
            width: 50%;
            height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255,255,255,0.5), transparent);
            animation: shine 3s infinite;
          }
          @keyframes shine {
            0% { left: -75%; }
            100% { left: 125%; }
          }
          .glitch {
            position: relative;
          }
          .glitch::before, .glitch::after {
            content: attr(data-text);
            position: absolute;
            left: 0;
            width: 100%;
            background: transparent;
            overflow: hidden;
            clip: rect(0, 900px, 0, 0);
          }
          .glitch::before {
            animation: glitchTop 2s infinite linear alternate-reverse;
            color: #ff00ff;
          }
          .glitch::after {
            animation: glitchBottom 1.5s infinite linear alternate-reverse;
            color: #00ffff;
          }
          @keyframes glitchTop {
            0% { clip: rect(0, 9999px, 0, 0); }
            20% { clip: rect(0, 9999px, 100%, 0); transform: translate(-2px, -2px); }
            40% { clip: rect(0, 9999px, 0, 0); }
            60% { clip: rect(0, 9999px, 100%, 0); transform: translate(2px, -1px); }
            100% { clip: rect(0, 9999px, 0, 0); }
          }
          @keyframes glitchBottom {
            0% { clip: rect(0, 9999px, 0, 0); }
            20% { clip: rect(0, 9999px, 100%, 0); transform: translate(2px, 1px); }
            40% { clip: rect(0, 9999px, 0, 0); }
            60% { clip: rect(0, 9999px, 100%, 0); transform: translate(-1px, 2px); }
            100% { clip: rect(0, 9999px, 0, 0); }
          }
        `}</style>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          data-text="COMING SOON!"
          className="glitch shine text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-600 drop-shadow-[0_0_30px_rgba(255,0,255,0.6)] mb-6"
        >
          COMING SOON!
        </motion.h1>

        {/* Language Tabs */}
        <motion.div
          className="flex gap-4 mb-8 bg-neutral-900/70 rounded-full px-3 py-2 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {['ID', 'EN'].map((tab) => (
            <button
              key={tab}
              onClick={() => setLang(tab as 'ID' | 'EN')}
              className={`px-5 py-2 rounded-full font-bold transition text-sm md:text-base ${
                lang === tab
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-black shadow-[0_0_15px_rgba(0,200,255,0.7)]'
                  : 'hover:bg-neutral-700 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl text-gray-300 leading-relaxed text-lg space-y-5 mb-8"
          >
            {content[lang]}
          </motion.div>
        </AnimatePresence>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10"
        >
          <h2 className="text-2xl font-bold mb-4">Connect with Us</h2>
          <motion.div
            className="flex gap-5 justify-center text-3xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
          >
            {[
              { icon: <FaDiscord />, url: 'https://discord.com/aichiow', color: 'hover:bg-indigo-600' },
              { icon: <FaWhatsapp />, url: 'https://whatsapp.com/channel/0029Vb5lXCA1SWsyWyJbvW0q', color: 'hover:bg-green-500' },
              { icon: <FaTiktok />, url: 'https://tiktok.com/putrawangyyy', color: 'hover:bg-pink-500' },
              { icon: <FaInstagram />, url: 'https://instagram.com/putrasenpaiii', color: 'hover:bg-pink-400' },
              { icon: <FaYoutube />, url: 'https://youtube.com/@TakaDevelompent', color: 'hover:bg-red-500' }
            ].map((social, idx) => (
              <motion.a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`p-4 rounded-full bg-neutral-800 ${social.color} transition`}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Back to Home Button */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            href="/home"
            className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-lg shadow-[0_0_15px_rgba(255,0,255,0.6)] transition-transform transform hover:scale-110"
          >
            Back to home
          </Link>
        </motion.div>
      </main>
    </>
  )
}
