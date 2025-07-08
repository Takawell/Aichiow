import { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { fetchChapters, fetchMangaDetail, getCoverImage } from '@/lib/mangadex'
import { fetchMangaCharacters } from '@/lib/anilist'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string }

  if (!slug || typeof slug !== 'string') {
    return { notFound: true }
  }

  try {
    const manga = await fetchMangaDetail(slug)

    if (!manga?.id) {
      throw new Error('Invalid manga data')
    }

    const chapters = await fetchChapters(slug)

    const title =
      manga.attributes?.title?.en ||
      manga.attributes?.title?.['en-us'] ||
      manga.attributes?.title?.ja ||
      manga.attributes?.title?.['ja-ro'] ||
      ''

    const characters = await fetchMangaCharacters(title)

    return {
      props: {
        manga,
        chapters,
        characters,
      },
    }
  } catch (error) {
    console.error('[Manga Detail Error]', error)
    return {
      props: {
        error: 'Failed to load manga.',
        manga: null,
        chapters: [],
        characters: [],
      },
    }
  }
}

export default function MangaDetailPage({
  manga,
  chapters,
  characters,
  error,
}: {
  manga: any
  chapters: any[]
  characters: any[]
  error?: string
}) {
  if (error || !manga) {
    return (
      <main className="text-center py-20 text-red-500">
        <h1 className="text-2xl font-bold mb-2">❌ Error</h1>
        <p>{error || 'Manga not found.'}</p>
      </main>
    )
  }

  const title = manga.attributes?.title?.en || manga.attributes?.title?.ja || 'Untitled'
  const description = manga.attributes?.description?.en || 'No description available.'
  const coverRel = manga.relationships?.find((rel: any) => rel.type === 'cover_art')
  const coverUrl = getCoverImage(manga.id, coverRel?.attributes?.fileName || '')

  return (
    <main className="px-4 md:px-8 py-10 text-white max-w-5xl mx-auto">
      <section className="flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-64 aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-zinc-800">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-zinc-400 text-sm">
              No Cover
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-zinc-400 text-sm whitespace-pre-line">{description}</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">📚 Chapters</h2>
        {chapters.length > 0 ? (
          <ul className="space-y-2">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`/read/${chapter.id}`}
                  className="text-blue-400 hover:underline"
                >
                  Chapter {chapter.attributes.chapter || '?'}: {chapter.attributes.title || 'No title'}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500">No chapters available.</p>
        )}
      </section>

      {characters && characters.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold mb-4">🧑‍🎤 Characters & Voice Actors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {characters.map((char: any, index: number) => (
              <div
                key={index}
                className="bg-gray-900 p-4 rounded-xl flex flex-col items-center text-center shadow"
              >
                <img
                  src={char.node.image?.large}
                  alt={char.node.name.full}
                  className="w-24 h-24 rounded-full object-cover mb-2"
                />
                <p className="font-medium">{char.node.name.full}</p>
                {char.voiceActors?.[0] && (
                  <div className="mt-2 text-sm text-gray-400">
                    <p>VA: {char.voiceActors[0].name.full}</p>
                    <img
                      src={char.voiceActors[0].image?.large}
                      alt={char.voiceActors[0].name.full}
                      className="w-10 h-10 rounded-full mx-auto mt-1"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
