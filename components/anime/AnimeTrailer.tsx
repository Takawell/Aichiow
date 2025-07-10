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
    <section className="w-full px-0 md:px-0 py-10">
      <h2 className="text-2xl font-bold mb-4 text-white px-4 md:px-10">🎬 Trailer</h2>
      <div className="aspect-video w-full px-4 md:px-10">
        <div className="w-full h-full rounded-xl overflow-hidden shadow-lg bg-neutral-800">
          <iframe
            src={trailerUrl}
            title="Anime Trailer"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  )
}
