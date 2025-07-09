'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const STORAGE_KEY = 'aichiow-test'

export default function UpdateModal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY)
    if (!seen) setVisible(true)
  }, [])

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'seen')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-neutral-900 text-white p-6 rounded-xl max-w-md w-full shadow-2xl border border-neutral-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-white/60 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-2">🚀 Aichiow beta Telah Hadir!</h2>
            <p className="text-sm text-neutral-300 mb-4">
              Selamat datang di Aichiow Beta yang menyediakan semua kebutuhan animelovers
            <p>
             
                Oke, sip!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
