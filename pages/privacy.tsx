'use client'

import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PrivacyPage() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN')
  const [open, setOpen] = useState<number | null>(null)

  const toggle = (i: number) => {
    setOpen(open === i ? null : i)
  }

  const sections = {
    EN: [
      {
        title: '1. Information We Collect',
        content:
          'We collect basic information such as your email, username, and preferences to improve your Aichiow experience. We do not sell or misuse your personal data.'
      },
      {
        title: '2. Use of Cookies',
        content:
          'Aichiow uses cookies to enhance navigation, save preferences, and analyze site usage for better performance.'
      },
      {
        title: '3. Third-Party Services',
        content:
          'Our platform integrates with trusted third-party APIs (e.g., AniList, MangaDex). These services have their own privacy policies that you should review.'
      },
      {
        title: '4. Data Security',
        content:
          'We take appropriate security measures to protect your data. However, no system is 100% secure, and users should also take precautions.'
      },
      {
        title: '5. Changes to Policy',
        content:
          'Aichiow may update this Privacy Policy from time to time. Updates will be posted on this page with the effective date.'
      }
    ],
    ID: [
      {
        title: '1. Informasi yang Kami Kumpulkan',
        content:
          'Kami mengumpulkan informasi dasar seperti email, nama pengguna, dan preferensi untuk meningkatkan pengalaman Anda di Aichiow. Kami tidak menjual atau menyalahgunakan data pribadi Anda.'
      },
      {
        title: '2. Penggunaan Cookies',
        content:
          'Aichiow menggunakan cookies untuk meningkatkan navigasi, menyimpan preferensi, dan menganalisis penggunaan situs agar lebih optimal.'
      },
      {
        title: '3. Layanan Pihak Ketiga',
        content:
          'Platform kami terintegrasi dengan API pihak ketiga terpercaya (misalnya AniList, MangaDex). Layanan tersebut memiliki kebijakan privasi masing-masing yang sebaiknya Anda tinjau.'
      },
      {
        title: '4. Keamanan Data',
        content:
          'Kami mengambil langkah-langkah keamanan yang tepat untuk melindungi data Anda. Namun, tidak ada sistem yang 100% aman, sehingga pengguna juga harus berhati-hati.'
      },
      {
        title: '5. Perubahan Kebijakan',
        content:
          'Aichiow dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Pembaruan akan dipublikasikan di halaman ini dengan tanggal efektif.'
      }
    ]
  }

  return (
    <>
      <Head>
        <title>Aichiow – Privacy Policy</title>
      </Head>

      <main className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-black to-black" />
        <div className="relative z-20 max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/home" className="font-bold text-lg">Aichiow Plus</Link>
          <motion.button
            onClick={() => setLang(lang === 'EN' ? 'ID' : 'EN')}
            whileTap={{ scale: 0.9 }}
            className="relative w-20 h-9 flex items-center bg-gray-800 rounded-full px-1 cursor-pointer overflow-hidden border border-gray-700"
          >
            <motion.div
              layout
              className="absolute top-1 left-1 w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 shadow-lg"
              animate={{ x: lang === 'EN' ? 0 : 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
            <span className="flex-1 text-center text-xs">EN</span>
            <span className="flex-1 text-center text-xs">ID</span>
          </motion.button>
        </div>

        <section className="relative z-10 text-center py-16 sm:py-24">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          >
            {lang === 'EN' ? 'Privacy Policy' : 'Kebijakan Privasi'}
          </motion.h1>
          <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
            {lang === 'EN'
              ? 'We value your privacy. Learn how Aichiow collects, uses, and protects your information.'
              : 'Kami menghargai privasi Anda. Pelajari bagaimana Aichiow mengumpulkan, menggunakan, dan melindungi informasi Anda.'}
          </p>
        </section>

        <section className="relative z-10 max-w-3xl mx-auto px-6 py-12">
          <div className="space-y-4">
            {sections[lang].map((s, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/5 border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left font-medium hover:bg-white/10 transition"
                >
                  <span>{s.title}</span>
                  <span>{open === i ? '-' : '+'}</span>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4 text-gray-300 text-sm"
                    >
                      {s.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <footer className="relative z-10 text-center text-sm text-gray-400 py-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6" />
          © {new Date().getFullYear()} Aichiow Plus. All rights reserved.
        </footer>
      </main>
    </>
  )
}
