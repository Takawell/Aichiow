'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, SwitchCamera } from 'lucide-react'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import ThemeToggle from '@/components/shared/ThemeToggle'
import { classNames } from '@/utils/classNames'
import { useState, useEffect } from 'react'
import { PiSparkleFill } from 'react-icons/pi'
import { FaRegUserCircle } from 'react-icons/fa'
import BottomNav from './BottomNav'

const navItems = [
  { href: '/home', label: 'HOME' },
  { href: '/upcoming', label: 'SCHEDULE' },
  { href: '/explore', label: 'EXPLORE' },
  { href: '/manga', label: 'MANGA' },
  { href: '/manhwa', label: 'MANHWA' },
  { href: '/light-novel', label: 'LIGHT NOVEL' },
]

export default function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [mode, setMode] = useState<'floating' | 'hamburger'>('floating')

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('navMode')
    if (saved === 'floating' || saved === 'hamburger') {
      setMode(saved)
    }
  }, [])

  const toggleMode = () => {
    const next = mode === 'floating' ? 'hamburger' : 'floating'
    setMode(next)
    localStorage.setItem('navMode', next)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={classNames(
          'sticky top-0 z-50 transition-all duration-300 backdrop-blur-lg animate-fade-down',
          scrolled ? 'bg-neutral-900/80 shadow-lg' : 'bg-neutral-900/50',
          mounted ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="w-full px-4 md:px-10 py-3 flex items-center justify-between">

          <Link
            href="/"
            className="logo-gradient text-2xl font-extrabold tracking-wide hover:scale-105 transition-transform"
          >
            AICHIOW
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6 text-sm md:text-base font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    'nav-link hover:text-sky-400 transition-colors duration-200',
                    router.pathname.startsWith(item.href) ? 'text-sky-400' : 'text-white'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-4">

            <Link
              href="/aichixia"
              className="text-sky-400 hover:text-sky-300 active:scale-95 transition-transform"
              title="AI Assistant"
            >
              <PiSparkleFill className="text-2xl" />
            </Link>

            <button
              onClick={toggleMode}
              className="p-1.5 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 active:scale-95"
              title="Switch Navigation Mode"
            >
              <SwitchCamera className="h-5 w-5" />
            </button>

            {mode === 'hamburger' && (
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button aria-label="Menu">
                    <Menu className="h-7 w-7" />
                  </button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="bg-neutral-900 text-white w-64 sm:w-72 animate-slide-in"
                >
                  <div className="flex flex-col gap-6 mt-10 px-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={classNames(
                          'text-lg font-medium hover:text-sky-400 transition',
                          router.pathname.startsWith(item.href)
                            ? 'text-sky-400'
                            : 'text-white'
                        )}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="absolute bottom-6 left-4">
                    <ThemeToggle />
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>

      {mode === 'floating' && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}
    </>
  )
}
