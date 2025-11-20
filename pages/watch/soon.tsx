import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { FaGithub, FaTiktok } from 'react-icons/fa'
import { FiMail, FiChevronRight, FiShield } from 'react-icons/fi'
import { RiShieldStarLine } from 'react-icons/ri'
import { AiOutlineCloud } from 'react-icons/ai'

export default function ComingSoonGlassV2() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const controls = useAnimation()
  const headerRef = useRef<HTMLDivElement | null>(null)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.8 } })
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [controls])

  const content = {
    EN: {
      title: 'Coming Soon',
      subtitle: 'Next-generation anime streaming, crafted with respect for creators and viewers.',
      paragraphs: [
        'Aichiow is building a robust streaming platform that prioritizes legality, performance, and user experience.',
        'We focus on quality curated catalogs, fast playback, and features that enhance discovery and fandom.',
        'Join our waitlist to be the first to experience our beta.'
      ],
      cta: 'Back to home',
      connect: 'Connect with Us',
      newsletter: 'Join waitlist'
    },
    ID: {
      title: 'Segera Hadir',
      subtitle: 'Streaming anime generasi berikutnya, dibangun dengan menghormati kreator dan penonton.',
      paragraphs: [
        'Aichiow sedang membangun platform streaming yang menekankan legalitas, performa, dan pengalaman pengguna.',
        'Kami fokus pada kualitas katalog kurasi, pemutaran cepat, dan fitur yang memperkaya pengalaman penggemar.',
        'Bergabunglah dalam daftar tunggu untuk mencoba beta pertama kami.'
      ],
      cta: 'Kembali ke beranda',
      connect: 'Terhubung dengan Kami',
      newsletter: 'Gabung daftar tunggu'
    }
  }

  const handleSubscribe = async (e?: any) => {
    if (e) e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 1800)
      return
    }
    setStatus('loading')
    await new Promise((r) => setTimeout(r, 1200))
    setStatus('success')
    setEmail('')
    setTimeout(() => setStatus('idle'), 2000)
  }

  const heroVariants = {
    hidden: { opacity: 0, y: 16 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
  }

  const featureList = [
    {
      title: 'Legal & Licensed',
      desc: 'Built on clear rights and partnerships, protecting creators and users.',
      icon: RiShieldStarLine
    },
    {
      title: 'Ultra Fast Playback',
      desc: 'Low-latency streams, adaptive quality, and instant seek.',
      icon: AiOutlineCloud
    },
    {
      title: 'Curation & Community',
      desc: 'Editorial picks, user lists, and community-driven discovery.',
      icon: FiShield
    }
  ]

  return (
    <>
      <Head>
        <title>{content[lang].title} | Aichiow</title>
      </Head>

      <div className="min-h-screen bg-black text-white antialiased relative overflow-x-hidden">
        <div className="absolute -z-10 inset-0">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 600">
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#021" stopOpacity="1" />
                <stop offset="50%" stopColor="#001019" stopOpacity="1" />
                <stop offset="100%" stopColor="#000" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="g2" x1="0" x2="1">
                <stop offset="0%" stopColor="#023b56" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#073548" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)" />
            <g transform="translate(0,0)">
              <ellipse cx="420" cy="180" rx="520" ry="300" fill="url(#g2)" />
              <ellipse cx="140" cy="420" rx="320" ry="220" fill="rgba(56,189,248,0.02)" />
            </g>
          </svg>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-40 top-8 w-[420px] h-[420px] blur-[70px] opacity-30 bg-gradient-to-r from-sky-400 to-cyan-300 rounded-full mix-blend-screen" />
          <div className="absolute -left-40 bottom-12 w-[360px] h-[360px] blur-[90px] opacity-20 bg-gradient-to-tr from-indigo-700 to-sky-400 rounded-full mix-blend-screen" />
        </div>

        <header
          ref={headerRef}
          className={`w-full fixed top-6 left-0 z-30 transition-[backdrop-filter,transform] ${
            scrolled ? 'backdrop-blur-md translate-y-0 opacity-95' : 'backdrop-blur-0'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-300 p-[3px]">
                <div className="w-full h-full rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-sky-200 font-extrabold tracking-wide">AW</span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-white font-semibold">Aichiow</div>
                <div className="text-sky-200 text-sm">Streaming — Respectful by design</div>
              </div>
            </div>

            <nav className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3 bg-white/3 rounded-full p-1">
                <button
                  onClick={() => setLang('EN')}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                    lang === 'EN' ? 'bg-sky-400 text-black shadow-[0_6px_24px_rgba(56,189,248,0.16)]' : 'text-sky-200/80'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang('ID')}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                    lang === 'ID' ? 'bg-sky-400 text-black shadow-[0_6px_24px_rgba(56,189,248,0.16)]' : 'text-sky-200/80'
                  }`}
                >
                  ID
                </button>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/aichiow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/3 hover:bg-white/5 transition"
                >
                  <FaGithub className="text-xl text-sky-200" />
                </a>
                <a
                  href="https://tiktok.com/@putrawangyyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/3 hover:bg-white/5 transition"
                >
                  <FaTiktok className="text-xl text-sky-200" />
                </a>
                <Link href="/home" className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 text-black font-semibold transition hover:scale-[1.02]">
                  <span>{content[lang].cta}</span>
                  <FiChevronRight />
                </Link>
              </div>
            </nav>
          </div>
        </header>

        <main className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row gap-10 items-center">
            <motion.section
              initial="hidden"
              animate="enter"
              variants={heroVariants}
              className="w-full lg:w-6/12 relative z-20"
            >
              <div className="bg-white/4 backdrop-blur-2xl border border-white/8 rounded-3xl p-8 md:p-12 shadow-[0_10px_60px_rgba(2,6,23,0.7)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-cyan-200">
                      {content[lang].title}
                    </h1>
                    <p className="mt-3 text-sky-200/90 max-w-xl">{content[lang].subtitle}</p>
                    <div className="mt-6 flex gap-3 flex-wrap">
                      <button
                        onClick={() => {
                          const el = document.getElementById('newsletter')
                          el?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-gradient-to-r from-sky-400 to-cyan-300 text-black font-semibold shadow-[0_10px_30px_rgba(6,182,212,0.12)]"
                      >
                        {content[lang].newsletter}
                        <FiChevronRight />
                      </button>
                      <button
                        onClick={() => window.open('https://github.com/aichiow', '_blank')}
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-transparent border border-white/8 text-sky-200/90 hover:bg-white/3 transition"
                      >
                        <FaGithub />
                        GitHub
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-end gap-3">
                    <div className="text-xs text-sky-200/60">Beta slots</div>
                    <div className="text-2xl font-bold text-sky-100">Limited</div>
                    <div className="mt-2 text-sm text-sky-200/70">Early access for contributors and supporters</div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featureList.map((f, i) => {
                    const Icon = f.icon
                    return (
                      <div key={i} className="flex items-start gap-4 bg-white/3 rounded-xl p-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-sky-300 to-cyan-200 text-black">
                          <Icon className="text-xl" />
                        </div>
                        <div>
                          <div className="font-semibold text-sky-100">{f.title}</div>
                          <div className="text-sky-200/80 text-sm">{f.desc}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="text-sm text-sky-200/70">Status</div>
                <div className="flex items-center gap-2">
                  <div className="w-36 h-3 bg-white/6 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-400 to-cyan-300" style={{ width: '46%' }} />
                  </div>
                  <div className="text-xs text-sky-200/60">Alpha 0.4</div>
                </div>
              </div>
            </motion.section>

            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="w-full lg:w-5/12"
            >
              <div className="bg-white/3 backdrop-blur-2xl border border-white/8 rounded-3xl p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-sky-200/80">Preview</div>
                    <div className="text-lg font-semibold text-white">UI Snapshot</div>
                  </div>
                  <div className="text-xs text-sky-200/60">Interactive demo</div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4">
                  <div className="rounded-lg overflow-hidden border border-white/6 bg-gradient-to-b from-black/60 to-black/40 p-4">
                    <div className="w-full h-44 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 relative flex items-center justify-center">
                      <div className="absolute inset-0 opacity-70 bg-[conic-gradient(at_top_right,rgba(56,189,248,0.06),transparent_20%)]" />
                      <div className="relative z-10 w-11/12 h-32 bg-black/60 rounded-xl border border-white/8 p-4 flex items-center justify-between">
                        <div>
                          <div className="text-sky-200 font-medium">Now Playing</div>
                          <div className="text-white font-semibold text-lg">Episode 01 — Pilot</div>
                        </div>
                        <div className="text-sky-200/80 text-sm">00:12 / 24:00</div>
                      </div>
                    </div>
                    <div className="mt-3 text-sky-200/70 text-sm">Compact player mockup to show glass UI and micro interactions.</div>
                  </div>

                  <div className="rounded-lg border border-white/6 bg-white/3 p-4 grid grid-cols-2 gap-3">
                    <div className="bg-white/4 p-3 rounded-md">
                      <div className="text-sky-200 text-xs">Featured</div>
                      <div className="text-white font-semibold mt-2">Handpicked Collection</div>
                    </div>
                    <div className="bg-white/4 p-3 rounded-md">
                      <div className="text-sky-200 text-xs">Quality</div>
                      <div className="text-white font-semibold mt-2">Adaptive 1080p</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-sky-400/8 to-cyan-300/6 border border-white/6">
                    <div className="text-sky-200 text-xs">Security</div>
                    <div className="text-white font-semibold mt-1">Protected streams & DRM-ready</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-700/6 to-sky-400/6 border border-white/6">
                    <div className="text-sky-200 text-xs">Cloud</div>
                    <div className="text-white font-semibold mt-1">Edge-backed CDN</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white/5 backdrop-blur-2xl border border-white/8 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sky-200 text-sm">Roadmap</div>
                    <div className="text-white font-semibold">Where we’re heading</div>
                  </div>
                  <div className="text-xs text-sky-200/60">Updated monthly</div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-sky-400 mt-2" />
                    <div>
                      <div className="font-semibold">Core streaming engine</div>
                      <div className="text-sky-200/70 text-sm">Stability, HLS/DASH, adaptive bitrate</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-sky-300 mt-2" />
                    <div>
                      <div className="font-semibold">Creator portal</div>
                      <div className="text-sky-200/70 text-sm">Upload flows, revenue dashboard</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-sky-200 mt-2" />
                    <div>
                      <div className="font-semibold">Discovery & community</div>
                      <div className="text-sky-200/70 text-sm">Collections, comments, lists</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-12">
            <section id="newsletter" className="bg-white/4 backdrop-blur-2xl border border-white/8 rounded-3xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-200">
                    {content[lang].newsletter}
                  </h3>
                  <p className="mt-2 text-sky-200/80">
                    {content[lang].paragraphs[2]}
                  </p>
                </div>

                <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center gap-3">
                  <div className="relative w-full md:w-[360px]">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-200/80" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/6 placeholder-sky-200/50 text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
                      status === 'loading' ? 'bg-sky-300/70 text-black' : 'bg-gradient-to-r from-sky-400 to-cyan-300 text-black'
                    }`}
                  >
                    {status === 'loading' ? 'Joining...' : 'Join'}
                    <FiChevronRight />
                  </button>
                </form>
              </div>

              <div className="mt-4 text-sm text-sky-200/70">
                {status === 'error' && <span className="text-rose-400">Enter a valid email address</span>}
                {status === 'success' && <span className="text-emerald-400">Thanks — check your inbox</span>}
              </div>
            </section>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-12">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/3 backdrop-blur-2xl border border-white/8 rounded-2xl p-6">
                <div className="text-sky-200 text-sm">Performance</div>
                <div className="text-white font-semibold mt-2">Fast startup, low buffering</div>
                <div className="mt-4 text-sky-200/70 text-sm">Optimized edge caching, parallel fetching, and modern codecs.</div>
              </div>

              <div className="bg-white/3 backdrop-blur-2xl border border-white/8 rounded-2xl p-6">
                <div className="text-sky-200 text-sm">Privacy</div>
                <div className="text-white font-semibold mt-2">User-first controls</div>
                <div className="mt-4 text-sky-200/70 text-sm">Granular privacy settings and no invasive tracking by default.</div>
              </div>

              <div className="bg-white/3 backdrop-blur-2xl border border-white/8 rounded-2xl p-6">
                <div className="text-sky-200 text-sm">Design</div>
                <div className="text-white font-semibold mt-2">Accessible & modern</div>
                <div className="mt-4 text-sky-200/70 text-sm">High contrast accents, scalable typography, and keyboard navigation.</div>
              </div>
            </section>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-12">
            <section className="bg-white/4 backdrop-blur-2xl border border-white/8 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="text-sky-200 text-sm">Early Access</div>
                <div className="text-white font-extrabold text-2xl mt-1">Get notified when we launch</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const el = document.getElementById('newsletter')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 text-black font-semibold"
                >
                  Join Waitlist
                </button>
                <a href="https://github.com/Takawell/Aichiow" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-white/8">
                  <FaGithub />
                  GitHub
                </a>
              </div>
            </section>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-12">
            <footer className="flex flex-col md:flex-row items-center justify-between gap-6 text-sky-200/70">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-300 flex items-center justify-center text-black font-bold">AW</div>
                <div>
                  <div className="text-white font-semibold">Aichiow Plus</div>
                  <div className="text-sm text-sky-200/70">© {new Date().getFullYear()} Aichiow Plus. All rights reserved.</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <a href="https://github.com/Takawell/Aichiow" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/3 hover:bg-white/5">
                  <FaGithub className="text-sky-200" />
                </a>
                <a href="https://tiktok.com/@putrawangyyy" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/3 hover:bg-white/5">
                  <FaTiktok className="text-sky-200" />
                </a>
                <div className="hidden md:block text-sm text-sky-200/60">Privacy · Terms · Status</div>
              </div>
            </footer>
          </div>
        </main>

        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-cyan-300 p-[3px]">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full h-full rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-black font-bold"
            >
              ↑
            </button>
          </div>
        </div>

        <style jsx>{`
          .backdrop-blur-3xl {
            -webkit-backdrop-filter: blur(28px);
            backdrop-filter: blur(28px);
          }
          .backdrop-blur-2xl {
            -webkit-backdrop-filter: blur(14px);
            backdrop-filter: blur(14px);
          }
        `}</style>
      </div>
    </>
  )
}
