import { Anime } from '@/types/anime'
import CardAiring from 'components/home/NowAiringSection'

interface Props {
  anime: Anime
}

export default function AnimeCard({ anime }: Props) {
  return <CardAiring anime={anime} />
}
