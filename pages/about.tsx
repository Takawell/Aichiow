'use client'

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState, RefObject, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type NodeKey = 'anime' | 'manga' | 'manhwa' | 'novel' | 'aichiow'

const NODE_META: Record<
  Exclude<NodeKey, 'aichiow'> | 'aichiow',
  { label: string; img: string; descEN: string; descID: string }
> = {
  aichiow: {
    label: 'Aichiow',
    img: '/aichiow.png',
    descEN: 'Aichiow — central hub for discovery, recommendations and community.',
    descID: 'Aichiow — pusat untuk penemuan, rekomendasi, dan komunitas.'
  },
  anime: {
    label: 'Anime',
    img: '/anime.png',
    descEN: 'Tracks anime titles, seasons, and streaming metadata.',
    descID: 'Melacak judul anime, musim, dan metadata streaming.'
  },
  manga: {
    label: 'Manga',
    img: '/manga.png',
    descEN: 'Manga entries with chapters and scanning sources.',
    descID: 'Entri manga dengan chapter dan sumber scan.'
  },
  manhwa: {
    label: 'Manhwa',
    img: '/manhwa.png',
    descEN: 'Manhwa cataloging, translations, and reading progress.',
    descID: 'Katalog manhwa, terjemahan, dan progres baca.'
  },
  novel: {
    label: 'Light Novel',
    img: '/novel.png',
    descEN: 'Light novels with volumes, translations, and metadata.',
    descID: 'Light novel dengan volume, terjemahan, dan metadata.'
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
    const update = () => {
      const next: Record<NodeKey, DOMRect | null> = {
        aichiow: refs.aichiow.current?.getBoundingClientRect() ?? null,
        anime: refs.anime.current?.getBoundingClientRect() ?? null,
        manga: refs.manga.current?.getBoundingClientRect() ?? null,
        manhwa: refs.manhwa.current?.getBoundingClientRect() ?? null,
        novel: refs.novel.current?.getBoundingClientRect() ?? null
      }
      setRects(next)
    }
    update()
    const ro = new ResizeObserver(update)
    Object.values(refs).forEach(r => r.current && ro.observe(r.current))
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [refs.aichiow, refs.anime, refs.manga, refs.manhwa, refs.novel])

  return rects
}

