'use client'

import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaHeart, FaCoffee, FaGem, FaCrown, FaGlobe,
  FaPaypal, FaBitcoin, FaCreditCard, FaQrcode, FaTimes
} from 'react-icons/fa'

export default function DonatePage() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN')
  const [selectedTier, setSelectedTier] = useState<null | string>(null)

  const tiers = {
    EN: [
      { id: 'coffee', icon: <FaCoffee className="w-8 h-8 text-sky-400" />, title: 'Coffee Tier', amount: '$3', desc: 'A small gesture that keeps Aichiow awake and growing.' },
      { id: 'gem', icon: <FaGem className="w-8 h-8 text-sky-400" />, title: 'Gem Tier', amount: '$10', desc: 'Support our servers and help unlock new features.' },
      { id: 'crown', icon: <FaCrown className="w-8 h-8 text-sky-400" />, title: 'Crown Tier', amount: '$25', desc: 'Be a premium supporter and get early feature access.' },
      { id: 'galaxy', icon: <FaGlobe className="w-8 h-8 text-sky-400" />, title: 'Galaxy Tier', amount: '$50', desc: 'Become a legendary supporter with exclusive acknowledgments.' }
    ],
    ID: [
      { id: 'coffee', icon: <FaCoffee className="w-8 h-8 text-sky-400" />, title: 'Tingkat Kopi', amount: 'Rp45.000', desc: 'Dukungan kecil yang menjaga Aichiow tetap hidup dan berkembang.' },
      { id: 'gem', icon: <FaGem className="w-8 h-8 text-sky-400" />, title: 'Tingkat Permata', amount: 'Rp150.000', desc: 'Bantu biaya server dan pengembangan fitur baru.' },
      { id: 'crown', icon: <FaCrown className="w-8 h-8 text-sky-400" />, title: 'Tingkat Mahkota', amount: 'Rp350.000', desc: 'Jadilah pendukung premium dan dapatkan akses fitur lebih awal.' },
      { id: 'galaxy', icon: <FaGlobe className="w-8 h-8 text-sky-400" />, title: 'Tingkat Galaksi', amount: 'Rp750.000', desc: 'Dukung penuh dan dapatkan pengakuan eksklusif di platform.' }
    ]
  }

  const payments = [
    { icon: <FaPaypal className="w-8 h-8 text-sky-400" />, name: 'PayPal' },
    { icon: <FaBitcoin className="w-8 h-8 text-sky-400" />, name: 'Crypto' },
    { icon: <FaCreditCard className="w-8 h-8 text-sky-400" />, name: 'Card' },
    { icon: <FaQrcode className="w-8 h-8 text-sky-400" />, name: 'QRIS' }
  ]

  const tierLinks: Record<string, string> = {
    coffee: 'https://ko-fi.com/aichiow?amount=3',
    gem: 'https://ko-fi.com/aichiow?amount=10',
    crown: 'https://ko-fi.com/aichiow?amount=25',
    galaxy: 'https://ko-fi.com/aichiow?amount=50'
  }

  return (
    <>
      <Head>
        <title>Donate | Aichiow</title>
        <meta name="description" content="Support Aichiow development and servers." />
        <meta property="og:title" content="Donate to Aichiow" />
        <meta property="og:description" content="Support our anime & manga platform for continuous updates and features." />
      </Head>

      <main className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-700/30 via-black to-black" />

        <div className="relative z-20 max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/home" className="font-bold text-lg text-white hover:text-sky-400 transition">Home</Link>
          <motion.button
            onClick={() => setLang(lang === 'EN' ? 'ID' : 'EN')}
            whileTap={{ scale: 0.9 }}
            className="relative w-20 h-9 flex items-center bg-sky-900 rounded-full px-1 cursor-pointer overflow-hidden border border-sky-700 shadow-md shadow-sky-500/20"
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
            className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-400 to-sky-300"
          >
            {lang === 'EN' ? 'Support Aichiow' : 'Dukung Aichiow'}
          </motion.h1>
          <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
            {lang === 'EN'
              ? 'Help us grow, improve, and maintain Aichiow for anime, manga, and light novel fans worldwide.'
              : 'Bantu kami mengembangkan, memperbaiki, dan menjaga Aichiow untuk penggemar anime, manga, dan light novel di seluruh dunia.'}
          </p>
        </section>

        <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers[lang].map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-gradient-to-b from-sky-800/30 to-transparent rounded-xl border border-sky-700 hover:shadow-lg hover:shadow-sky-500/30"
            >
              <div className="mb-3">{tier.icon}</div>
              <h3 className="font-semibold text-xl mb-1">{tier.title}</h3>
              <p className="text-sm text-gray-300 mb-3">{tier.desc}</p>
              <div className="text-sky-400 font-bold text-lg">{tier.amount}</div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedTier(tier.id)}
                className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 text-white font-medium hover:shadow-md hover:shadow-sky-400/30 transition"
              >
                {lang === 'EN' ? 'Donate Now' : 'Donasi Sekarang'}
              </motion.button>
            </motion.div>
          ))}
        </section>

        <section className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold mb-8">
            {lang === 'EN' ? 'Payment Methods' : 'Metode Pembayaran'}
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {payments.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, y: -5 }}
                className="w-40 h-40 flex flex-col justify-center items-center bg-sky-900/20 border border-sky-800 rounded-xl shadow-md shadow-sky-500/20 cursor-pointer"
              >
                {p.icon}
                <span className="mt-3 text-gray-300 font-medium">{p.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="relative z-10 text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto p-8 bg-sky-900/30 border border-sky-700 rounded-2xl shadow-md shadow-sky-500/20"
          >
            <FaHeart className="w-10 h-10 mx-auto mb-4 text-sky-400" />
            <h3 className="text-2xl font-semibold mb-2">
              {lang === 'EN' ? 'Every Bit Helps' : 'Setiap Dukungan Berarti'}
            </h3>
            <p className="text-gray-300 mb-6">
              {lang === 'EN'
                ? 'Your contribution, no matter the size, keeps Aichiow alive and thriving.'
                : 'Dukunganmu, sekecil apa pun, membantu Aichiow tetap hidup dan berkembang.'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold hover:shadow-md hover:shadow-sky-400/30 transition"
            >
              {lang === 'EN' ? 'Become a Supporter' : 'Jadi Pendukung'}
            </motion.button>
          </motion.div>
        </section>

        <footer className="relative z-10 text-center text-sm text-gray-400 py-8">
          <div className="h-px bg-gradient-to-r from-transparent via-sky-600 to-transparent mb-6" />
          © {new Date().getFullYear()} Aichiow Plus. All rights reserved.
        </footer>

        <AnimatePresence>
          {selectedTier && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="bg-sky-950/60 border border-sky-700 rounded-2xl p-8 max-w-sm w-[90%] shadow-lg shadow-sky-500/20 text-center"
              >
                <FaHeart className="w-10 h-10 text-sky-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {lang === 'EN' ? 'Confirm Your Support' : 'Konfirmasi Dukunganmu'}
                </h3>
                <p className="text-gray-300 text-sm mb-6">
                  {lang === 'EN'
                    ? 'Click below to proceed to the donation page.'
                    : 'Klik tombol di bawah untuk melanjutkan ke halaman donasi.'}
                </p>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={tierLinks[selectedTier] || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2 mb-3 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold"
                >
                  {lang === 'EN' ? 'Continue to Donate' : 'Lanjutkan Donasi'}
                </motion.a>

                <button
                  onClick={() => setSelectedTier(null)}
                  className="text-gray-400 hover:text-sky-300 text-sm flex items-center justify-center gap-1 mx-auto"
                >
                  <FaTimes className="w-4 h-4" /> {lang === 'EN' ? 'Close' : 'Tutup'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
