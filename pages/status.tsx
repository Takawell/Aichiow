'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCircle } from 'react-icons/fa'

interface StatusItem {
  name: string
  type: string
  status: 'online'
  lastChecked: string
}

const services: StatusItem[] = [
  { name: 'Anime', type: 'Content', status: 'online', lastChecked: new Date().toISOString() },
  { name: 'Manga', type: 'Content', status: 'online', lastChecked: new Date().toISOString() },
  { name: 'Manhwa', type: 'Content', status: 'online', lastChecked: new Date().toISOString() },
  { name: 'Light Novel', type: 'Content', status: 'online', lastChecked: new Date().toISOString() },
  { name: 'Aichixia', type: 'AI Assistant', status: 'online', lastChecked: new Date().toISOString() },
  { name: 'Search Anime from Image', type: 'Search Engine', status: 'online', lastChecked: new Date().toISOString() },
]

const statusColors = {
  online: 'text-green-500',
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
}

export default function StatusPage() {
  const [data, setData] = useState<StatusItem[]>(services)

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((item) => ({
          ...item,
          lastChecked: new Date().toISOString(),
        }))
      )
    }, 15000)
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
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-primary to-white text-transparent bg-clip-text">
          Platform Status
        </h1>
        <p className="text-neutral-400 mt-4 text-lg md:text-xl">
          Real-time health and availability of all content, AI Assistant services, and cutting-edge features.
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
              <div className={`flex items-center gap-2 ${statusColors[item.status]}`}>
                <FaCircle />
                <span className="capitalize">{item.status}</span>
              </div>
            </div>
            <p className="text-sm text-neutral-400 mt-3">
              Type: <span className="text-white">{item.type}</span>
            </p>
            <p className="text-xs text-neutral-500 mt-2">
              Last checked: {new Date(item.lastChecked).toLocaleTimeString()}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 bg-gradient-to-r from-primary to-purple-600 text-white font-medium px-4 py-2 rounded-full shadow-md hover:brightness-110 transition-all"
            >
              Refresh
            </motion.button>
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
          All services are fully operational. For developers, check our{' '}
          <a href="/API" className="text-primary hover:underline">
            API Docs
          </a>{' '}
          for full integration and metrics.
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
