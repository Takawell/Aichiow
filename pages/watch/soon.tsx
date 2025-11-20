import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub } from 'react-icons/fa'
import { FaTiktok } from 'react-icons/fa'
import { AiOutlineMail } from 'react-icons/ai'
import { RiArrowLeftLine } from 'react-icons/ri'

export default function ComingSoonPage() {
  const [lang, setLang] = useState<'ID' | 'EN'>('EN')
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [snack, setSnack] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const content = {
    ID: (
      <>
        <h3 className="text-2xl md:text-3xl font-semibold text-sky-300">Fitur Streaming Sedang Dikembangkan</h3>
        <p className="mt-4 text-gray-300 leading-relaxed">
          Aichiow sedang membangun pengalaman streaming generasi berikutnya yang cepat, bersih, dan legal. Kami
          menjaga kreativitas dan kualitas dengan fokus pada komunitas.
        </p>
        <p className="mt-2 text-gray-300">
          Visi kami adalah menjadi <span className="text-sky-400 font-semibold">rumah utama</span> bagi penggemar anime di
          seluruh dunia.
        </p>
        <p className="mt-2 italic text-gray-400">Tetap terhubung untuk pembaruan dan peluncuran eksklusif.</p>
      </>
    ),
    EN: (
      <>
        <h3 className="text-2xl md:text-3xl font-semibold text-sky-300">Streaming Feature Under Development</h3>
        <p className="mt-4 text-gray-300 leading-relaxed">
          Aichiow is building a next-generation streaming experience that is fast, clean, and fully legal. We
          prioritize creators and community quality.
        </p>
        <p className="mt-2 text-gray-300">
          Our vision is to become <span className="text-sky-400 font-semibold">the ultimate home</span> for anime lovers
          worldwide.
        </p>
        <p className="mt-2 italic text-gray-400">Stay connected for updates and exclusive launches.</p>
      </>
    ),
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setSnack({ type: 'err', text: 'Masukkan email valid' })
      setTimeout(() => setSnack(null), 3000)
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    setSubmitting(false)
    setEmail('')
    setSnack({ type: 'ok', text: 'Terima kasih! Kami akan mengabari via email.' })
    setTimeout(() => setSnack(null), 4000)
  }

  return (
    <>
      <Head>
        <title>Coming Soon | Aichiow</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white flex flex-col items-center justify-center px-6 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.06)_0%,transparent_40%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <Link href="/home" className="inline-flex items-center gap-2">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-500 to-sky-300 flex items-center justify-center shadow-lg">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16v16H4z" fill="#000" fillOpacity="0.08" />
                    <path d="M7 12c0-2.761 2.239-5 5-5s5 2.239 5 5-2.239 5-5 5-5-2.239-5-5z" fill="#ffffff" />
                  </svg>
                </div>
                <span className="text-lg md:text-xl font-bold text-sky-200">AICHIOW</span>
              </Link>
            </div>
            <nav className="flex items-center gap-4">
              <button
                onClick={() => setLang((l) => (l === 'EN' ? 'ID' : 'EN'))}
                className="px-3 py-2 rounded-full bg-neutral-900/40 hover:bg-neutral-800 transition flex items-center gap-2"
              >
                <span className="text-sm text-gray-200">{lang}</span>
              </button>
              <div className="hidden md:flex items-center gap-3">
                <a
                  href="https://github.com/Takawell/Aichiow"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900/40 hover:bg-neutral-800 transition"
                >
                  <FaGithub className="text-xl text-sky-300" />
                  <span className="text-sm text-gray-200">GitHub</span>
                </a>
                <a
                  href="https://tiktok.com/@putrawangyyy"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900/40 hover:bg-neutral-800 transition"
                >
                  <FaTiktok className="text-xl text-sky-300" />
                  <span className="text-sm text-gray-200">TikTok</span>
                </a>
              </div>
            </nav>
          </motion.header>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-neutral-900/50 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-[0_10px_40px_rgba(2,6,23,0.7)]"
          >
            <motion.h1
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-sky-400 to-sky-200"
            >
              COMING SOON
            </motion.h1>

            <div className="mt-6 md:flex md:items-start md:gap-8">
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={lang}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="text-gray-300 text-base md:text-lg leading-relaxed"
                  >
                    {content[lang]}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                  <Link
                    href="/home"
                    className="inline-flex items-center gap-3 px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-sky-500 to-sky-400 hover:scale-[1.02] transform transition shadow-lg"
                  >
                    <RiArrowLeftLine className="text-lg" />
                    <span>Back to Home</span>
                  </Link>

                  <a
                    href="/explore"
                    className="inline-flex items-center gap-3 px-5 py-3 rounded-xl font-semibold bg-neutral-800/40 hover:bg-neutral-800 transition"
                  >
                    Explore
                  </a>
                </div>
              </div>

              <aside className="mt-6 md:mt-0 w-full md:w-80 flex-shrink-0">
                <div className="rounded-xl border border-neutral-800/60 p-4 bg-gradient-to-br from-black/40 to-neutral-900/40">
                  <div className="text-sm text-gray-400">Get notified</div>
                  <form onSubmit={handleSubscribe} className="mt-3 flex flex-col gap-3">
                    <label className="sr-only">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={lang === 'EN' ? 'Your email address' : 'Alamat email Anda'}
                      className="w-full px-3 py-2 rounded-md bg-neutral-800/30 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-gradient-to-r from-sky-500 to-sky-400 font-semibold hover:brightness-105 transition"
                    >
                      <span>{submitting ? (lang === 'EN' ? 'Subscribing...' : 'Mengirim...') : lang === 'EN' ? 'Notify me' : 'Beritahu saya'}</span>
                    </button>
                  </form>

                  <div className="mt-4 text-xs text-gray-400">No spam. Unsubscribe anytime.</div>
                </div>

                <div className="mt-5 p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/50 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-300">Early access</div>
                    <div className="text-xs text-gray-400">Join the developer build and give feedback</div>
                  </div>
                  <a
                    href="https://github.com/aichiow"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800/20 hover:bg-neutral-800 transition"
                  >
                    <FaGithub className="text-sky-300" />
                    <span className="text-xs text-gray-200">Repo</span>
                  </a>
                </div>
              </aside>
            </div>

            <div className="mt-8 border-t border-neutral-800/40 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/Takawell/Aichiow"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-800/30 hover:bg-neutral-800 transition"
                >
                  <FaGithub className="text-2xl text-sky-300" />
                  <span className="hidden sm:inline text-sm text-gray-200">GitHub</span>
                </a>

                <a
                  href="https://tiktok.com/@putrawangyyy"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-800/30 hover:bg-neutral-800 transition"
                >
                  <FaTiktok className="text-2xl text-sky-300" />
                  <span className="hidden sm:inline text-sm text-gray-200">TikTok</span>
                </a>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="mailto:hello@aichiow.dev"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-800/20 hover:bg-neutral-800 transition"
                >
                  <AiOutlineMail className="text-sky-300 text-xl" />
                  <span className="text-sm text-gray-300">hello@aichiow.dev</span>
                </a>

                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs text-gray-400">© Aichiow Plus</span>
                  <span className="text-xs text-gray-500"></span>
                  <span className="text-xs text-gray-400">All Right Reserved.</span>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl p-4 bg-neutral-900/40 border border-neutral-800/50">
                <div className="text-sm text-gray-400">Performance</div>
                <div className="mt-2 font-semibold text-sky-200">Optimized for mobile & desktop</div>
                <div className="mt-2 text-xs text-gray-400">Fast loading, smooth playback, adaptive UI.</div>
              </div>

              <div className="rounded-xl p-4 bg-neutral-900/40 border border-neutral-800/50">
                <div className="text-sm text-gray-400">Privacy</div>
                <div className="mt-2 font-semibold text-sky-200">Respectful by default</div>
                <div className="mt-2 text-xs text-gray-400">Legal content, minimal tracking, opt-ins.</div>
              </div>
              <div className="rounded-xl p-4 bg-neutral-900/40 border border-neutral-800/50">
                <div className="text-sm text-gray-400">Design</div>
                <div className="mt-2 font-semibold text-sky-200">Modern, elegant, interactive</div>
                <div className="mt-2 text-xs text-gray-400">Accessible colors, responsive layout, micro-interactions.</div>
              </div>
            </div>
          </motion.div>

          <div className="fixed left-4 bottom-4 z-50 flex flex-col gap-3">
            <a
              href="https://github.com/Takawell/Aichiow"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-900/60 hover:bg-neutral-800 transition shadow-md"
            >
              <FaGithub className="text-sky-300" />
            </a>

            <a
              href="https://tiktok.com/@putrawangyyy"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-900/60 hover:bg-neutral-800 transition shadow-md"
            >
              <FaTiktok className="text-sky-300" />
            </a>
          </div>

          {snack && (
            <div className={`fixed right-4 top-6 z-50 min-w-[220px] rounded-md px-4 py-3 ${snack.type === 'ok' ? 'bg-sky-600/95' : 'bg-red-600/95'}`}>
              <div className="text-sm font-medium text-white">{snack.text}</div>
            </div>
          )}
        </div>

        <svg
          className="pointer-events-none absolute right-0 bottom-0 w-64 h-64 opacity-20"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="url(#g1)" />
        </svg>
      </main>
    </>
  )
}
