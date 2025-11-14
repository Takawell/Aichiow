'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'
import ThemeToggle from '@/components/shared/ThemeToggle'
import { classNames } from '@/utils/classNames'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import BottomNav from './BottomNav'

import { PiSparkleFill } from 'react-icons/pi'
import { FaRegUserCircle } from 'react-icons/fa'
import { FaBars } from 'react-icons/fa6'
import { MdMenuOpen, MdMenuBook } from 'react-icons/md'
import { IoClose } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { href: '/home', label: 'HOME' },
  { href: '/upcoming', label: 'SCHEDULE' },
  { href: '/explore', label: 'EXPLORE' },
  { href: '/manga', label: 'MANGA' },
  { href: '/manhwa', label: 'MANHWA' },
  { href: '/light-novel', label: 'LIGHT NOVEL' },
  { href: '/aichixia', label: 'AI' },
]

export default function Navbar() {
  const router = useRouter()

  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [navMode, setNavMode] = useState<'floating' | 'hamburger'>('floating')
  const [hamburgerOpen, setHamburgerOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('nav-mode')
    if (saved === 'floating' || saved === 'hamburger') {
      setNavMode(saved)
    }
  }, [])

  const toggleMode = () => {
    const next = navMode === 'floating' ? 'hamburger' : 'floating'
    setNavMode(next)
    localStorage.setItem('nav-mode', next)
  }

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const localAvatar = localStorage.getItem('avatar')
        if (localAvatar) {
          setAvatarUrl(localAvatar)
          return
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data: userData } = await supabase
          .from('users')
          .select('avatar_url')
          .eq('id', user.id)
          .single()

        if (userData?.avatar_url) {
          setAvatarUrl(userData.avatar_url)
          return
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single()

        if (profileData?.avatar_url) {
          setAvatarUrl(profileData.avatar_url)
          return
        }
      } catch {}
    }

    loadAvatar()
  }, [])

  const isReadPage = router.pathname.startsWith('/read/')
  const isAIPage = router.pathname.startsWith('/aichixia')

  return (
    <>
      <header
        className={classNames(
          'sticky top-0 z-50 transition-all duration-300 backdrop-blur-lg',
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

          <div className="hidden md:flex items-center gap-6 ml-auto">
            <nav className="flex gap-6 text-sm md:text-base font-medium">
              {navItems.map((item) => {
                const isActive =
                  router.pathname === item.href ||
                  router.pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={classNames(
                      'nav-link hover:text-sky-400 transition duration-200',
                      isActive ? 'text-sky-400' : 'text-white'
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <ThemeToggle />

            <Link href="/profile">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  className="w-10 h-10 rounded-full border-2 border-sky-400 object-cover"
                  alt="avatar"
                />
              ) : (
                <FaRegUserCircle className="text-3xl text-sky-400" />
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">

            {!isAIPage && (
              <Link href="/aichixia" title="AI Assistant">
                <PiSparkleFill className="text-2xl text-sky-400" />
              </Link>
            )}

            <button
              onClick={toggleMode}
              className="text-sky-400 text-3xl active:scale-90 transition"
              title="Switch Navigation Mode"
            >
              {navMode === 'floating' ? <MdMenuBook /> : <MdMenuOpen />}
            </button>

            <Link href="/profile">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  className="w-9 h-9 rounded-full border-2 border-sky-400 object-cover"
                  alt="profile"
                />
              ) : (
                <FaRegUserCircle className="text-2xl text-sky-400" />
              )}
            </Link>
          </div>
        </div>
      </header>

      {!isReadPage && !isAIPage && navMode === 'floating' && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}

      <AnimatePresence>
        {navMode === 'hamburger' && hamburgerOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            className="fixed inset-y-0 left-0 w-72 bg-neutral-900/95 backdrop-blur-xl z-[999] p-6 border-r border-sky-400/10 shadow-xl"
          >
            <button
              onClick={() => setHamburgerOpen(false)}
              className="text-sky-400 text-3xl mb-6"
            >
              <IoClose />
            </button>

            <nav className="flex flex-col gap-5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setHamburgerOpen(false)}
                  className="text-lg text-white hover:text-sky-400 transition font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {navMode === 'hamburger' && !hamburgerOpen && (
        <button
          onClick={() => setHamburgerOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-xl bg-neutral-900/85 border border-sky-400/25 shadow-lg flex items-center justify-center z-[900]"
        >
          <FaBars className="text-2xl text-sky-400" />
        </button>
      )}
    </>
  )
}
