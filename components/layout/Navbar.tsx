'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu } from 'lucide-react'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import ThemeToggle from '@/components/shared/ThemeToggle'
import { classNames } from '@/utils/classNames'
import { useState, useEffect } from 'react'
import { FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'
import { supabase } from '@/lib/supabaseClient'

const navItems = [
  { href: '/home', label: 'HOME' },
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
  const [mounted, setMounted] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('/default.png')

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Fetch avatar from Supabase
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single()

        if (!error && data?.avatar_url) {
          setAvatarUrl(data.avatar_url)
        }
      }
    }
    getProfile()
  }, [])

  return (
    <header
      className={classNames(
        'sticky top-0 z-50 transition-all duration-300 backdrop-blur-lg animate-fade-down',
        scrolled ? 'bg-neutral-900/80 shadow-lg' : 'bg-neutral-900/50',
        mounted ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="w-full px-4 md:px-10 py-3 flex items-center justify-between">
        {/* Logo kiri */}
        <Link
          href="/"
          className="logo-gradient text-2xl font-extrabold tracking-wide hover:scale-105 transition-transform"
        >
          AICHIOW
        </Link>

        {/* Nav desktop kanan */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
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
          {/* Avatar Profile */}
          <Link href="/profile">
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-sky-400 hover:scale-105 transition-transform object-cover"
            />
          </Link>
        </div>

        {/* Nav mobile */}
        <div className="md:hidden flex items-center gap-3">
          {/* Avatar mobile */}
          <Link href="/profile">
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-9 h-9 rounded-full border-2 border-sky-400 object-cover"
            />
          </Link>

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

                {/* Community */}
                <div className="mt-8 border-t border-white/20 pt-4">
                  <p className="text-sm font-semibold uppercase text-white/60 mb-3">Community</p>
                  <div className="flex gap-4 text-lg">
                    <Link href="https://whatsapp.com/channel/0029Vb5lXCA1SWsyWyJbvW0q" target="_blank">
                      <FaDiscord className="hover:text-blue-400 transition" />
                    </Link>
                    <Link href="https://youtube.com/@TakaDevelopment" target="_blank">
                      <FaYoutube className="hover:text-red-500 transition" />
                    </Link>
                    <Link href="https://tiktok.com/@putrawangyyy" target="_blank">
                      <FaTiktok className="hover:text-pink-400 transition" />
                    </Link>
                    <Link href="https://instagram.com/putrasenpaiii" target="_blank">
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
