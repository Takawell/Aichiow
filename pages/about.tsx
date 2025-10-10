'use client'

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useRef, useState, type RefObject, forwardRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

type NodeKey = 'anime' | 'manga' | 'manhwa' | 'novel' | 'aichiow'

const NODE_META: Record<
  NodeKey,
  { label: string; img: string; descEN: string; descID: string }
> = {
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
    descEN: 'Chapter feeds, scans sources and release tracking.',
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
    const t = setInterval(update, 350)
    return () => {
      mounted = false
      ro.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
      clearInterval(t)
    }
  }, [refs.aichiow, refs.anime, refs.manga, refs.manhwa, refs.novel])
  return rects
}

export default function AboutPage() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN')
  const [selectedNode, setSelectedNode] = useState<NodeKey | null>(null)
  const [dragEnabled, setDragEnabled] = useState(true)

  const refs: Record<NodeKey, RefObject<HTMLDivElement>> = {
    aichiow: useRef<HTMLDivElement>(null),
    anime: useRef<HTMLDivElement>(null),
    manga: useRef<HTMLDivElement>(null),
    manhwa: useRef<HTMLDivElement>(null),
    novel: useRef<HTMLDivElement>(null)
  }

  const rects = useRects(refs)

  const lines: Array<{ id: string; from: { x: number; y: number }; to: { x: number; y: number } }> = []
  if (rects.aichiow) {
    const c = rects.aichiow
    const cx = c.left + c.width / 2
    const cy = c.top + c.height / 2
    ;(['anime', 'manga', 'manhwa', 'novel'] as NodeKey[]).forEach(k => {
      const r = rects[k]
      if (!r) return
      const tx = r.left + r.width / 2
      const ty = r.top + r.height / 2
      lines.push({ id: `l-${k}`, from: { x: cx, y: cy }, to: { x: tx, y: ty } })
    })
  }

  const svgRef = useRef<SVGSVGElement | null>(null)
  const [svgBox, setSvgBox] = useState<DOMRect | null>(null)
  useEffect(() => {
    const update = () => setSvgBox(svgRef.current?.getBoundingClientRect() ?? null)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

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

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedNode(null) }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [])

  return (
    <>
      <Head>
        <title>About Aichiow</title>
      </Head>

      <main className="relative min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white antialiased">
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-3">
            <div className="w-9 h-9 relative">
              <Image src="/aichiow.png" alt="Aichiow" fill sizes="36px" className="object-contain" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">Aichiow</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDragEnabled(v => !v)}
              className="px-3 py-1 text-sm rounded-md bg-white/6 hover:bg-white/8"
              aria-pressed={dragEnabled}
            >
              {dragEnabled ? (lang === 'EN' ? 'Drag ON' : 'Drag AKTIF') : (lang === 'EN' ? 'Drag OFF' : 'Drag MATI')}
            </button>

            <button
              onClick={() => setLang(l => (l === 'EN' ? 'ID' : 'EN'))}
              className="relative w-22 h-9 flex items-center bg-gray-800 rounded-full px-1 cursor-pointer overflow-hidden border border-white/8"
              aria-label="Toggle language"
            >
              <motion.div
                layout
                className="absolute top-1 left-1 w-8 h-7 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-md"
                animate={{ x: lang === 'EN' ? 0 : 42 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              />
              <div className="relative z-10 w-full flex justify-between px-2 text-xs font-medium">
                <span className="select-none">EN</span>
                <span className="select-none">ID</span>
              </div>
            </button>
          </div>
        </div>

        <section className="relative z-20 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400"
          >
            {lang === 'EN' ? 'How Aichiow Works' : 'Cara Kerja Aichiow'}
          </motion.h1>
          <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-2">
            {lang === 'EN'
              ? 'Interactive database flow: Aichiow in the center synchronizes metadata with content nodes and serves APIs for consumption.'
              : 'Alur database interaktif: Aichiow di tengah menyinkronkan metadata dengan node konten dan menyajikan API untuk konsumsi.'}
          </p>
        </section>

        <section className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          <div className="relative">
            <div className="relative w-full min-h-[420px] md:min-h-[520px] rounded-3xl bg-gradient-to-br from-white/3 to-transparent border border-white/6 p-4 flex flex-col md:flex-row items-center justify-center gap-6 overflow-visible">
              <div className="flex flex-row md:flex-col items-center gap-6 md:gap-10 w-full md:w-auto justify-center md:justify-end">
                <InteractiveNode ref={refs.anime} id="anime" dragEnabled={dragEnabled} meta={NODE_META.anime} onOpen={() => setSelectedNode('anime')} />
                <InteractiveNode ref={refs.manga} id="manga" dragEnabled={dragEnabled} meta={NODE_META.manga} onOpen={() => setSelectedNode('manga')} />
              </div>

              <div className="relative flex items-center justify-center w-44 h-44 md:w-56 md:h-56">
                <motion.div
                  ref={refs.aichiow}
                  initial={{ scale: 0.98 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-40 h-40 md:w-52 md:h-52 rounded-2xl bg-gradient-to-br from-pink-700/20 to-indigo-900/10 border border-white/10 p-3 flex items-center justify-center cursor-pointer shadow-lg"
                  onClick={() => setSelectedNode('aichiow')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="absolute -inset-0.5 rounded-2xl blur opacity-25 bg-gradient-to-r from-pink-500 to-purple-500" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="w-16 h-16 md:w-20 md:h-20 relative">
                      <Image src={NODE_META.aichiow.img} alt="Aichiow" fill sizes="80px" className="object-contain" />
                    </div>
                    <div className="text-sm md:text-base font-semibold">{NODE_META.aichiow.label}</div>
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-row md:flex-col items-center gap-6 md:gap-10 w-full md:w-auto justify-center md:justify-start">
                <InteractiveNode ref={refs.manhwa} id="manhwa" dragEnabled={dragEnabled} meta={NODE_META.manhwa} onOpen={() => setSelectedNode('manhwa')} />
                <InteractiveNode ref={refs.novel} id="novel" dragEnabled={dragEnabled} meta={NODE_META.novel} onOpen={() => setSelectedNode('novel')} />
              </div>

              <svg ref={svgRef} className="pointer-events-none absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="grad-flow" x1="0" x2="1">
                    <stop offset="0%" stopColor="#ff7ab6" stopOpacity="0.95" />
                    <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.95" />
                  </linearGradient>
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="url(#grad-flow)" />
                  </marker>
                </defs>

                {mapped.map((m, i) => (
                  <g key={m.id}>
                    <motion.path
                      d={m.d}
                      stroke="url(#grad-flow)"
                      strokeWidth={3}
                      fill="transparent"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      markerEnd="url(#arrow)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: i * 0.08, ease: 'easeOut' }}
                      style={{ filter: 'drop-shadow(0 8px 20px rgba(139,92,246,0.12))' }}
                    />
                    <motion.circle
                      r={5}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
                      transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.22 }}
                      cx={(m.x1 * 0.55 + m.x2 * 0.45)}
                      cy={(m.y1 * 0.55 + m.y2 * 0.45)}
                      fill="url(#grad-flow)"
                    />
                  </g>
                ))}
              </svg>
            </div>

            <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center items-center text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 inline-block" />
                <span>{lang === 'EN' ? 'Central sync and API orchestration' : 'Sinkronisasi pusat dan orkestrasi API'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white/10 inline-block" />
                <span>{lang === 'EN' ? 'ETL pipelines, webhooks and scheduled syncs' : 'Pipeline ETL, webhook dan sinkron terjadwal'}</span>
              </div>
            </div>
          </div>
        </section>

        <FeatureGrid lang={lang} />

        <AnimatePresence>
          {selectedNode && (
            <NodeModal key={selectedNode} node={selectedNode} lang={lang} onClose={() => setSelectedNode(null)} />
          )}
        </AnimatePresence>

        <section className="relative z-10 max-w-3xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold text-center mb-6">{lang === 'EN' ? 'FAQ' : 'Pertanyaan Umum'}</h2>
          <FAQ lang={lang} />
        </section>

        <footer className="relative z-10 text-center text-sm text-gray-400 py-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6" />
          © {new Date().getFullYear()} Aichiow Plus. All rights reserved.
        </footer>
      </main>
    </>
  )
}

const InteractiveNode = forwardRef<HTMLDivElement, {
  id: Exclude<NodeKey, 'aichiow'>
  meta: { label: string; img: string }
  dragEnabled: boolean
  onOpen: () => void
}>(({ id, meta, dragEnabled, onOpen }, ref) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { damping: 18, stiffness: 220 })
  const sy = useSpring(y, { damping: 18, stiffness: 220 })
  const nodeRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (ref && typeof ref !== 'function') (ref as React.MutableRefObject<HTMLDivElement | null>).current = nodeRef.current
  }, [ref])

  return (
    <motion.div
      ref={nodeRef}
      style={{ x: sx, y: sy }}
      drag={dragEnabled ? true : false}
      dragConstraints={{ top: -60, left: -60, right: 60, bottom: 60 }}
      dragElastic={0.12}
      whileTap={{ scale: 0.96 }}
      onDoubleClick={onOpen}
      onClick={onOpen}
      className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-slate-800/20 to-slate-900/10 border border-white/8 rounded-2xl flex flex-col items-center justify-center cursor-grab p-2 shadow-sm"
      role="button"
      tabIndex={0}
    >
      <div className="relative w-12 h-12 md:w-14 md:h-14 mb-1">
        <Image src={meta.img} alt={meta.label} fill sizes="56px" className="object-contain" />
      </div>
      <div className="text-xs md:text-sm font-medium text-center">{meta.label}</div>
    </motion.div>
  )
})
InteractiveNode.displayName = 'InteractiveNode'

