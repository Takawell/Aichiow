"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaWhatsapp, FaInstagram, FaTelegramPlane, FaLink } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

interface ShareModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  image: string
  url: string
}

export default function ShareModal({
  open,
  setOpen,
  title,
  image,
  url,
}: ShareModalProps) {
  const shareData = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(url)}`,
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    alert("Link copied to clipboard ✅")
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-gray-900 text-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              ✕
            </button>

            {/* Thumbnail + Info */}
            <div className="flex items-center gap-4">
              <img
                src={image}
                alt={title}
                className="w-20 h-28 object-cover rounded-lg shadow-md"
              />
              <div>
                <h2 className="font-bold text-lg line-clamp-2">{title}</h2>
                <p className="text-sm text-gray-400 truncate max-w-[180px]">
                  {url}
                </p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex justify-center gap-5 mt-6">
              <a
                href={shareData.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-green-600 hover:bg-green-700 shadow-md hover:scale-110 transition"
              >
                <FaWhatsapp size={22} />
              </a>
              <a
                href={shareData.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-sky-500 hover:bg-sky-600 shadow-md hover:scale-110 transition"
              >
                <FaTelegramPlane size={22} />
              </a>
              <a
                href={shareData.x}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-black hover:bg-gray-900 shadow-md hover:scale-110 transition"
              >
                <FaXTwitter size={22} />
              </a>
              <a
                href={shareData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-pink-500 hover:bg-pink-600 shadow-md hover:scale-110 transition"
              >
                <FaInstagram size={22} />
              </a>
              <button
                onClick={copyToClipboard}
                className="p-3 rounded-full bg-gray-700 hover:bg-gray-800 shadow-md hover:scale-110 transition"
              >
                <FaLink size={22} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
