'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      document.documentElement.classList.toggle('dark', storedTheme === 'dark')
      setIsDark(storedTheme === 'dark')
    } else {
      // Default ke dark mode
      document.documentElement.classList.add('dark')
      setIsDark(true)
    }
  }, [])

  function toggleTheme() {
    const nextTheme = isDark ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
    localStorage.setItem('theme', nextTheme)
    setIsDark(!isDark)
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-all duration-300 ease-in-out transform hover:scale-110 shadow-lg"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-400 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon size={20} className="text-blue-400 transition-transform duration-300 rotate-180 scale-100" />
      )}
    </button>
  )
}
