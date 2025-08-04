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
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 relative inline-block">
        🎬 Trailer
        <span className="absolute left-0 -bottom-1 h-1 w-full bg-indigo-500/30 rounded blur-sm" />
      </h2>

      <div className="relative mx-auto w-full max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-2xl group transition duration-300 border border-white/10 backdrop-blur-md bg-white/5">
        {/* Glow Border on Hover */}
        <div className="absolute inset-0 rounded-2xl border border-indigo-500/30 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
        
        {/* Trailer */}
        <iframe
          src={trailerUrl}
          title="Anime Trailer"
          className="w-full h-full rounded-2xl"
          allowFullScreen
        />
      </div>
    </section>
  )
}
