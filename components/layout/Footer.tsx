// components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 text-sm text-center py-6 mt-10">
      © {new Date().getFullYear()} Aichiow. Built with ❤️ using Anilist API.
    </footer>
  )
}
