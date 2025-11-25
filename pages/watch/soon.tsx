import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTiktok, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa'
import { Wrench, Sparkles, Zap, Shield, Home, Globe } from 'lucide-react'

export default function ComingSoonPage() {
  const [lang, setLang] = useState<'ID' | 'EN'>('EN')

  const content = {
    ID: {
      title: 'Fitur Streaming Sedang Dikembangkan',
      intro: 'Aichiow sedang merancang pengalaman streaming generasi berikutnya — cepat, bersih, dan sepenuhnya legal.',
      respect: 'Tidak seperti platform yang hanya menyalin konten tanpa izin, kami membangun ekosistem yang menghormati kreator, menjaga kualitas, dan menghadirkan kenyamanan terbaik bagi komunitas anime.',
      vision: 'Ini adalah bagian dari visi besar kami: Menciptakan satu rumah utama bagi penikmat anime di seluruh dunia.',
      patience: 'Mohon bersabar. Kami sedang menguji, menyempurnakan, dan menyiapkan sesuatu yang belum pernah ada sebelumnya.',
      tagline: 'Aichiow bukan sekadar streaming — ini adalah standar baru.',
      features: [
        { icon: Zap, text: 'Streaming Ultra-Cepat' },
        { icon: Shield, text: 'Legal & Aman' },
        { icon: Sparkles, text: 'Kualitas Premium' }
      ]
    },
    EN: {
      title: 'Streaming Feature Under Development',
      intro: 'Aichiow is building the next-generation streaming experience: fast, clean, and fully legal.',
      respect: "Unlike platforms that simply scrape content without permission, we're creating an ecosystem that respects creators, preserves quality, and delivers true comfort for anime fans.",
      vision: "This is part of our bigger vision: To build the ultimate home for anime lovers worldwide.",
      patience: "Please be patient. We're testing, refining, and preparing something the anime world hasn't seen before.",
      tagline: "Aichiow is not just streaming — it's a new standard.",
      features: [
        { icon: Zap, text: 'Ultra-Fast Streaming' },
        { icon: Shield, text: 'Legal & Secure' },
        { icon: Sparkles, text: 'Premium Quality' }
      ]
    },
  }

  const currentContent = content[lang]

  return (
    <>
      <Head>
        <title>Coming Soon | Aichiow</title>
      </Head>
      <main className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white min-h-screen flex flex-col items-center justify-center px-4 py-8 md:px-6 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwYjk1ZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTQtMS43OS00LTQtNC00IDEuNzktNCA0em0wIDI4YzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTQtMS43OS00LTQtNC00IDEuNzktNCA0ek0xNiAzNmMwIDIuMjEgMS43OSA0IDQgNHM0LTEuNzkgNC00LTEuNzktNC00LTQtNCAxLjc5LTQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

        <motion.div
          className="absolute top-0 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-sky-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-blue-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 max-w-5xl w-full space-y-8 md:space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center space-y-4"
          >
            <motion.div
              className="inline-flex items-center gap-3 bg-gradient-to-r from-sky-500/20 to-blue-600/20 backdrop-blur-xl px-6 py-3 rounded-full border border-sky-500/30"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(14, 165, 233, 0.3)',
                  '0 0 40px rgba(14, 165, 233, 0.5)',
                  '0 0 20px rgba(14, 165, 233, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wrench className="w-5 h-5 text-sky-400" />
              <span className="text-sm md:text-base font-semibold text-sky-300">In Development</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-purple-500">
              COMING SOON
            </h1>
          </motion.div>

          <motion.div
            className="flex justify-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {['ID', 'EN'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setLang(tab as 'ID' | 'EN')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm md:text-base flex items-center gap-2 ${
                  lang === tab
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                }`}
              >
                <Globe className="w-4 h-4" />
                {tab}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={lang}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-sky-500/20 shadow-2xl">
                <div className="space-y-6 text-slate-300 leading-relaxed">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-2 h-2 mt-2 rounded-full bg-sky-400 flex-shrink-0"></div>
                    <p className="text-lg md:text-xl text-white font-semibold">{currentContent.title}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-400 flex-shrink-0"></div>
                    <p className="text-base md:text-lg">{currentContent.intro}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-2 h-2 mt-2 rounded-full bg-sky-400 flex-shrink-0"></div>
                    <p className="text-base md:text-lg">{currentContent.respect}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-2 h-2 mt-2 rounded-full bg-purple-400 flex-shrink-0"></div>
                    <p className="text-base md:text-lg">{currentContent.vision}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-400 flex-shrink-0"></div>
                    <p className="text-base md:text-lg">{currentContent.patience}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="pt-4 border-t border-slate-700/50"
                  >
                    <p className="text-sm md:text-base italic text-slate-400">{currentContent.tagline}</p>
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {currentContent.features.map((feature, idx) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + idx * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-sky-500/20 text-center"
                    >
                      <div className="w-12 h-12 mx-auto mb-3 bg-sky-500/20 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-sky-400" />
                      </div>
                      <p className="text-white font-semibold">{feature.text}</p>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white">Connect with Us</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { icon: <FaTiktok />, url: 'https://tiktok.com/@putrawangyyy', color: 'from-pink-500 to-rose-600', hover: 'hover:shadow-pink-500/30' },
                { icon: <FaYoutube />, url: 'https://youtube.com/@Takashinnn', color: 'from-red-500 to-red-600', hover: 'hover:shadow-red-500/30' },
                { icon: <FaInstagram />, url: 'https://instagram.com/putrasenpaiii', color: 'from-purple-500 to-pink-500', hover: 'hover:shadow-purple-500/30' },
                { icon: <FaGithub />, url: 'https://github.com/Takawell/Aichiow', color: 'from-slate-700 to-slate-900', hover: 'hover:shadow-slate-500/30' }
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + idx * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${social.color} text-white text-3xl md:text-4xl shadow-lg ${social.hover} transition-all`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center pt-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Link
              href="/home"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-2xl font-bold text-lg shadow-lg shadow-sky-500/30 transition-all hover:shadow-sky-500/50 hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  )
}
