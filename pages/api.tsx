'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import {
  FaBookOpen,
  FaKey,
  FaFilm,
  FaComments,
  FaStickyNote,
  FaTerminal,
  FaCheckCircle,
  FaTimesCircle,
  FaCopy,
} from "react-icons/fa"

const base = "https://aichixia.vercel.app"

const services = [
  { method: "GET", path: `${base}/api/aichixia?category=anime&action=search&query={text}`, desc: "Search anime (requires query)", active: true },
  { method: "GET", path: `${base}/api/aichixia?category=manga&action=search&query={text}`, desc: "Search manga (requires query)", active: true },
  { method: "GET", path: `${base}/api/aichixia?category=manhwa&action=search&query={text}`, desc: "Search manhwa (requires query)", active: true },
  { method: "GET", path: `${base}/api/aichixia?category=manhua&action=search&query={text}`, desc: "Search manhua (requires query)", active: true },
  { method: "GET", path: `${base}/api/aichixia?category=ln&action=search&query={text}`, desc: "Search light novels (requires query)", active: true },
  { method: "GET", path: `${base}/api/aichixia?category=anime&action=detail&id={value}`, desc: "Media detail by ID (requires id)", active: true },
  { method: "GET", path: `${base}/api/aichixia?action=trending`, desc: "Trending anime & manga", active: true },
  { method: "GET", path: `${base}/api/aichixia?category=anime&action=seasonal`, desc: "Seasonal anime list", active: true },
  { method: "GET", path: `${base}/api/aichixia?action=airing`, desc: "Airing schedule", active: true },
  { method: "GET", path: `${base}/api/aichixia?category=anime&action=recommendations&id={value}`, desc: "Recommendations (requires id)", active: true },
  { method: "GET", path: `${base}/api/aichixia?category=manhwa&action=top-genre&genre={name}`, desc: "Top by genre (requires genre)", active: true },
  { method: "GET", path: `${base}/api/aichixia?action=character&id={value}`, desc: "Character detail (requires id)", active: true },
  { method: "GET", path: `${base}/api/aichixia?action=staff&id={value}`, desc: "Staff detail (requires id)", active: false, label: "Maintenance" },
  { method: "POST", path: `${base}/api/chat`, desc: "AI-powered anime assistant", active: true },
]

const StatusBadge = ({ active, label }: { active: boolean; label: string }) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-bold text-xs ${active ? "bg-green-500 text-white shadow-green-400/50 animate-pulse" : "bg-red-500 text-white shadow-red-400/50"} select-none`}
  >
    {active ? <FaCheckCircle /> : <FaTimesCircle />} {label}
  </span>
)

const CopyableCode = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)
  return (
    <div
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-blue-600 rounded-md font-medium cursor-pointer select-all transition-all hover:bg-gray-200"
      title={copied ? "Copied!" : "Click to copy"}
    >
      <code className="truncate">{text}</code> <FaCopy size={14} />
    </div>
  )
}

const Row = ({ method, path, desc, active = true, label }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-md transition-all cursor-pointer"
    onClick={() => navigator.clipboard.writeText(path)}
    title="Click to copy API path"
  >
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
      <div className="flex items-center gap-3 flex-wrap">
        <code className="px-3 py-1 rounded-lg bg-blue-500 text-white font-bold">{method}</code>
        <CopyableCode text={path} />
      </div>
      <StatusBadge active={active} label={label ?? (active ? "Active" : "Inactive")} />
    </div>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{desc}</p>
  </motion.div>
)

export default function APIDocs() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-12 font-sans">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 flex justify-center items-center gap-4">
          <FaBookOpen /> Aichixia API Docs
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-xl mx-auto">
          Centralized API for anime, manga, manhwa, manhua, and light novels. Powered by AniList + Gemini AI.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2 mb-6">
          <FaFilm /> Aichixia Endpoints
        </h2>
        <div className="grid gap-6">
          {services.map((s, i) => (
            <Row key={i} {...s} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2 mb-6">
          <FaStickyNote /> Notes
        </h2>
        <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-2">
          <li>Categories: <b>anime</b>, <b>manga</b>, <b>manhwa</b>, <b>manhua</b>, <b>ln</b>.</li>
          <li>Required parameters:
            <ul className="list-disc list-inside ml-6">
              <li><code>id</code> → detail, character, staff, recommendations</li>
              <li><code>query</code> → search</li>
              <li><code>genre</code> → top-genre</li>
            </ul>
          </li>
        </ul>
      </section>

      <footer className="text-center mt-12 text-gray-400 text-sm flex flex-col md:flex-row justify-center gap-4 items-center">
        <FaTerminal /> © {new Date().getFullYear()} Aichiow Plus. Anime-first AI Assistant.
      </footer>
    </main>
  )
}
