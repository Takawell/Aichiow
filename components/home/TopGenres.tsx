// components/home/TopGenres.tsx
import Link from 'next/link'

const genres = [
  'Action', 'Adventure', 'Avant Garde', 'Boys Love', 'Comedy',
  'Drama', 'Ecchi', 'Fantasy', 'Girls Love', 'Gourmet',
  'Horror', 'Isekai', 'Mahou Shoujo', 'Mecha', 'Music',
  'Mystery', 'Psychological', 'Romance', 'School', 'Sci-Fi',
  'Slice of Life', 'Sports', 'Supernatural', 'Suspense', 'Thriller'
]

export default function TopGenres() {
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold text-white mb-4">🎯 Popular Genres</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {genres.map((genre) => (
          <Link
            key={genre}
            href={`/anime/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`}
            className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-neutral-800 transition border border-neutral-700"
          >
            {genre}
          </Link>
        ))}
      </div>
    </div>
  )
}
