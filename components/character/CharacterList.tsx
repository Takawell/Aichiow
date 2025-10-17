import { CharacterEdge } from '@/types/anime'
import Image from 'next/image'
import { FaMicrophoneAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'

interface Props {
  characters: CharacterEdge[]
}

export default function CharacterList({ characters }: Props) {
  return (
    <section className="px-4 md:px-10 py-10">
      <h2 className="text-3xl font-extrabold mb-6 text-white flex items-center gap-2">
        🧑‍🎤 Characters & VA
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {characters.map((char, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl overflow-hidden border border-zinc-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            <div className="relative w-full h-40">
              <Image
                src={char.node.image.large}
                alt={char.node.name.full}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-3">
              <h3 className="text-sm font-bold truncate text-white">
                {char.node.name.full}
              </h3>
              <p className="text-xs text-zinc-400">{char.role}</p>
            </div>

            {char.voiceActors?.[0] && (
              <div className="px-3 pb-3 flex items-center gap-2 mt-auto">
                <Image
                  src={char.voiceActors[0].image.large}
                  alt={char.voiceActors[0].name.full}
                  width={30}
                  height={30}
                  className="rounded-full border border-zinc-600"
                />
                <p className="text-xs text-zinc-300 truncate flex-1">
                  {char.voiceActors[0].name.full}
                </p>
                <FaMicrophoneAlt className="text-blue-400 text-sm" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
