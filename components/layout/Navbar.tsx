import Link from 'next/link'
import { useRouter } from 'next/router'
import ThemeToggle from '@/components/shared/ThemeToggle'
import { classNames } from '@/utils/classNames'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/trailer', label: 'Trailers' },
  { href: '/explore', label: 'Explore' },
  { href: '/search', label: 'Search' },
  { href: '/manga', label: 'Manga' }, // ✅ Tambahkan Manga
]

export default function Navbar() {
  const router = useRouter()

  return (
    <header className="bg-neutral-900 text-white shadow-md sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 hover:opacity-90 transition">
          Aichiow
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <nav className="flex gap-4 sm:gap-5 md:gap-6 text-sm md:text-base font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  'transition-colors duration-200 hover:text-blue-400',
                  router.pathname === item.href ? 'text-blue-400' : 'text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
