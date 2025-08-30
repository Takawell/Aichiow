import React, { useRef } from "react"
import Link from "next/link"
import { Anime } from "@/types/anime"
import AnimeCard from "../anime/AnimeCard"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AnimeSectionProps {
  title: string
  anime?: Anime[]
  href?: string
}

export default function AnimeSection({ title, anime, href }: AnimeSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isLoading = !anime || anime.length === 0

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" })
    }
  }

  return (
    <section className="relative px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            See All →
          </Link>
        )}
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Gradient Fade Left */}
        <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-black to-transparent pointer-events-none z-10 hidden md:block" />
        {/* Gradient Fade Right */}
        <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-black to-transparent pointer-events-none z-10 hidden md:block" />

        {/* Left Button */}
        <button
          onClick={() => scroll(-300)}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-md transition"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Button */}
        <button
          onClick={() => scroll(300)}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-md transition"
        >
          <ChevronRight size={20} />
        </button>

        {/* Anime List */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory pb-2"
        >
          {isLoading
            ? [...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-[140px] sm:min-w-[160px] lg:min-w-[200px] h-64 bg-neutral-700 animate-pulse rounded-xl snap-start"
                />
              ))
            : anime.map((a) => (
                <div
                  key={a.id}
                  className="min-w-[140px] sm:min-w-[160px] lg:min-w-[200px] snap-start transition-transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 rounded-xl"
                >
                  <AnimeCard anime={a} />
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
