import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaDiscord, FaWhatsapp, FaTiktok, FaInstagram, FaYoutube } from 'react-icons/fa'

export default function JustKiddingPage() {
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
          className="text-5xl md:text-6xl font-extrabold text-primary drop-shadow-lg mb-6"
        >
          🤭 Just Kidding!
        </motion.h1>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-2xl text-gray-300 leading-relaxed text-lg space-y-5 mb-8"
        >
          <p className="text-xl text-gray-200 font-light">
            Tenang, ini cuma prank! <span className="text-primary font-semibold">Aichiow</span> adalah situs 
            <span className="text-primary font-semibold"> legal </span> yang fokus pada informasi anime, rekomendasi, dan data dari 
            <span className="text-primary font-semibold"> AniList</span>.
          </p>
          <p>
            Kami <span className="text-red-400 font-semibold">TIDAK</span> menyediakan streaming ilegal.  
            Ingin nonton? Pakailah platform resmi seperti 
            <span className="text-primary"> Crunchyroll</span>, <span className="text-primary">Netflix</span>, 
            atau <span className="text-primary">Bstation</span> untuk mendukung industri anime kesayangan kita.
          </p>
        </motion.div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10"
        >
          <h2 className="text-2xl font-bold mb-4">Ikuti Kami di Sosial Media</h2>
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
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-primary hover:bg-primary/80 rounded-xl font-bold text-lg shadow-lg transition-transform transform hover:scale-105"
          >
            🚀 Kembali ke Beranda
          </Link>
        </motion.div>
      </main>
    </>
  )
}
