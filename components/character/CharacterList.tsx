import { CharacterEdge } from '@/types/anime'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  characters: CharacterEdge[]
}

export default function CharacterList({ characters }: Props) {
  return (
    <section className="px-4 md:px-10 py-10">
      <h2 className="text-2xl font-bold mb-6 text-white">🧑‍🎤 Characters & Voice Actors</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {characters.map((char, idx) => {
          const va = char.voiceActors?.[0] 
          return (
            <div
              key={idx}
              className="bg-neutral-900 rounded-xl overflow-hidden shadow-sm border border-neutral-800 hover:border-indigo-500/40 transition-all duration-300"
            >
              {/* Character Image */}
              <div className="relative w-full aspect-[2/3]">
                <Image
                  src={char.node.image.large}
                  alt={char.node.name.full}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
              </div>

              <div className="p-4 relative z-20 text-white">
                <h3 className="text-sm font-semibold truncate mb-1">
                  {char.node.name.full}
                </h3>
                <p className="text-xs text-neutral-400 mb-2">{char.role}</p>

                {/* VA Section */}
                {va && (
                  <Link
                    href={`/voice-actor/${va.id}`}
                    className="flex items-center gap-2 group mt-2"
                  >
                    <Image
                      src={va.image.large}
                      alt={va.name.full}
                      width={32}
                      height={32}
                      className="rounded-full border border-neutral-700 group-hover:ring-2 group-hover:ring-indigo-400 transition-all"
                    />
                    <p className="text-xs text-white group-hover:text-indigo-400 truncate">
                      {va.name.full}
                    </p>
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
