'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCircle, FaCheckCircle, FaTimesCircle, FaBookOpen } from 'react-icons/fa'

interface APIItem {
  name: string
  method: string
  path: string
  desc: string
  status: 'online' | 'maintenance'
}

const endpoints: APIItem[] = [
  { name: 'Search Anime', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=anime&action=search&query={text}', desc: 'Search anime', status: 'online' },
  { name: 'Search Manga', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=manga&action=search&query={text}', desc: 'Search manga', status: 'online' },
  { name: 'Search Manhwa', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=manhwa&action=search&query={text}', desc: 'Search manhwa', status: 'online' },
  { name: 'Light Novel Search', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=ln&action=search&query={text}', desc: 'Search light novels', status: 'online' },
  { name: 'Media Detail', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=anime&action=detail&id={value}', desc: 'Get media detail by ID', status: 'online' },
  { name: 'Trending', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?action=trending', desc: 'Trending anime & manga', status: 'online' },
  { name: 'AI Chat', method: 'POST', path: 'https://aichixia.vercel.app/api/chat', desc: 'AI-powered anime assistant', status: 'online' },
  { name: 'Staff Detail', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?action=staff&id={value}', desc: 'Staff detail', status: 'maintenance' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

const StatusBadge = ({ status }: { status: 'online' | 'maintenance' }) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
      status === 'online'
        ? 'bg-green-500 text-white shadow-green-400/50 animate-pulse'
        : 'bg-red-500 text-white shadow-red-400/50'
    }`}
  >
    {status === 'online' ? <FaCheckCircle /> : <FaTimesCircle />}
    {status === 'online' ? 'Online' : 'Maintenance'}
  </span>
)

export default function APIPage() {
  const [data, setData] = useState<APIItem[]>(endpoints)

  useEffect(() => {
    const interval = setInterval(() => setData([...endpoints]), 15000)
    return () => clearInterval(interval)
  }, [])

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
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-primary to-white text-transparent bg-clip-text flex justify-center items-center gap-3">
          <FaBookOpen /> Aichixia API
        </h1>
        <p className="text-neutral-400 mt-4 text-lg md:text-xl">
          Real-time API endpoints status.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        custom={1}
        viewport={{ once: true }}
        className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {data.map((item, i) => (
          <motion.div
            key={item.name}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={i}
            viewport={{ once: true }}
            className="bg-[#111111] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-primary/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{item.name}</h2>
              <StatusBadge status={item.status} />
            </div>
            <p className="text-sm text-neutral-400 mt-3 break-all">{item.path}</p>
            <p className="text-sm text-neutral-400 mt-3">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        custom={2}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mt-24 text-center text-neutral-500 text-sm md:text-base"
      >
        <p>
          All endpoints are currently online or in maintenance. For integration info, visit our API Docs.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        custom={3}
        viewport={{ once: true }}
        className="mt-12 text-center text-neutral-500 text-xs flex flex-col md:flex-row justify-center gap-4"
      >
        <span>© {new Date().getFullYear()} Aichiow Plus. All rights reserved.</span>
      </motion.div>
    </section>
  )
}
