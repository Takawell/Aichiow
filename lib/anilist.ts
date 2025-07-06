// lib/anilist.ts
import axios from 'axios'

const ANILIST_API = 'https://graphql.anilist.co'

export async function fetchFromAnilist(query: string, variables?: Record<string, any>) {
  try {
    const res = await axios.post(
      ANILIST_API,
      { query, variables },
      { headers: { 'Content-Type': 'application/json' } }
    )
    return res.data.data
  } catch (error: any) {
    console.error('Anilist Error:', error.message)
    throw new Error('Failed to fetch from Anilist')
  }
}
