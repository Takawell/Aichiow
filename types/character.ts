// types/character.ts
export interface Character {
  id: number
  name: {
    full: string
  }
  image: {
    large: string
  }
}

export interface VoiceActor {
  id: number
  name: {
    full: string
  }
  image: {
    large: string
  }
  language: string
}
