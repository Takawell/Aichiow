'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell } from 'lucide-react'
import { FaGithub, FaTiktok } from 'react-icons/fa'

export default function UpdateModal() {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState<'id' | 'en'>('id')
  const VERSION = '1.2.0'

  useEffect(() => {
    const seenVersion = localStorage.getItem('updateModalSeen')
    if (seenVersion !== VERSION) {
      setOpen(true)
      localStorage.setItem('updateModalSeen', VERSION)
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
    localStorage.setItem('updateModalSeen', VERSION)
  }

  const t = {
    id: {
      title: 'Pembaruan & Pemberitahuan',
      updatesTitle: '✨ Pembaruan Terbaru',
      noticesTitle: '📢 Pemberitahuan',
      updates: [
        'Penambahan halaman Explore baru untuk anime & manga.',
        'Menambahkan fitur baru seperti ai asisten dan anime scan.',
        'UI diperbarui agar lebih halus dan responsif di mobile.',
      ],
      notices: [
        'Beberapa fitur masih dalam tahap pengujian beta.',
        'Jika menemukan bug, laporkan melalui sosmed dibawah.',
        'Terima kasih sudah menggunakan Aichiow 💗',
      ],
      close: 'Tutup',
    },
    en: {
      title: 'Updates & Announcements',
      updatesTitle: '✨ Latest Updates',
      noticesTitle: '📢 Announcements',
      updates: [
        'Added new Explore page for anime & manga.',
        'Added new features like ai assistant and anime scan.',
        'Updated UI for smoother and more responsive mobile experience.',
      ],
      notices: [
        'Some features are still in beta testing.',
        'If you find a bug, report it via social media below.',
        'Thank you for using Aichiow 💗',
      ],
      close: 'Close',
    },
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative w-full max-w-lg bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 rounded-2xl shadow-2xl text-neutral-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-neutral-800">
              <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-sky-400" />
                {t[lang].title}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-neutral-800 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-3">
              <div
                className="relative flex items-center w-24 bg-neutral-800 rounded-full p-1 cursor-pointer"
                onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              >
                <motion.div
                  layout
                  className={`absolute w-1/2 h-6 bg-sky-500 rounded-full transition-all ${
                    lang === 'id' ? 'left-0' : 'left-1/2'
                  }`}
                />
                <span
                  className={`z-10 w-1/2 text-center text-xs font-semibold ${
                    lang === 'id' ? 'text-black' : 'text-neutral-400'
                  }`}
                >
                  ID
                </span>
                <span
                  className={`z-10 w-1/2 text-center text-xs font-semibold ${
                    lang === 'en' ? 'text-black' : 'text-neutral-400'
                  }`}
                >
                  EN
                </span>
              </div>
            </div>

            <div className="p-5 space-y-5 text-sm md:text-base max-h-[70vh] overflow-y-auto">
              <div>
                <h3 className="font-semibold text-sky-400 mb-2">
                  {t[lang].updatesTitle}
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {t[lang].updates.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-sky-400 mb-2">
                  {t[lang].noticesTitle}
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {t[lang].notices.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-800 flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <a
                  href="https://github.com/Takawell/Aichiow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-sky-400 transition-all"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@putrawangyyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-sky-400 transition-all"
                >
                  <FaTiktok className="w-5 h-5" />
                </a>
              </div>

              <button
                onClick={handleClose}
                className="bg-sky-500 hover:bg-sky-600 text-black px-5 py-2 rounded-full font-semibold transition-all"
              >
                {t[lang].close}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
