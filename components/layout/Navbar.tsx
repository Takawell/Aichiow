'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'
import ThemeToggle from '@/components/shared/ThemeToggle'
import { classNames } from '@/utils/classNames'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import BottomNav from './BottomNav'
import { FaRobot } from 'react-icons/fa'
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
  const [avatarUrl, setAvatarUrl] = useState('/default.png')

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

        setAvatarUrl('/default.png')
      } catch (err) {
        console.error('Error loading avatar:', err)
        setAvatarUrl('/default.png')
      }
    }

    loadAvatar()

    const handleStorageChange = () => {
      const newAvatar = localStorage.getItem('avatar') || '/default.png'
      setAvatarUrl(newAvatar)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const isReadPage = router.pathname.startsWith('/read/')
  const isAIPage = router.pathname.startsWith('/aichixia')

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={classNames(
          'sticky top-0 z-50 transition-all duration-500 backdrop-blur-xl border-b border-white/10',
          scrolled
            ? 'bg-black/70 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
            : 'bg-gradient-to-r from-gray-900/40 via-gray-900/30 to-gray-800/40'
        )}
      >
        <div className="w-full px-4 md:px-10 py-3 flex items-center justify-between relative">
          <Link
            href="/"
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 
              text-2xl font-extrabold tracking-wider hover:brightness-110 transition-all duration-300"
          >
            AICHIOW
          </Link>

          <div className="hidden md:flex items-center gap-8 ml-auto">
            <nav className="flex gap-6 text-sm md:text-base font-medium relative">
              {navItems.map((item) => {
                const isActive =
                  router.pathname === item.href ||
                  router.pathname.startsWith(item.href + '/')

                return (
                  <motion.div
                    key={item.href}
                    whileHover={{ y: -2 }}
                    className="relative"
                  >
                    <Link
                      href={item.href}
                      className={classNames(
                        'transition-all duration-300 hover:text-blue-400',
                        isActive
                          ? 'text-blue-400 font-semibold'
                          : 'text-gray-300'
                      )}
                    >
                      {item.label}
                    </Link>

                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute -bottom-1 left-0 right-0 mx-auto h-[2px] w-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                      />
                    )}
                  </motion.div>
                )
              })}
            </nav>

            <ThemeToggle />

            <Link href="/profile">
              <motion.img
                whileHover={{ scale: 1.08 }}
                src={avatarUrl}
                alt="Profile"
                onError={(e) => (e.currentTarget.src = '/default.png')}
                className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover shadow-lg"
              />
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3">
            {!isAIPage && (
              <motion.div whileTap={{ scale: 0.9 }}>
                <Link
                  href="/aichixia"
                  className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white 
                    shadow-md shadow-blue-500/30 hover:brightness-110 transition-all"
                  title="AI Assistant"
                >
                  <FaRobot className="text-lg" />
                </Link>
              </motion.div>
            )}

            <Link href="/profile">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={avatarUrl}
                alt="Profile"
                onError={(e) => (e.currentTarget.src = '/default.png')}
                className="w-9 h-9 rounded-full border-2 border-blue-400 object-cover shadow-md"
              />
            </Link>
          </div>
        </div>
      </motion.header>

      {!isReadPage && !isAIPage && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}
    </>
  )
}
