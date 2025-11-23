'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Info } from 'lucide-react'
import { FaGithub, FaTiktok } from 'react-icons/fa'

export default function UpdateModal() {
  const [step, setStep] = useState<'notice' | 'update' | null>(null)
  const [lang, setLang] = useState<'en' | 'id'>('en')
  const VERSION = '1.2.0'

  useEffect(() => {
    const seenVersion = localStorage.getItem('updateModalSeen')
    if (seenVersion !== VERSION) {
      setStep('notice')
      localStorage.setItem('updateModalSeen', VERSION)
    }
  }, [])

  const handleClose = () => setStep(null)
  const handleNext = () => setStep(step === 'notice' ? 'update' : null)

  const t = {
    en: {
      update: {
        title: 'Updates',
        updates: [
          'Integration of Aichixia into the community.',
          'Profile UI redesigned to be more modern and responsive.',
          'New feature: Anime Scanning powered by smart technology.',
        ],
        close: 'Close',
      },
      notice: {
        title: 'Announcements',
        notices: [
          'Some features are still in beta testing.',
          'If you find any issues, report them via social media below.',
          'Thank you for using Aichiow.',
        ],
        next: 'View Updates',
      },
    },
    id: {
      update: {
        title: 'Pembaruan',
        updates: [
          'Integrasi Aichixia ke komunitas.',
          'Pembaruan tampilan profil menjadi lebih modern dan responsif.',
          'Fitur baru: Anime Scanning dengan teknologi cerdas.',
        ],
        close: 'Tutup',
      },
      notice: {
        title: 'Pemberitahuan',
        notices: [
          'Beberapa fitur masih dalam tahap pengujian beta.',
          'Jika menemukan bug, laporkan melalui media sosial di bawah.',
          'Terima kasih telah menggunakan Aichiow.',
        ],
        next: 'Lihat Pembaruan',
      },
    },
  }

  return (
    <AnimatePresence>
      {step && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4"
          onClick={handleClose}
        >
          {step === 'notice' && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 20 }}
              className="relative w-full max-w-md md:max-w-xl bg-gradient-to-b from-black via-sky-950 to-black border border-sky-800/40 rounded-3xl shadow-[0_0_60px_-10px_rgba(56,189,248,0.6)] text-neutral-100 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-5 border-b border-sky-800/40 bg-sky-950/30">
                <h2 className="text-lg md:text-2xl font-bold flex items-center gap-2 text-sky-400">
                  <Info className="w-6 h-6" />
                  {t[lang].notice.title}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-sky-900/40 rounded-full transition-all"
                >
                  <X className="w-5 h-5 text-sky-300" />
                </button>
              </div>

              <div className="flex justify-center mt-4">
                <div
                  className="relative flex items-center w-28 bg-sky-900/40 rounded-full p-1 cursor-pointer"
                  onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
                >
                  <motion.div
                    layout
                    className={`absolute w-1/2 h-6 bg-sky-500 rounded-full transition-all ${
                      lang === 'en' ? 'left-0' : 'left-1/2'
                    }`}
                  />
                  <span
                    className={`z-10 w-1/2 text-center text-xs font-semibold ${
                      lang === 'en' ? 'text-black' : 'text-sky-300'
                    }`}
                  >
                    EN
                  </span>
                  <span
                    className={`z-10 w-1/2 text-center text-xs font-semibold ${
                      lang === 'id' ? 'text-black' : 'text-sky-300'
                    }`}
                  >
                    ID
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-5 text-sm md:text-base max-h-[60vh] overflow-y-auto">
                <ul className="list-disc pl-5 space-y-2 text-sky-100/90">
                  {t[lang].notice.notices.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 border-t border-sky-800/40 flex items-center justify-between bg-sky-950/20">
                <div className="flex gap-4 items-center">
                  <a
                    href="https://github.com/Takawell/Aichiow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 transition-all"
                  >
                    <FaGithub className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@putrawangyyy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 transition-all"
                  >
                    <FaTiktok className="w-6 h-6" />
                  </a>
                </div>
                <button
                  onClick={handleNext}
                  className="bg-sky-500 hover:bg-sky-600 text-black px-6 py-2 rounded-full font-semibold transition-all shadow-lg"
                >
                  {t[lang].notice.next}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'update' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
              className="relative w-full max-w-md md:max-w-xl bg-gradient-to-br from-sky-950 via-black to-neutral-950 border border-sky-700/40 rounded-3xl shadow-[0_0_50px_-10px_rgba(56,189,248,0.5)] text-neutral-100 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-5 border-b border-sky-800/40 bg-sky-950/30">
                <h2 className="text-lg md:text-2xl font-bold flex items-center gap-2 text-sky-400">
                  <Bell className="w-6 h-6" />
                  {t[lang].update.title}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-sky-900/40 rounded-full transition-all"
                >
                  <X className="w-5 h-5 text-sky-300" />
                </button>
              </div>

              <div className="p-6 space-y-5 text-sm md:text-base max-h-[60vh] overflow-y-auto">
                <ul className="list-disc pl-5 space-y-2 text-sky-100/90">
                  {t[lang].update.updates.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 border-t border-sky-800/40 flex justify-end bg-sky-950/20">
                <button
                  onClick={handleClose}
                  className="bg-sky-500 hover:bg-sky-600 text-black px-6 py-2 rounded-full font-semibold transition-all shadow-lg"
                >
                  {t[lang].update.close}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
