'use client'
import { motion } from 'framer-motion'

interface DividerProps {
  title?: string
}

export default function Divider({ title }: DividerProps) {
  return (
    <motion.div
      className="w-full flex items-center gap-4 py-8 px-4 md:px-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex-grow h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
      {title && (
        <h2 className="text-xl md:text-2xl font-semibold text-center text-white whitespace-nowrap">
          {title}
        </h2>
      )}
      <div className="flex-grow h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
    </motion.div>
  )
}