export default function AboutPage() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN')
  const [selectedNode, setSelectedNode] = useState<NodeKey | null>(null)

  const refs: Record<NodeKey, RefObject<HTMLDivElement>> = {
    aichiow: useRef<HTMLDivElement>(null),
    anime: useRef<HTMLDivElement>(null),
    manga: useRef<HTMLDivElement>(null),
    manhwa: useRef<HTMLDivElement>(null),
    novel: useRef<HTMLDivElement>(null)
  }

  const rects = useRects(refs)

  const lines: Array<{
    from: { x: number; y: number }
    to: { x: number; y: number }
    id: string
  }> = []

  if (rects.aichiow) {
    const centerRect = rects.aichiow
    const cx = centerRect.left + centerRect.width / 2
    const cy = centerRect.top + centerRect.height / 2
    ;(['anime', 'manga', 'manhwa', 'novel'] as NodeKey[]).forEach(k => {
      const r = rects[k]
      if (!r) return
      const tx = r.left + r.width / 2
      const ty = r.top + r.height / 2
      lines.push({
        from: { x: cx, y: cy },
        to: { x: tx, y: ty },
        id: `line-${k}`
      })
    })
  }

  const svgRef = useRef<SVGSVGElement | null>(null)
  const [svgBox, setSvgBox] = useState<DOMRect | null>(null)
  useEffect(() => {
    const update = () => {
      setSvgBox(svgRef.current?.getBoundingClientRect() ?? null)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const mappedLines = (svgBox && lines.length
    ? lines.map(l => ({
        id: l.id,
        x1: l.from.x - svgBox.left,
        y1: l.from.y - svgBox.top,
        x2: l.to.x - svgBox.left,
        y2: l.to.y - svgBox.top
      }))
    : []
  ).map(l => ({
    ...l,
    d: `M ${l.x1} ${l.y1} C ${(l.x1 + l.x2) / 2} ${l.y1} ${(l.x1 + l.x2) / 2} ${l.y2} ${l.x2} ${l.y2}`
  }))

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedNode(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <Head>
        <title>About Aichiow</title>
      </Head>

      <main className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
        <div className="relative z-20 max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/home" className="font-bold text-lg">Aichiow</Link>
          <motion.button
            onClick={() => setLang(lang === 'EN' ? 'ID' : 'EN')}
            whileTap={{ scale: 0.98 }}
            className="relative w-20 h-9 flex items-center bg-gray-800 rounded-full px-1 cursor-pointer overflow-hidden border border-gray-700"
          >
            <motion.div
              layout
              className="absolute top-1 left-1 w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg"
              animate={{ x: lang === 'EN' ? 0 : 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
            <span className="flex-1 text-center text-xs z-10 select-none">EN</span>
            <span className="flex-1 text-center text-xs z-10 select-none">ID</span>
          </motion.button>
        </div>

        <section className="relative z-10 text-center py-12 sm:py-20">
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
          >
            {lang === 'EN' ? 'About Aichiow' : 'Tentang Aichiow'}
          </motion.h1>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto px-4">
            {lang === 'EN'
              ? 'Discover, explore, and connect with the world of anime, manga, manhwa, and light novels.'
              : 'Temukan, jelajahi, dan terhubung dengan dunia anime, manga, manhwa, dan light novel.'}
          </p>
        </section>

        <section className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          <div className="relative">
            <div className="relative w-full min-h-[360px] sm:min-h-[420px] rounded-2xl bg-white/3 border border-white/6 p-4 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex flex-row sm:flex-col items-center gap-6 sm:gap-8 w-full sm:w-auto justify-center sm:justify-end">
                <NodeCard ref={refs.anime} keyName="anime" meta={NODE_META.anime} onClick={() => setSelectedNode('anime')} />
                <NodeCard ref={refs.manga} keyName="manga" meta={NODE_META.manga} onClick={() => setSelectedNode('manga')} />
              </div>

              <div className="relative flex items-center justify-center w-40 h-40 sm:w-52 sm:h-52">
                <div
                  ref={refs.aichiow}
                  className="flex flex-col items-center justify-center w-36 h-36 sm:w-48 sm:h-48 rounded-2xl bg-gradient-to-br from-pink-600/20 to-purple-700/10 border border-white/10 backdrop-blur p-3 cursor-pointer"
                  onClick={() => setSelectedNode('aichiow')}
                >
                  <motion.div
                    initial={{ scale: 0.98 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative rounded-lg w-full h-full flex items-center justify-center"
                  >
                    <div className="absolute -inset-0.5 rounded-lg blur opacity-30 bg-gradient-to-r from-pink-500 to-purple-500" />
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                        <Image src={NODE_META.aichiow.img} alt="Aichiow" fill sizes="80px" className="object-contain" />
                      </div>
                      <div className="text-sm sm:text-base font-semibold">{NODE_META.aichiow.label}</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="flex flex-row sm:flex-col items-center gap-6 sm:gap-8 w-full sm:w-auto justify-center sm:justify-start">
                <NodeCard ref={refs.manhwa} keyName="manhwa" meta={NODE_META.manhwa} onClick={() => setSelectedNode('manhwa')} />
                <NodeCard ref={refs.novel} keyName="novel" meta={NODE_META.novel} onClick={() => setSelectedNode('novel')} />
              </div>

              <svg ref={svgRef} className="pointer-events-none absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0%" stopColor="#ff7ab6" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                {mappedLines.map((L, idx) => (
                  <motion.path
                    key={L.id}
                    d={L.d}
                    stroke="url(#g1)"
                    strokeWidth={2.6}
                    fill="transparent"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: idx * 0.12, ease: 'easeOut' }}
                    style={{ filter: 'drop-shadow(0 2px 6px rgba(139,92,246,0.15))' }}
                  />
                ))}
              </svg>
            </div>
          </div>
        </section>

        <AnimatePresence>
          {selectedNode && (
            <motion.div
              key="node-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ y: 20, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="max-w-md w-full bg-black/90 border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    <Image src={NODE_META[selectedNode].img} alt={NODE_META[selectedNode].label} fill sizes="64px" className="object-contain p-2" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{NODE_META[selectedNode].label}</h3>
                      <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-white">✕</button>
                    </div>
                    <p className="mt-2 text-gray-300 text-sm">
                      {lang === 'EN' ? NODE_META[selectedNode].descEN : NODE_META[selectedNode].descID}
                    </p>
                    <div className="mt-4 text-xs text-gray-400">
                      {selectedNode === 'aichiow' ? (
                        <>
                          <div>Flow: central database → metadata store → indexers → API layer</div>
                          <div className="mt-2">Click other nodes to see how they connect.</div>
                        </>
                      ) : (
                        <>
                          <div>Role: content source → ingest → normalize → index → serve.</div>
                          <div className="mt-2">Status: sync via scheduled jobs & webhooks.</div>
                        </>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <a onClick={() => setSelectedNode(null)} className="cursor-pointer inline-block px-3 py-2 rounded-md bg-white/6 text-sm hover:bg-white/8">
                        {lang === 'EN' ? 'Close' : 'Tutup'}
                      </a>
                      <a href="/home" className="ml-auto inline-block px-3 py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 text-sm font-medium">
                        {lang === 'EN' ? 'Explore' : 'Jelajahi'}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="relative z-10 text-center text-sm text-gray-400 py-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6" />
          © {new Date().getFullYear()} Aichiow Plus. All rights reserved.
        </footer>
      </main>
    </>
  )
}

const NodeCard = forwardRef<HTMLDivElement, {
  keyName: Exclude<NodeKey, 'aichiow'>
  meta: { label: string; img: string }
  onClick: () => void
}>(({ keyName, meta, onClick }, ref) => {
  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-800/20 to-pink-700/10 border border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer backdrop-blur p-2"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 relative mb-2">
        <Image src={meta.img} alt={meta.label} fill sizes="56px" className="object-contain" />
      </div>
      <div className="text-xs sm:text-sm font-medium">{meta.label}</div>
    </motion.div>
  )
})

NodeCard.displayName = 'NodeCard'
