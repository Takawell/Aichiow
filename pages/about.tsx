'use client'

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useRef, useState, type RefObject } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type NodeKey = 'anime' | 'manga' | 'manhwa' | 'novel' | 'aichiow'

const NODE_META: Record<NodeKey, { label: string; img: string; descEN: string; descID: string }> = {
  aichiow: {
    label: 'Aichiow',
    img: '/aichiow.png',
    descEN: 'Central hub connecting anime, manga, manhwa and light novels.',
    descID: 'Pusat yang menghubungkan anime, manga, manhwa, dan light novel.'
  },
  anime: {
    label: 'Anime',
    img: '/anime.png',
    descEN: 'Title metadata, seasons, streaming links and artwork.',
    descID: 'Metadata judul, musim, tautan streaming dan artwork.'
  },
  manga: {
    label: 'Manga',
    img: '/manga.png',
    descEN: 'Chapter feeds, scan sources and release tracking.',
    descID: 'Feed chapter, sumber scan, dan pelacakan rilis.'
  },
  manhwa: {
    label: 'Manhwa',
    img: '/manhwa.png',
    descEN: 'Translated releases, reading progress and catalogs.',
    descID: 'Rilis terjemahan, progres baca dan katalog.'
  },
  novel: {
    label: 'Light Novel',
    img: '/novel.png',
    descEN: 'Volumes, translations, and indexing for search.',
    descID: 'Volume, terjemahan, dan pengindeksan untuk pencarian.'
  }
}

function useRects(refs: Record<NodeKey, RefObject<HTMLElement>>) {
  const [rects, setRects] = useState<Record<NodeKey, DOMRect | null>>({
    aichiow: null,
    anime: null,
    manga: null,
    manhwa: null,
    novel: null
  })
  useEffect(() => {
    let mounted = true
    const update = () => {
      if (!mounted) return
      setRects({
        aichiow: refs.aichiow.current?.getBoundingClientRect() ?? null,
        anime: refs.anime.current?.getBoundingClientRect() ?? null,
        manga: refs.manga.current?.getBoundingClientRect() ?? null,
        manhwa: refs.manhwa.current?.getBoundingClientRect() ?? null,
        novel: refs.novel.current?.getBoundingClientRect() ?? null
      })
    }
    update()
    const ro = new ResizeObserver(update)
    Object.values(refs).forEach(r => r.current && ro.observe(r.current))
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    const t = setInterval(update, 300)
    return () => {
      mounted = false
      ro.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
      clearInterval(t)
    }
  }, [refs])
  return rects
}

