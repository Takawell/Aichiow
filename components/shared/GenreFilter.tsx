// components/shared/GenreFilter.tsx
import { GENRES } from '@/constants/genres'
import { classNames } from '@/utils/classNames'

interface Props {
  selected: string | null
  onSelect: (genre: string | null) => void
}

export default function GenreFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <button
        onClick={() => onSelect(null)}
        className={classNames(
          'px-3 py-1 rounded-full text-sm border transition',
          !selected ? 'bg-primary text-white border-primary' : 'text-neutral-300 border-neutral-600 hover:bg-neutral-700'
        )}
      >
        All
      </button>
      {GENRES.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelect(genre)}
          className={classNames(
            'px-3 py-1 rounded-full text-sm border transition',
            selected === genre
              ? 'bg-primary text-white border-primary'
              : 'text-neutral-300 border-neutral-600 hover:bg-neutral-700'
          )}
        >
          {genre}
        </button>
      ))}
    </div>
  )
}
