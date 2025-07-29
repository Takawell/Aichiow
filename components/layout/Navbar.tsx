'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu } from 'lucide-react'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import ThemeToggle from '@/components/shared/ThemeToggle'
import { classNames } from '@/utils/classNames'
import { useState, useEffect } from 'react'
import { FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'

const navItems = [
  { href: '/', label: 'HOME' },
  { href: '/upcoming', label: 'TIMETABLE' },
  { href: '/explore', label: 'EXPLORE' },
  { href: '/manga', label: 'MANGA' },
  { href: '/manhwa', label: 'MANHWA' },
  { href: '/light-novel', label: 'LIGHT NOVEL' },
]

export default function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={classNames(
        'sticky top-0 z-50 transition-all duration-300 backdrop-blur-lg',
        scrolled ? 'bg-neutral-900/80 shadow-lg' : 'bg-neutral-900/50'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
        {/* LOGO - pojok kiri */}
        <Link href="/" className="logo-gradient text-2xl font-extrabold tracking-wide">
          AICHIOW
        </Link>

        {/* NAV DESKTOP - pojok kanan */}
        <div className="hidden md:flex items-center gap-8 ml-auto">
          <nav className="flex gap-6 text-sm md:text-base font-medium">
            {navItems.map((item) => {
              const isActive =
                router.pathname === item.href || router.pathname.startsWith(item.href + '/')

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    'nav-link hover:text-sky-400',
                    isActive ? 'text-sky-400' : 'text-white'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <ThemeToggle />
        </div>

        {/* NAV MOBILE */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button aria-label="Menu">
                <Menu className="h-7 w-7" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-neutral-900 text-white w-64 sm:w-72">
              <div className="flex flex-col gap-6 mt-10 px-4">
                {navItems.map((item) => {
                  const isActive =
                    router.pathname === item.href || router.pathname.startsWith(item.href + '/')

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={classNames(
                        'text-lg font-medium transition hover:text-sky-400',
                        isActive ? 'text-sky-400' : 'text-white'
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                })}

                {/* Community Links */}
                <div className="mt-8 border-t border-white/20 pt-4">
                  <p className="text-sm font-semibold uppercase text-white/60 mb-3">Community</p>
                  <div className="flex gap-4 text-lg">
                    <Link href="https://whatsapp.com/channel/0029Vb5lXCA1SWsyWyJbvW0q" target="_blank" aria-label="Discord">
                      <FaDiscord className="hover:text-blue-400 transition" />
                    </Link>
                    <Link href="https://youtube.com/@TakaDevelopment" target="_blank" aria-label="YouTube">
                      <FaYoutube className="hover:text-red-500 transition" />
                    </Link>
                    <Link href="https://tiktok.com/@putrawangyyy" target="_blank" aria-label="TikTok">
                      <FaTiktok className="hover:text-pink-400 transition" />
                    </Link>
                    <Link href="https://instagram.com/putrasenpaiii" target="_blank" aria-label="Instagram">
                      <FaInstagram className="hover:text-purple-400 transition" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-6 left-4">
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
