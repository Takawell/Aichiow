'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu } from 'lucide-react'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import ThemeToggle from '@/components/shared/ThemeToggle'
import { classNames } from '@/utils/classNames'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { User } from '@supabase/supabase-js'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/upcoming', label: 'Timetable' },
  { href: '/explore', label: 'Explore' },
  { href: '/search', label: 'Search' },
  { href: '/manga', label: 'Manga' },
]

export default function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="bg-neutral-900 text-white shadow-md sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 hover:opacity-90 transition"
        >
          Aichiow
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-4 sm:gap-5 md:gap-6 text-sm md:text-base font-medium">
            {navItems.map((item) => {
              const isActive =
                router.pathname === item.href || router.pathname.startsWith(item.href + '/')

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    'transition-colors duration-200 hover:text-blue-400',
                    isActive ? 'text-blue-400' : 'text-white'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="w-8 h-8 border border-white/20">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-neutral-800 border-neutral-700 mt-2">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm">Login / Register</Button>
            </Link>
          )}

          <ThemeToggle />
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button aria-label="Menu">
                <Menu className="h-6 w-6" />
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
                        'text-lg font-medium transition hover:text-blue-400',
                        isActive ? 'text-blue-400' : 'text-white'
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                })}

                {/* Auth Section */}
                {user ? (
                  <div className="mt-6 flex items-center gap-3">
                    <Avatar className="w-9 h-9 border border-white/20">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button className="w-full mt-6" variant="default">Login / Register</Button>
                  </Link>
                )}

                {/* Community Section */}
                <div className="mt-8 border-t border-white/20 pt-4">
                  <p className="text-sm font-semibold uppercase text-white/60 mb-3">Community</p>
                  <div className="flex flex-col gap-2">
                    <a href="https://discord.gg/aichinime" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition text-sm">🗨️ Discord</a>
                    <a href="https://youtube.com/Takadevelopment" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition text-sm">▶️ YouTube</a>
                    <a href="https://tiktok.com/@putrawangyyy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition text-sm">🎵 TikTok</a>
                    <a href="https://instagram.com/putrasenpaiii" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition text-sm">📷 Instagram</a>
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
