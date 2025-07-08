export function formatTime(unix: number): string {
  const date = new Date(unix * 1000)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export function getWeekday(unix: number): string {
  const date = new Date(unix * 1000)
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

// Optional: Untuk groupBy weekday
export function groupByWeekday(animeList: any[]) {
  const result: Record<string, any[]> = {}

  animeList.forEach((anime) => {
    const timestamp = anime.nextAiringEpisode?.airingAt
    if (!timestamp) return

    const day = getWeekday(timestamp)
    if (!result[day]) result[day] = []
    result[day].push(anime)
  })

  return result
}
