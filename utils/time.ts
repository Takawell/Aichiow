export function groupByDayName(animeList: any[]) {
  const days: Record<string, any[]> = {}

  animeList.forEach((anime) => {
    const airingAt = anime.nextAiringEpisode?.airingAt
    if (!airingAt) return

    const date = new Date(airingAt * 1000)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })

    if (!days[dayName]) days[dayName] = []
    days[dayName].push(anime)
  })

  return days
}
