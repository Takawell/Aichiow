// components/character/CharacterList.tsx
import { CharacterEdge } from '@/types/anime'
import Image from 'next/image'

interface Props {
  characters: CharacterEdge[]
}

export default function CharacterList({ characters }: Props) {
  return (
    <section className="px-4 md:px-10 py-10">
      <h2 className="text-2xl font-bold mb-4 text-white">🧑‍🎤 Characters & Voice Actors</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {characters.map((char, idx) => (
          <div key={idx} className="bg-neutral-800 rounded-xl p-3">
            <Image
              src={char.node.image.large}
              alt={char.node.name.full}
              width={100}
              height={140}
              className="rounded-md w-full h-36 object-cover"
            />
            <p className="text-sm font-semibold mt-2">{char.node.name.full}</p>
            <p className="text-xs text-neutral-400">{char.role}</p>
            {char.voiceActors?.[0] && (
              <div className="mt-2 flex items-center gap-2">
                <Image
                  src={char.voiceActors[0].image.large}
                  alt={char.voiceActors[0].name.full}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <p className="text-xs">{char.voiceActors[0].name.full}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
