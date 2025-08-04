// components/shared/SectionTitle.tsx
interface Props {
  title: string
}

export default function SectionTitle({ title }: Props) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold text-white border-l-4 border-primary pl-3">
      {title}
    </h2>
  )
}
