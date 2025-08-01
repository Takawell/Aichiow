import { TraceMoeResult } from '@/types/trace'
import { useAnimeDetail } from '@/hooks/useAnimeDetail'
import AnimeCard from './AnimeCard'

interface TraceAnimeCardProps {
  traceResult: TraceMoeResult
}

export default function TraceAnimeCard({ traceResult }: TraceAnimeCardProps) {
  const { anime, isLoading, isError } = useAnimeDetail(traceResult.anilist)

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading...</div>
  if (isError || !anime) return null

  return (
    <AnimeCard
      id={anime.id}
      title={anime.title.romaji || anime.title.english}
      coverImage={anime.coverImage.large}
      rating={anime.averageScore}
    />
  )
}
