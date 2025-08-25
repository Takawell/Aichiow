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
      <div className="aspect-[16/9] w-full max-w-6xl mx-auto shadow-xl rounded-xl overflow-hidden">
        <iframe
          src={trailerUrl}
          title="Anime Trailer"
          className="w-full h-full"
          allowFullScreen
        />
      </div>
    </section>
  )
}
