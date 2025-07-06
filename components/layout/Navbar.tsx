// components/layout/Navbar.tsx
import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="bg-neutral-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          Aichiow
        </Link>
        <nav className="flex gap-6 text-sm md:text-base font-medium">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <Link href="/trailer" className="hover:text-primary transition">Trailers</Link>
        </nav>
      </div>
    </header>
  )
}