function FeatureGrid({ lang }: { lang: 'EN' | 'ID' }) {
  const items = [
    {
      title: lang === 'EN' ? 'Curated Picks' : 'Pilihan Kurasi',
      desc: lang === 'EN' ? 'Editor & algorithmic recommendations combined.' : 'Kombinasi rekomendasi editor dan algoritma.'
    },
    {
      title: lang === 'EN' ? 'Community Tools' : 'Alat Komunitas',
      desc: lang === 'EN' ? 'Lists, follows, and user collections.' : 'Daftar, follow, dan koleksi pengguna.'
    },
    {
      title: lang === 'EN' ? 'Realtime Sync' : 'Sinkron Realtime',
      desc: lang === 'EN' ? 'Webhooks, schedule jobs, and delta updates.' : 'Webhook, job terjadwal, dan update delta.'
    },
    {
      title: lang === 'EN' ? 'Global CDN' : 'CDN Global',
      desc: lang === 'EN' ? 'Fast asset delivery and caching for users worldwide.' : 'Pengiriman aset cepat dan caching untuk pengguna di seluruh dunia.'
    }
  ]
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((it, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.06 }} className="p-4 bg-gradient-to-b from-white/4 to-transparent rounded-xl border border-white/8">
          <h3 className="font-semibold text-md mb-1">{it.title}</h3>
          <p className="text-sm text-gray-300">{it.desc}</p>
        </motion.div>
      ))}
    </section>
  )
}

