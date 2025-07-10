interface Props {
  trailer: {
    id: string
    site: string
  }
}

export default function AnimeTrailer({ trailer }: Props) {
  if (trailer.site !== 'youtube') return null

  const trailerUrl = `https://www.youtube.com/embed/${trailer.id}`

  return (
    <section className="py-10 px-4 md:px-10">
      <h2 className="text-2xl font-bold mb-4 text-white">🎬 Trailer</h2>
      <div className="aspect-video w-full max-w-5xl mx-auto rounded-lg overflow-hidden shadow-lg">
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
