import { GetServerSideProps } from 'next'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { fetchVoiceActorById } from '@/lib/anilist'
import { Character } from '@/types/anime'

interface Props {
  id: number
  name: string
  image: string
  language: string
  characters: Character[]
}

export default function VoiceActorPage({ name, image, language, characters }: Props) {
  return (
    <>
      <Head>
        <title>{name} - Voice Actor | Aichiow</title>
      </Head>

      <section className="px-4 md:px-10 py-10 text-white">
        {/* VA Profile */}
        <div className="flex items-center gap-6 mb-10">
          <Image
            src={image}
            alt={name}
            width={120}
            height={120}
            className="rounded-full w-28 h-28 object-cover border border-neutral-700 shadow-xl"
          />
          <div>
            <h1 className="text-3xl font-bold mb-1">🎤 {name}</h1>
            <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full font-medium">
              {language}
            </span>
          </div>
        </div>

        {/* Characters */}
        <h2 className="text-xl font-semibold mb-5">📺 Characters Voiced</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {characters.map((char) => (
            <Link
              key={char.id}
              href={`/anime/${char.media.id}`}
              className="group rounded-xl bg-neutral-800 hover:border-indigo-500/60 border border-neutral-700 overflow-hidden shadow-md transition-all duration-300"
            >
              <div className="relative w-full aspect-[2/3]">
                <Image
                  src={char.media.coverImage.large}
                  alt={char.media.title.romaji}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold group-hover:text-indigo-400 truncate">
                  {char.media.title.romaji}
                </h3>
                <p className="text-xs text-neutral-400 truncate">
                  as <span className="text-white">{char.name.full}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = Number(context.params?.id)
  const data = await fetchVoiceActorById(id)

  if (!data) return { notFound: true }

  const { name, image, language, characters: rawCharacters } = data

  // Transformasi karakter dari `edges` ke `Character[]`
  const characters: Character[] = rawCharacters.edges
    .map((edge: any) => {
      const media = edge.media?.nodes?.[0] // Ambil anime pertama
      if (!media) return null

      return {
        id: edge.node.id,
        name: edge.node.name,
        image: edge.node.image,
        media: {
          id: media.id,
          title: media.title,
          coverImage: media.coverImage
        }
      }
    })
    .filter(Boolean) // Hilangkan yang null

  return {
    props: {
      id,
      name: name.full,
      image: image.large,
      language,
      characters
    }
  }
}