function NodeModal({ node, lang, onClose }: { node: NodeKey; lang: 'EN' | 'ID'; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ y: 18, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 6, opacity: 0 }} transition={{ duration: 0.16 }} className="max-w-md w-full bg-gradient-to-br from-slate-900/90 to-black/90 border border-white/10 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
            <Image src={NODE_META[node].img} alt={NODE_META[node].label} fill sizes="56px" className="object-contain p-2" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{NODE_META[node].label}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <p className="mt-2 text-gray-300 text-sm">{lang === 'EN' ? NODE_META[node].descEN : NODE_META[node].descID}</p>
            <div className="mt-4 text-xs text-gray-400">
              {node === 'aichiow' ? (
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
              <button onClick={onClose} className="px-3 py-2 rounded-md bg-white/6 text-sm hover:bg-white/8">{lang === 'EN' ? 'Close' : 'Tutup'}</button>
              <a href="/home" className="ml-auto px-3 py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 text-sm font-medium">{lang === 'EN' ? 'Explore' : 'Jelajahi'}</a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function FAQ({ lang }: { lang: 'EN' | 'ID' }) {
  const items = lang === 'EN'
    ? [
        { q: 'What is Aichiow?', a: 'Aichiow is a unified platform for anime, manga, manhwa and light novels.' },
        { q: 'Is it free?', a: 'Yes. Core features are free; premium features may be introduced later.' },
        { q: 'Where does data come from?', a: 'We integrate trusted APIs such as Anilist and MangaDex and support webhooks.' }
      ]
    : [
        { q: 'Apa itu Aichiow?', a: 'Aichiow adalah platform terpadu untuk anime, manga, manhwa, dan light novel.' },
        { q: 'Apakah gratis?', a: 'Ya. Fitur inti gratis; fitur premium mungkin hadir kemudian.' },
        { q: 'Dari mana data berasal?', a: 'Kami mengintegrasikan API terpercaya seperti Anilist dan MangaDex serta mendukung webhook.' }
      ]
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <div key={i} className="rounded-lg bg-white/5 border border-white/8 overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-4 py-3 text-left flex justify-between items-center font-medium hover:bg-white/6">
            <span>{f.q}</span>
            <span>{open === i ? '-' : '+'}</span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="px-4 pb-4 text-gray-300 text-sm">
                {f.a}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
