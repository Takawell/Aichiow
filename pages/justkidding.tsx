import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaDiscord, FaWhatsapp, FaTiktok, FaInstagram, FaYoutube } from 'react-icons/fa'

export default function JustKiddingPage() {
  const [lang, setLang] = useState<'ID' | 'EN'>('ID')

  const content = {
    ID: (
      <>
        <p className="text-xl text-gray-200 font-light">
          Santai, ini hanya bercanda! <span className="text-primary font-semibold">Aichiow</span> 
          adalah platform yang dirancang untuk menghadirkan informasi anime paling terbaru, 
          rekomendasi menarik, serta penjelasan mendalam tentang dunia animasi yang kamu cintai. 
          Kami ingin semua orang bisa menikmati pengalaman anime dengan cara yang aman, legal, dan nyaman.
        </p>
        <p>
          Kami <span className="text-red-400 font-semibold">tidak pernah</span> mendukung penyebaran 
          konten ilegal karena kami percaya bahwa mendukung kreator dan studio adalah kunci utama 
          agar industri ini terus berkembang. Jangan khawatir, Aichiow ada di sini untuk memberi 
          kamu inspirasi, daftar rekomendasi, serta update dunia anime tanpa harus melanggar aturan.
        </p>
        <p>
          Kami mengutamakan kenyamanan pengguna dengan antarmuka yang interaktif, desain modern, 
          dan konten informatif. Tidak peduli kamu penggemar anime lama atau baru, 
          kami siap menjadi teman terbaikmu untuk mengenal dunia anime lebih dalam.
        </p>
      </>
    ),
    EN: (
      <>
        <p className="text-xl text-gray-200 font-light">
          Relax, this is just for fun! <span className="text-primary font-semibold">Aichiow</span> 
          is a platform designed to bring the latest anime information, exciting recommendations, 
          and in-depth insights into the animation world you love. 
          We aim to create a safe, legal, and enjoyable experience for every anime enthusiast.
        </p>
        <p>
          We <span className="text-red-400 font-semibold">never</span> support illegal content because 
          we believe supporting creators and studios is the key to keeping this industry alive. 
          Aichiow is here to inspire you, give curated recommendations, and keep you updated 
          without breaking any rules.
        </p>
        <p>
          With an interactive interface, modern design, and rich content, 
          we strive to provide the ultimate experience for both new and veteran anime fans. 
          Whether you’re exploring anime for the first time or deepening your passion, 
          we’ve got your back.
        </p>
      </>
    ),
  }

  return (
    <>
      <Head>
        <title>Just Kidding | Aichiow</title>
      </Head>
      <main className="bg-gradient-to-br from-black via-gray-900 to-black text-white min-h-screen flex flex-col items-center justify-center text-center px-6 py-12 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_80%)] pointer-events-none"></div>
        
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow-[0_0_25px_rgba(255,0,255,0.7)] animate-pulse mb-6 hover:scale-110 transition-transform"
        >
          Just Kidding!
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

        {/* Description with AnimatePresence */}
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

        {/* Button to Home */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-lg shadow-[0_0_15px_rgba(255,0,255,0.6)] transition-transform transform hover:scale-110"
          >
            BACK TO HOME
          </Link>
        </motion.div>
      </main>
    </>
  )
}
