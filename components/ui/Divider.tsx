'use client'
import { motion } from 'framer-motion'

export default function Divider() {
  return (
    <motion.div
      className="w-full px-4 md:px-10 py-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
    </motion.div>
  )
}
