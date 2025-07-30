// ThemeToggle
'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      document.documentElement.classList.toggle('dark', storedTheme === 'dark')
      setIsDark(storedTheme === 'dark')
    } else {
      // Default ke dark
      document.documentElement.classList.add('dark')
      setIsDark(true)
    }
  }, [])

  function toggleTheme() {
    const nextTheme = isDark ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
    localStorage.setItem('theme', nextTheme)
    setIsDark(!isDark)

    // Trigger flash animasi
    setFlash(true)
    setTimeout(() => setFlash(false), 400)
  }

  return (
    <>
      <button
        onClick={toggleTheme}
        className="relative p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-all duration-300 ease-in-out transform hover:scale-110 shadow-lg z-20"
        aria-label="Toggle Theme"
      >
        {isDark ? (
          <Sun size={20} className="text-yellow-400 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Moon size={20} className="text-blue-400 transition-transform duration-300 rotate-180 scale-100" />
        )}
      </button>

      {/* Flash Overlay */}
      {flash && (
        <div className="fixed inset-0 pointer-events-none z-10 bg-gradient-to-br from-sky-400/40 via-blue-500/20 to-transparent animate-flash" />
      )}
    </>
  )
}
