import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaTiktok, FaDiscord, FaEnvelope, FaCode, FaVideo, FaRocket, FaShieldAlt } from 'react-icons/fa'

export default function ComingSoonPage() {
  const [lang, setLang] = useState('EN')

  const content = {
    ID: (
      <>
        <p className="text-xl text-sky-200 font-light">
          <FaRocket className="inline mr-2" />
          <span className="text-sky-400 font-semibold">Fitur Streaming Sedang Dikembangkan</span>
        </p>
        <p>
          Aichiow sedang merancang{' '}
          <span className="text-sky-400 font-semibold">pengalaman streaming generasi berikutnya</span> cepat, bersih, dan sepenuhnya legal.
        </p>
        <p>
          Tidak seperti platform yang hanya menyalin konten tanpa izin, kami membangun ekosistem yang{' '}
          <span className="text-sky-300 font-semibold">menghormati kreator</span>, menjaga kualitas, dan menghadirkan kenyamanan terbaik bagi komunitas anime.
        </p>
        <p>
          <FaShieldAlt className="inline mr-2 text-sky-400" />
          Ini adalah bagian dari visi besar kami: Menciptakan{' '}
          <span className="text-sky-300 font-semibold">satu rumah utama</span> bagi penikmat anime di seluruh dunia.
        </p>
        <p>
          <FaCode className="inline mr-2 text-sky-400" />
          Mohon bersabar. Kami sedang menguji, menyempurnakan, dan menyiapkan sesuatu yang belum pernah ada sebelumnya.
        </p>
        <p className="italic text-gray-400 text-sm">
          Aichiow bukan sekadar streaming - ini adalah standar baru.
        </p>
      </>
    ),
    EN: (
      <>
        <p className="text-xl text-sky-200 font-light">
          <FaRocket className="inline mr-2" />
          <span className="text-sky-400 font-semibold">Streaming Feature Under Development</span>
        </p>
        <p>
          Aichiow is building the{' '}
          <span className="text-sky-400 font-semibold">next-generation streaming experience</span>: fast, clean, and fully legal.
        </p>
        <p>
          Unlike platforms that simply scrape content without permission, we're creating an ecosystem that{' '}
          <span className="text-sky-300 font-semibold">respects creators</span>, preserves quality, and delivers true comfort for anime fans.
        </p>
        <p>
          <FaShieldAlt className="inline mr-2 text-sky-400" />
          This is part of our bigger vision: To build{' '}
          <span className="text-sky-300 font-semibold">the ultimate home</span> for anime lovers worldwide.
        </p>
        <p>
          <FaCode className="inline mr-2 text-sky-400" />
          Please be patient. We're testing, refining, and preparing something the anime world hasn't seen before.
        </p>
        <p className="italic text-gray-400 text-sm">
          Aichiow is not just streaming - it's a new standard.
        </p>
      </>
    ),
  }

  return (
    <main className="relative bg-gradient-to-br from-black via-gray-950 to-black text-white min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1)_0%,transparent_50%)] pointer-events-none"></div>
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(56,189,248,0.4), 0 0 40px rgba(56,189,248,0.2); }
          50% { box-shadow: 0 0 40px rgba(56,189,248,0.6), 0 0 60px rgba(56,189,248,0.3); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .float-animation { animation: float 6s ease-in-out infinite; }
        .glow-animation { animation: glow 3s ease-in-out infinite; }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        .text-glow {
          text-shadow: 0 0 10px rgba(56,189,248,0.5), 0 0 20px rgba(56,189,248,0.3), 0 0 30px rgba(56,189,248,0.2);
        }
        .grid-pattern {
          background-image: 
            linear-gradient(rgba(56,189,248,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
      
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-30"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative z-10 mb-8 float-animation"
      >
        <div className="relative">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 text-glow mb-2">
            COMING SOON
          </h1>
          <div className="absolute inset-0 shimmer"></div>
        </div>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-sky-400 to-transparent rounded-full glow-animation"></div>
      </motion.div>

      <motion.div
        className="flex gap-3 mb-10 bg-black/60 backdrop-blur-md rounded-full px-2 py-2 shadow-[0_0_30px_rgba(56,189,248,0.2)] border border-sky-500/20 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {['ID', 'EN'].map((tab) => (
          <button
            key={tab}
            onClick={() => setLang(tab)}
            className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 text-sm sm:text-base ${
              lang === tab
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-[0_0_20px_rgba(56,189,248,0.5)] scale-105'
                : 'text-sky-300 hover:bg-sky-500/10 hover:text-sky-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={lang}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl text-gray-300 leading-relaxed text-base sm:text-lg space-y-6 mb-12 bg-black/40 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-3xl border border-sky-500/10 shadow-[0_0_50px_rgba(56,189,248,0.1)] relative z-10"
        >
          {content[lang]}
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-8 relative z-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-sky-300 text-glow flex items-center justify-center gap-2">
          <FaVideo className="text-sky-400" />
          Connect with Us
        </h2>
        <motion.div
          className="flex flex-wrap gap-4 sm:gap-5 justify-center text-3xl sm:text-4xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          {[
            { icon: <FaGithub />, url: 'https://github.com/aichiow', color: 'hover:bg-gray-700', glow: 'hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]' },
            { icon: <FaTiktok />, url: 'https://tiktok.com/@aichiow', color: 'hover:bg-sky-500', glow: 'hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]' },
          ].map((social, idx) => (
            <motion.a
              key={idx}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className={`p-5 sm:p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-sky-500/20 ${social.color} ${social.glow} transition-all duration-300`}
            >
              {social.icon}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-12 sm:mt-16 relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <a
          href="/home"
          className="group inline-block relative px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-2xl font-bold text-base sm:text-lg shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all duration-300 transform hover:scale-105 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <FaRocket className="group-hover:translate-x-1 transition-transform" />
            Back to Home
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-12 text-gray-500 text-sm relative z-10"
      >
        <p className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></span>
          Building the future of anime streaming
        </p>
      </motion.div>
    </main>
  )
}
