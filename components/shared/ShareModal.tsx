"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaWhatsapp, FaTelegramPlane, FaLink } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

interface ShareModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  url: string
  thumbnail: string
}

export default function ShareModal({ open, setOpen, title, url, thumbnail }: ShareModalProps) {
  const [toast, setToast] = useState<string | null>(null)

  const shareData = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setToast("Link copied")
    setTimeout(() => setToast(null), 2000)
  }

  // Tutup modal dengan ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [setOpen])

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Konten Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 text-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 relative"
            >
              {/* Tombol close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
              >
                ✕
              </button>

              {/* Preview Thumbnail */}
              <div className="flex items-center gap-4">
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-20 h-28 object-cover rounded-lg shadow-md"
                />
                <div>
                  <h2 className="font-bold text-lg line-clamp-2">{title}</h2>
                  <p className="text-sm text-gray-400 truncate max-w-[180px]">{url}</p>
                </div>
              </div>

              {/* Tombol share */}
              <div className="flex justify-center gap-4 mt-6">
                <a
                  href={shareData.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-green-600 hover:bg-green-700 transition"
                >
                  <FaWhatsapp size={22} />
                </a>
                <a
                  href={shareData.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-sky-500 hover:bg-sky-600 transition"
                >
                  <FaTelegramPlane size={22} />
                </a>
                <a
                  href={shareData.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-black hover:bg-gray-900 transition"
                >
                  <FaXTwitter size={22} />
                </a>
                <button
                  onClick={copyToClipboard}
                  className="p-3 rounded-full bg-gray-700 hover:bg-gray-800 transition"
                >
                  <FaLink size={22} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
