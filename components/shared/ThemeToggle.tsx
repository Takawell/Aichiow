"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const darkMode = storedTheme === "dark" || (!storedTheme && prefersDark)
    setIsDark(darkMode)
    document.documentElement.classList.toggle("dark", darkMode)
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    document.documentElement.classList.toggle("dark", !isDark)
    localStorage.setItem("theme", newTheme)
    setIsDark(!isDark)
  }

  if (!mounted) return null

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-neutral-900 to-neutral-700 dark:from-neutral-200 dark:to-white shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
      whileTap={{ scale: 0.9 }}
    >
      <motion.span
        key={isDark ? "dark" : "light"}
        initial={{ scale: 0, opacity: 0.4 }}
        animate={{ scale: [0, 1.3, 1], opacity: [0.4, 0.15, 0] }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 dark:from-blue-400 dark:to-purple-500"
      />

      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="text-yellow-400"
          >
            <Sun size={22} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="text-blue-600"
          >
            <Moon size={22} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
