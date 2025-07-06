// lib/anilist.ts
const ANILIST_API = 'https://graphql.anilist.co'

export async function fetchFromAnilist(query: string, variables?: Record<string, any>) {
  const response = await fetch(ANILIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await response.json()
  if (json.errors) {
    console.error('Anilist Error:', json.errors)
    throw new Error('Failed to fetch from Anilist')
  }

  return json.data
}

