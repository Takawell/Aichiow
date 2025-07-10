interface Props {
  trailer: {
    id: string
    site: string
  }
}

export default function AnimeTrailer({ trailer }: Props) {
  const trailerUrl =
    trailer.site === 'youtube' ? `https://www.youtube.com/embed/${trailer.id}` : ''

  return (
    <section className="px-4 md:px-10 py-10">
      <h2 className="text-2xl font-bold mb-4 text-white">🎬 Trailer</h2>
      <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-lg">
        <div className="aspect-video">
          <iframe
            src={trailerUrl}
            title="Anime Trailer"
            allowFullScreen
            className="w-full h-full block relative"
          />
        </div>
      </div>
    </section>
  )
}
