'use client'

import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Rocket,
  ListChecks,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import ReactMarkdown from 'react-markdown'
import Tilt from 'react-parallax-tilt'

const STORAGE_KEY = 'aichiow-update-version'
const CURRENT_VERSION = '2.0.0-superbeta'

type TabType = 'whatsnew' | 'changelog' | 'upcoming' | 'gallery'

export default function UpdateModal() {
  const [visible, setVisible] = useState(false)
  const [tab, setTab] = useState<TabType>('whatsnew')
  const [easterEgg, setEasterEgg] = useState(false)
  const doubleClickTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const seenVersion = localStorage.getItem(STORAGE_KEY)
    if (seenVersion !== CURRENT_VERSION) setVisible(true)

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowRight') nextTab()
      if (e.key === 'ArrowLeft') prevTab()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, CURRENT_VERSION)
    setVisible(false)
  }

  const tabs = [
    { key: 'whatsnew', icon: Rocket, label: "What's New" },
    { key: 'changelog', icon: ListChecks, label: 'Changelog' },
    { key: 'upcoming', icon: Calendar, label: 'Upcoming' },
    { key: 'gallery', icon: ImageIcon, label: 'Gallery' },
  ]

  const nextTab = () => {
    const currentIndex = tabs.findIndex((t) => t.key === tab)
    setTab(tabs[(currentIndex + 1) % tabs.length].key as TabType)
  }

  const prevTab = () => {
    const currentIndex = tabs.findIndex((t) => t.key === tab)
    setTab(tabs[(currentIndex - 1 + tabs.length) % tabs.length].key as TabType)
  }

  const triggerEasterEgg = () => {
    if (doubleClickTimeout.current) {
      clearTimeout(doubleClickTimeout.current)
      setEasterEgg(true)
      setTimeout(() => setEasterEgg(false), 3000)
    } else {
      doubleClickTimeout.current = setTimeout(() => {
        doubleClickTimeout.current = null
      }, 300)
    }
  }

  const particlesInit = async (main: any) => {
    await loadFull(main)
  }

  const particlesOptions = {
    background: { color: 'transparent' },
    fpsLimit: 60,
    particles: {
      color: { value: '#00f6ff' },
      links: { enable: true, color: '#00f6ff', distance: 120 },
      move: { enable: true, speed: 1 },
      number: { value: 40 },
      size: { value: { min: 1, max: 3 } },
    },
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-lg flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Particles
            id="update-modal-particles"
            init={particlesInit}
            options={particlesOptions}
            className="absolute inset-0 z-0"
          />

          <motion.div
            className="relative bg-neutral-900/80 backdrop-blur-2xl text-white p-8 rounded-2xl max-w-3xl w-full shadow-2xl border border-neutral-700/40 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { type: 'spring', stiffness: 120, damping: 12 },
            }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              boxShadow:
                '0 0 20px rgba(0, 246, 255, 0.3), 0 0 50px rgba(0, 246, 255, 0.2)',
            }}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="mb-6 text-center select-none"
              onClick={triggerEasterEgg}
            >
              <h2 className="text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2">
                🚀 Aichiow v{CURRENT_VERSION}
              </h2>
              <p className="text-neutral-300 mt-1 text-sm">
                Nikmati update super keren dengan fitur revolusioner!
              </p>
            </div>

            {easterEgg && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-cyan-500/20 pointer-events-none"
              >
                <p className="absolute bottom-4 right-4 text-pink-400 font-bold">
                  🌟 Easter Egg Unlocked!
                </p>
              </motion.div>
            )}

            <div className="flex justify-center mb-6 space-x-2">
              {tabs.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md ${
                    tab === key
                      ? 'bg-blue-600 text-white shadow-blue-500/40'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>

            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-neutral-200 min-h-[250px] overflow-y-auto pr-2"
            >
              {tab === 'whatsnew' && <WhatsNewContent />}
              {tab === 'changelog' && <ChangelogContent />}
              {tab === 'upcoming' && <UpcomingContent />}
              {tab === 'gallery' && <GalleryContent />}
            </motion.div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleClose}
                className="text-xs text-neutral-400 hover:text-neutral-200 underline"
              >
                Jangan tampilkan lagi
              </button>
              <button
                onClick={handleClose}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-semibold shadow-md hover:shadow-blue-500/40 transition transform hover:scale-105"
              >
                Siap, Lanjutkan!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// === Tab Contents ===

function WhatsNewContent() {
  return (
    <ul className="list-disc list-inside space-y-2 text-neutral-300">
      <li>🎨 Desain UI baru dengan efek Glassmorphism & Neon Glow.</li>
      <li>⚡ Performance boost 200% pada load halaman anime.</li>
      <li>🎬 Trailer anime langsung di hero section.</li>
      <li>📱 Fully responsive untuk semua device.</li>
    </ul>
  )
}

function ChangelogContent() {
  const markdown = `
### 🧾 v2.0.0-superbeta (30 Jul 2025)
- 🚀 Modal baru dengan efek 3D, particles, dan tabs
- 🎥 Hero banner support trailer anime
- 📷 Gallery carousel interaktif
- 🧠 Changelog berbasis Markdown

### v1.9.0
- Peningkatan performa search
- Refactor hook data anime

### v1.8.5
- Dark Mode toggle
- Bugfix halaman trending
  `
  return (
    <div className="prose prose-invert max-w-none text-sm text-neutral-300 prose-ul:pl-4 prose-li:marker:text-blue-400">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  )
}

function UpcomingContent() {
  return (
    <ul className="list-disc list-inside space-y-2 text-neutral-300">
      <li>✨ User profile page dengan statistik anime.</li>
      <li>📝 Bookmark & continue watching system.</li>
      <li>🌐 Multi-language support.</li>
      <li>💬 Comment system dengan emoji.</li>
    </ul>
  )
}

function GalleryContent() {
  const previews = [
    {
      title: 'Hero Banner Update',
      description: 'Hero section kini memiliki trailer anime full HD dengan tombol play.',
      image: '/preview1.png',
    },
    {
      title: 'Dark Mode Otomatis',
      description: 'Auto mendeteksi sistem OS kamu dan menyesuaikan tema.',
      image: '/preview2.png',
    },
    {
      title: 'UI Genre Baru',
      description: 'Tampilan genre lebih bersih dengan ikon dan filter langsung.',
      image: '/preview3.png',
    },
  ]

  return (
    <div className="w-full overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {previews.map((item, i) => (
          <Tilt
            glareEnable={true}
            glareMaxOpacity={0.4}
            glareColor="#00f6ff"
            glarePosition="all"
            scale={1.02}
            transitionSpeed={250}
            key={i}
            className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700 hover:shadow-blue-500/20 shadow-md transition duration-300"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
            <p className="text-xs text-neutral-300">{item.description}</p>
          </Tilt>
        ))}
      </div>
    </div>
  )
}
