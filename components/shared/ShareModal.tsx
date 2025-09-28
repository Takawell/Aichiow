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
    setToast("Link copied to clipboard!")
    setTimeout(() => setToast(null), 2000)
  }

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 80, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 80, scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-[90%] max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 text-white"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-300 hover:text-white transition text-xl"
              >
                ✕
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-20 h-28 object-cover rounded-2xl shadow-lg"
                />
                <div>
                  <h2 className="font-semibold text-lg line-clamp-2">{title}</h2>
                  <p className="text-sm text-gray-300 truncate max-w-[180px]">{url}</p>
                </div>
              </div>

              <div className="flex justify-center gap-6 mt-8">
                <a
                  href={shareData.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition transform hover:scale-110 hover:shadow-[0_0_15px_rgba(37,211,102,0.6)]"
                >
                  <FaWhatsapp size={22} />
                </a>
                <a
                  href={shareData.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition transform hover:scale-110 hover:shadow-[0_0_15px_rgba(0,136,204,0.6)]"
                >
                  <FaTelegramPlane size={22} />
                </a>
                <a
                  href={shareData.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition transform hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                >
                  <FaXTwitter size={22} />
                </a>
                <button
                  onClick={copyToClipboard}
                  className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition transform hover:scale-110 hover:shadow-[0_0_15px_rgba(180,180,180,0.6)]"
                >
                  <FaLink size={22} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-xl shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
