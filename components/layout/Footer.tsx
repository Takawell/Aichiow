// components/layout/Footer.tsx
import Link from 'next/link'
import { FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 px-4 py-8 mt-16 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        {/* Copyright */}
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} Aichiow. Built with ❤️ using Anilist API.
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-4 justify-center">
          <Link href="https://discord.gg/aichinime" target="_blank" aria-label="Discord">
            <FaDiscord className="hover:text-white transition" size={20} />
          </Link>
          <Link href="https://youtube.com/Takadevelopment" target="_blank" aria-label="YouTube">
            <FaYoutube className="hover:text-white transition" size={20} />
          </Link>
          <Link href="https://tiktok.com/@putrawangyyy" target="_blank" aria-label="TikTok">
            <FaTiktok className="hover:text-white transition" size={20} />
          </Link>
          <Link href="https://instagram.com/putrasenpaiii" target="_blank" aria-label="Instagram">
            <FaInstagram className="hover:text-white transition" size={20} />
          </Link>
        </div>
      </div>
    </footer>
  )
}
