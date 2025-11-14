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

        if (!user) {
          setAvatarUrl(null)
          return
        }

        const { data: userData, error: userErr } = await supabase
          .from('users')
          .select('avatar_url')
          .eq('id', user.id)
          .single()

        if (!userErr && userData?.avatar_url) {
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

        setAvatarUrl(null)
      } catch (err) {
        console.error('Error loading avatar:', err)
        setAvatarUrl(null)
      }
    }

    loadAvatar()

    const handleStorageChange = () => {
      const newAvatar = localStorage.getItem('avatar')
      setAvatarUrl(newAvatar || null)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const isReadPage = router.pathname.startsWith('/read/')
  const isAIPage = router.pathname.startsWith('/aichixia')

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
                      'nav-link hover:text-sky-400 transition-colors duration-200',
                      isActive ? 'text-sky-400' : 'text-white'
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <ThemeToggle />

            <Link href="/profile" className="hover:scale-105 transition-transform">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  onError={(e) => (e.currentTarget.src = '/default.png')}
                  className="w-10 h-10 rounded-full border-2 border-sky-400 object-cover"
                />
              ) : (
                <FaRegUserCircle className="text-3xl text-sky-400 hover:text-sky-300" />
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3">
            {!isAIPage && (
              <Link
                href="/aichixia"
                className="text-sky-400 hover:text-sky-300 active:scale-95 transition-transform"
                title="AI Assistant"
              >
                <PiSparkleFill className="text-2xl" />
              </Link>
            )}

            <Link href="/profile">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  onError={(e) => (e.currentTarget.src = '/default.png')}
                  className="w-9 h-9 rounded-full border-2 border-sky-400 object-cover"
                />
              ) : (
                <FaRegUserCircle className="text-2xl text-sky-400 hover:text-sky-300" />
              )}
            </Link>
          </div>
        </div>
      </header>

      {!isReadPage && !isAIPage && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}
    </>
  )
}