export default function AboutPage() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [selectedNode, setSelectedNode] = useState<NodeKey | null>(null)

  const refs: Record<NodeKey, RefObject<HTMLDivElement>> = {
    aichiow: useRef(null),
    anime: useRef(null),
    manga: useRef(null),
    manhwa: useRef(null),
    novel: useRef(null)
  }

  const rects = useRects(refs)

  const faq = {
    EN: [
      { q: 'What is Aichiow?', a: 'Aichiow is your hub for anime, manga, manhwa, and light novels. We combine discovery, recommendations, and community into one platform.' },
      { q: 'Is Aichiow free?', a: 'Yes! Aichiow is free to explore. Premium features may come in the future to enhance your experience.' },
      { q: 'Where does the content come from?', a: 'We integrate trusted APIs like Anilist and MangaDex, providing real-time updates and content.' }
    ],
    ID: [
      { q: 'Apa itu Aichiow?', a: 'Aichiow adalah pusat untuk anime, manga, manhwa, dan light novel. Kami menggabungkan penemuan, rekomendasi, dan komunitas dalam satu platform.' },
      { q: 'Apakah Aichiow gratis?', a: 'Ya! Aichiow gratis untuk dijelajahi. Fitur premium mungkin hadir di masa depan untuk pengalaman lebih baik.' },
      { q: 'Dari mana kontennya berasal?', a: 'Kami mengintegrasikan API terpercaya seperti Anilist dan MangaDex, menghadirkan update dan konten real-time.' }
    ]
  }

  const svgRef = useRef<SVGSVGElement | null>(null)
  const [svgBox, setSvgBox] = useState<DOMRect | null>(null)
  useEffect(() => {
    const update = () => setSvgBox(svgRef.current?.getBoundingClientRect() ?? null)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const lines: Array<{ id: string; from: { x: number; y: number }; to: { x: number; y: number } }> = []
  if (rects.aichiow) {
    const c = rects.aichiow
    const cx = c.left + c.width / 2
    const cy = c.top + c.height / 2
    for (const k of ['anime', 'manga', 'manhwa', 'novel'] as NodeKey[]) {
      const r = rects[k]
      if (!r) continue
      const tx = r.left + r.width / 2
      const ty = r.top + r.height / 2
      lines.push({ id: `line-${k}`, from: { x: cx, y: cy }, to: { x: tx, y: ty } })
    }
  }

  const mapped = (svgBox && lines.length
    ? lines.map(l => ({
        id: l.id,
        x1: l.from.x - svgBox.left,
        y1: l.from.y - svgBox.top,
        x2: l.to.x - svgBox.left,
        y2: l.to.y - svgBox.top
      }))
    : []
  ).map(p => ({ ...p, d: `M ${p.x1} ${p.y1} C ${(p.x1 + p.x2) / 2} ${p.y1} ${(p.x1 + p.x2) / 2} ${p.y2} ${p.x2} ${p.y2}` }))

  return (
    <>
      <Head>
        <title>About Aichiow</title>
      </Head>

      <main className="relative min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white antialiased">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-black to-black" />

        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-3">
            <div className="w-9 h-9 relative">
              <Image src="/aichiow.png" alt="Aichiow" fill sizes="36px" className="object-contain" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">Aichiow</span>
          </Link>

          <div className="flex items-center gap-3">
            <button onClick={() => setLang(l => (l === 'EN' ? 'ID' : 'EN'))} className="relative w-22 h-9 flex items-center bg-gray-800 rounded-full px-1 border border-white/10">
              <motion.div layout className="absolute top-1 left-1 w-8 h-7 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" animate={{ x: lang === 'EN' ? 0 : 42 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }} />
              <div className="relative z-10 w-full flex justify-between px-2 text-xs font-medium">
                <span>EN</span><span>ID</span>
              </div>
            </button>
          </div>
        </div>

        <section className="text-center px-4">
          <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
            {lang === 'EN' ? 'How Aichiow Works' : 'Cara Kerja Aichiow'}
          </motion.h1>
          <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-2">
            {lang === 'EN'
              ? 'Modern box-style database flow: center orchestrator with content nodes on the sides, synced by APIs.'
              : 'Alur database bergaya kotak modern: orchestrator pusat dengan node konten di samping, tersinkron lewat API.'}
          </p>
        </section>

        <section className="relative z-20 max-w-6xl mx-auto px-4 py-10">
          <div className="relative w-full bg-white/3 border border-white/6 rounded-3xl p-6 overflow-visible">
            <div className="relative w-full h-[540px] md:h-[420px]">
              <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none" />

              <div ref={refs.aichiow} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div initial={{ scale: 0.99 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-[300px] md:w-[420px]">
                  <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/60 border border-white/10 rounded-2xl p-5 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                        <Image src="/aichiow.png" alt="Aichiow" fill sizes="64px" className="object-contain p-2" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xl font-semibold">Aichiow</div>
                        <div className="text-xs text-gray-300">Central Database & API Orchestrator</div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="px-3 py-2 bg-white/5 rounded-lg border border-white/6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-pink-400" />
                        <div className="text-xs text-gray-300">Metadata Store</div>
                      </div>
                      <div className="px-3 py-2 bg-white/5 rounded-lg border border-white/6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-violet-400" />
                        <div className="text-xs text-gray-300">Indexers</div>
                      </div>
                      <div className="px-3 py-2 bg-white/5 rounded-lg border border-white/6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        <div className="text-xs text-gray-300">API Layer</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="absolute left-8 top-6 md:top-16 flex flex-col gap-6">
                <NodeCard ref={refs.anime} id="anime" onOpen={() => setSelectedNode('anime')} />
                <NodeCard ref={refs.manga} id="manga" onOpen={() => setSelectedNode('manga')} />
              </div>

              <div className="absolute right-8 top-6 md:top-16 flex flex-col gap-6">
                <NodeCard ref={refs.manhwa} id="manhwa" onOpen={() => setSelectedNode('manhwa')} />
                <NodeCard ref={refs.novel} id="novel" onOpen={() => setSelectedNode('novel')} />
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="g-flow" x1="0" x2="1">
                    <stop offset="0%" stopColor="#ff7ab6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                {mapped.map((L, i) => (
                  <g key={L.id}>
                    <motion.path d={L.d} stroke="url(#g-flow)" strokeWidth={2.6} fill="transparent" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: i * 0.06 }} style={{ filter: 'drop-shadow(0 8px 20px rgba(139,92,246,0.12))' }} />
                    <motion.circle r={5} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.22 }} cx={(L.x1 * 0.55 + L.x2 * 0.45)} cy={(L.y1 * 0.55 + L.y2 * 0.45)} fill="url(#g-flow)" />
                  </g>
                ))}
              </svg>
            </div>

            <div className="mt-6 w-full flex flex-col md:flex-row gap-4 justify-between items-center text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
                <div>{lang === 'EN' ? 'Central sync and API orchestration' : 'Sinkronisasi pusat dan orkestrasi API'}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div>{lang === 'EN' ? 'ETL pipelines, webhooks and scheduled syncs' : 'Pipeline ETL, webhook dan sinkron terjadwal'}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: lang === 'EN' ? 'Curated Content' : 'Konten Kurasi', desc: lang === 'EN' ? 'Handpicked recommendations, trending charts, and seasonal picks.' : 'Rekomendasi pilihan, daftar tren, dan rilisan musiman.' },
            { title: lang === 'EN' ? 'Community Driven' : 'Didorong Komunitas', desc: lang === 'EN' ? 'Engage with fans, share lists, and connect with like-minded people.' : 'Terlibat dengan penggemar, bagikan daftar, dan terhubung dengan orang-orang sefrekuensi.' },
            { title: lang === 'EN' ? 'Fast Updates' : 'Update Cepat', desc: lang === 'EN' ? 'Real-time updates powered by trusted APIs like Anilist & MangaDex.' : 'Update real-time dari API terpercaya seperti Anilist & MangaDex.' },
            { title: lang === 'EN' ? 'Global Access' : 'Akses Global', desc: lang === 'EN' ? 'Access your favorite content anytime, anywhere in the world.' : 'Akses konten favoritmu kapan saja, di mana saja.' }
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.06 }} className="p-5 bg-gradient-to-b from-white/4 to-transparent rounded-xl border border-white/8">
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </section>

        <AnimatePresence>
          {selectedNode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ y: 18, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 6, opacity: 0 }} transition={{ duration: 0.16 }} className="max-w-md w-full bg-gradient-to-br from-slate-900/95 to-black/95 border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    <Image src={NODE_META[selectedNode].img} alt={NODE_META[selectedNode].label} fill sizes="56px" className="object-contain p-2" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{NODE_META[selectedNode].label}</h3>
                      <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-white">✕</button>
                    </div>
                    <p className="mt-2 text-gray-300 text-sm">{lang === 'EN' ? NODE_META[selectedNode].descEN : NODE_META[selectedNode].descID}</p>
                    <div className="mt-4 text-xs text-gray-400">
                      {selectedNode === 'aichiow' ? (
                        <div className="space-y-1">
                          <div>Central DB → Metadata store → Indexers → API</div>
                          <div>Authentication, rate-limits and caching layer.</div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div>Ingest → Normalize → Index → Serve</div>
                          <div>Supports webhooks, periodic tasks, and backfills.</div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <button onClick={() => setSelectedNode(null)} className="px-3 py-2 rounded-md bg-white/6 text-sm hover:bg-white/8">{lang === 'EN' ? 'Close' : 'Tutup'}</button>
                      <a href="/home" className="ml-auto px-3 py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 text-sm font-medium">{lang === 'EN' ? 'Explore' : 'Jelajahi'}</a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="relative z-10 max-w-3xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold text-center mb-6">{lang === 'EN' ? 'FAQ' : 'Pertanyaan Umum'}</h2>
          <div className="space-y-3">
            {faq[lang].map((f, i) => (
              <div key={i} className="rounded-lg bg-white/5 border border-white/8 overflow-hidden">
                <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)} className="w-full px-4 py-3 text-left flex justify-between items-center font-medium hover:bg-white/10 transition">
                  <span>{f.q}</span>
                  <span>{openFAQ === i ? '-' : '+'}</span>
                </button>
                <AnimatePresence>
                  {openFAQ === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="px-4 pb-4 text-gray-300 text-sm">
                      {f.a}
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

const NodeCard = React.forwardRef<HTMLDivElement, { id: NodeKey; onOpen: () => void }>(({ id, onOpen }, ref) => {
  return (
    <div ref={ref} className="w-44 sm:w-52">
      <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }} onClick={onOpen} className="w-full text-left">
        <div className="bg-gradient-to-br from-white/4 to-transparent border border-white/8 rounded-2xl p-4 hover:scale-[1.03] transition transform">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
              <Image src={NODE_META[id].img} alt={NODE_META[id].label} fill sizes="48px" className="object-contain p-2" />
            </div>
            <div>
              <div className="text-sm font-semibold">{NODE_META[id].label}</div>
              <div className="text-xs text-gray-300">{NODE_META[id].descEN}</div>
            </div>
          </div>
        </div>
      </motion.button>
    </div>
  )
})
NodeCard.displayName = 'NodeCard'
