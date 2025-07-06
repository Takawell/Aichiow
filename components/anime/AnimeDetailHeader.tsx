// components/anime/AnimeDetailHeader.tsx
import Image from 'next/image'
import { AnimeDetail } from '@/types/anime'

interface Props {
  anime: AnimeDetail
}

export default function AnimeDetailHeader({ anime }: Props) {
  return (
    <section className="relative w-full bg-neutral-900">
      {anime.bannerImage && (
        <Image
          src={anime.bannerImage}
          alt={anime.title.romaji}
          fill
          className="object-cover opacity-30"
        />
      )}
      <div className="relative z-10 flex flex-col md:flex-row items-start gap-6 p-6 md:p-10">
        <Image
          src={anime.coverImage.large}
          alt={anime.title.romaji}
          width={200}
          height={300}
          className="rounded-xl shadow-lg"
        />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            {anime.title.english || anime.title.romaji}
          </h1>
          <p className="text-sm text-neutral-300 mt-2 max-w-2xl">{anime.description}</p>
          <div className="text-sm mt-4 space-y-1 text-neutral-400">
            <p>🎞️ Format: {anime.format}</p>
            <p>📅 Season: {anime.season} {anime.seasonYear}</p>
            <p>⭐ Score: {anime.averageScore}</p>
            <p>🎬 Studio: {anime.studios.nodes[0]?.name}</p>
            <p>📈 Popularity: {anime.popularity}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
