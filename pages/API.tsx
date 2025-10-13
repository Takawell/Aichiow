'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaCircle, FaCopy, FaCheck } from 'react-icons/fa'

interface ApiEndpoint {
  name: string
  method: 'GET' | 'POST'
  path: string
  desc: string
  status: 'online' | 'maintenance'
}

const endpoints: ApiEndpoint[] = [
  { name: 'Search Anime', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=anime&action=search&query={text}', desc: 'Search anime', status: 'online' },
  { name: 'Search Manga', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=manga&action=search&query={text}', desc: 'Search manga', status: 'online' },
  { name: 'Search Manhwa', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=manhwa&action=search&query={text}', desc: 'Search manhwa', status: 'online' },
  { name: 'Light Novel Search', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=ln&action=search&query={text}', desc: 'Search light novels', status: 'online' },
  { name: 'Media Detail', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=anime&action=detail&id={value}', desc: 'Get media detail by ID', status: 'online' },
  { name: 'Trending', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?action=trending', desc: 'Trending anime & manga', status: 'online' },
  { name: 'AI Chat', method: 'POST', path: 'https://aichixia.vercel.app/api/chat', desc: 'AI-powered anime assistant', status: 'online' },
  { name: 'Staff Detail', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?action=staff&id={value}', desc: 'Staff detail', status: 'maintenance' },
]

const statusColors = {
  online: 'text-green-500',
  maintenance: 'text-yellow-400',
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
}

export default function ApiPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filteredEndpoints = useMemo(() => {
    return endpoints.filter(
      (ep) =>
        ep.name.toLowerCase().includes(search.toLowerCase()) ||
        ep.method.toLowerCase().includes(search.toLowerCase()) ||
        ep.status.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path)
    setCopied(path)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0f0f10] via-[#16171a] to-[#0a0a0a] py-24 px-6 md:px-12">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        custom={0}
        viewport={{ once: true }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-primary to-white text-transparent bg-clip-text">
          API Endpoints
        </h1>
        <p className="text-neutral-400 mt-4 text-lg md:text-xl">
          Explore all available API endpoints with live status and easy copy.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        custom={1}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mt-10 bg-[#111111] border border-white/10 rounded-xl p-6 text-white"
      >
        <h2 className="text-xl font-semibold mb-3">Notes</h2>
        <ul className="text-sm text-neutral-400 space-y-2">
          <li>Categories: <span className="text-white">anime, manga, manhwa, manhua, ln</span></li>
          <li>Required parameters:</li>
          <ul className="ml-6 list-disc text-neutral-400">
            <li><span className="text-white">id</span> → for detail, character, staff, recommendations</li>
            <li><span className="text-white">query</span> → for search</li>
            <li><span className="text-white">genre</span> → for top-genre</li>
          </ul>
        </ul>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        custom={2}
        viewport={{ once: true }}
        className="mt-12 max-w-3xl mx-auto"
      >
        <input
          type="text"
          placeholder="Search endpoints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#1b1b1f] border border-white/20 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        custom={3}
        viewport={{ once: true }}
        className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {filteredEndpoints.map((ep, i) => (
          <motion.div
            key={ep.name}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={i}
            viewport={{ once: true }}
            className="bg-[#111111] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-primary/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{ep.name}</h2>
              <div className={`flex items-center gap-2 ${statusColors[ep.status]}`}>
                <FaCircle />
                <span className="capitalize">{ep.status}</span>
              </div>
            </div>
            <p className="text-sm text-neutral-400 mt-3">{ep.desc}</p>
            <div className="mt-3 flex items-center justify-between">
              <code className="text-xs text-white break-all">{ep.path}</code>
              <button
                onClick={() => handleCopy(ep.path)}
                className="ml-2 p-2 rounded-full bg-primary/20 hover:bg-primary/40 transition-colors"
                title="Copy API URL"
              >
                {copied === ep.path ? <FaCheck className="text-green-400" /> : <FaCopy />}
              </button>
            </div>
            <span className="mt-3 inline-block px-3 py-1 text-xs rounded-full bg-white/10 text-white w-fit">
              {ep.method}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        custom={4}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mt-24 text-center text-neutral-500 text-sm md:text-base"
      >
        <p>
          All endpoints are monitored in real-time. Use the search bar or notes to quickly find the endpoint you need.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        custom={5}
        viewport={{ once: true }}
        className="mt-12 text-center text-neutral-500 text-xs flex flex-col md:flex-row justify-center gap-4"
      >
        <span>© {new Date().getFullYear()} Aichiow Plus. All rights reserved.</span>
      </motion.div>
    </section>
  )
}
