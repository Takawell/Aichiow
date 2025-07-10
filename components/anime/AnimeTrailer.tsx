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
    <section style={{ padding: '2.5rem 1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem', textAlign: 'center' }}>
        🎬 Trailer
      </h2>

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          margin: '0 auto',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
      >
        <iframe
          src={trailerUrl}
          title="Anime Trailer"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
        />
      </div>
    </section>
  )
}
