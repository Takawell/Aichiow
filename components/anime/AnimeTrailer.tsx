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
    <section className="w-full px-4 md:px-10 py-10">
      <h2 className="text-2xl font-bold mb-4 text-white">🎬 Trailer</h2>
      <div className="w-full aspect-video mx-auto rounded-xl overflow-hidden shadow-lg">
        <iframe
          src={trailerUrl}
          title="Anime Trailer"
          className="w-full h-full rounded-xl"
          allowFullScreen
        />
      </div>
    </section>
  )
}
