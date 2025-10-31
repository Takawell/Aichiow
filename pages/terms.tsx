'use client'

import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TermsPage() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN')
  const [open, setOpen] = useState<number | null>(null)

  const toggle = (i: number) => {
    setOpen(open === i ? null : i)
  }

  const sections = {
    EN: [
      {
        title: '1. Acceptance of Terms',
        content:
          'By accessing or using Aichiow, you agree to be bound by these Terms of Service. If you do not agree, please refrain from using the platform.'
      },
      {
        title: '2. Use of Content',
        content:
          'All anime, manga, manhwa, and light novel data are provided through trusted APIs. Aichiow does not host copyrighted content but provides access to third-party information.'
      },
      {
        title: '3. User Responsibilities',
        content:
          'Users agree to use Aichiow responsibly, avoid spamming, and respect other members of the community.'
      },
      {
        title: '4. Changes to Terms',
        content:
          'Aichiow reserves the right to modify these Terms at any time. Updates will be communicated on this page.'
      }
    ],
    ID: [
      {
        title: '1. Penerimaan Syarat',
        content:
          'Dengan mengakses atau menggunakan Aichiow, Anda setuju untuk terikat oleh Ketentuan Layanan ini. Jika tidak setuju, mohon untuk tidak menggunakan platform.'
      },
      {
        title: '2. Penggunaan Konten',
        content:
          'Semua data anime, manga, manhwa, dan light novel disediakan melalui API terpercaya. Aichiow tidak meng-host konten berhak cipta, hanya menyediakan akses ke informasi pihak ketiga.'
      },
      {
        title: '3. Tanggung Jawab Pengguna',
        content:
          'Pengguna setuju menggunakan Aichiow secara bertanggung jawab, tidak melakukan spam, dan menghormati anggota komunitas lain.'
      },
      {
        title: '4. Perubahan Syarat',
        content:
          'Aichiow berhak mengubah Ketentuan ini kapan saja. Pembaruan akan diumumkan di halaman ini.'
      }
    ]
  }

  return (
    <>
      <Head>
        <title>Aichiow – Terms of Service</title>
      </Head>

      <main className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-700/30 via-black to-black" />

        <div className="relative z-20 max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/home" className="font-bold text-lg text-sky-400">Home</Link>
          <motion.button
            onClick={() => setLang(lang === 'EN' ? 'ID' : 'EN')}
            whileTap={{ scale: 0.9 }}
            className="relative w-20 h-9 flex items-center bg-sky-900/60 rounded-full px-1 cursor-pointer overflow-hidden border border-sky-700"
          >
            <motion.div
              layout
              className="absolute top-1 left-1 w-7 h-7 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 shadow-lg"
              animate={{ x: lang === 'EN' ? 0 : 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
            <span className="flex-1 text-center text-xs text-white">EN</span>
            <span className="flex-1 text-center text-xs text-white">ID</span>
          </motion.button>
        </div>

        <section className="relative z-10 text-center py-16 sm:py-24">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 drop-shadow-lg"
          >
            {lang === 'EN' ? 'Terms of Service' : 'Ketentuan Layanan'}
          </motion.h1>
          <p className="mt-6 text-sky-200 max-w-2xl mx-auto">
            {lang === 'EN'
              ? 'Please read these terms carefully before using Aichiow.'
              : 'Harap baca ketentuan ini dengan cermat sebelum menggunakan Aichiow.'}
          </p>
        </section>

        <section className="relative z-10 max-w-3xl mx-auto px-6 py-12">
          <div className="space-y-4">
            {sections[lang].map((s, i) => (
              <div
                key={i}
                className="rounded-lg bg-sky-900/20 border border-sky-800 overflow-hidden shadow-md"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left font-medium hover:bg-sky-800/30 transition text-white"
                >
                  <span>{s.title}</span>
                  <span className="text-sky-400">{open === i ? '-' : '+'}</span>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4 text-sky-200 text-sm"
                    >
                      {s.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <footer className="relative z-10 text-center text-sm text-sky-300 py-8">
          <div className="h-px bg-gradient-to-r from-transparent via-sky-600 to-transparent mb-6" />
          © {new Date().getFullYear()} Aichiow Plus. All rights reserved.
        </footer>
      </main>
    </>
  )
}
