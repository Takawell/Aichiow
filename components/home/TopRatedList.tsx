"use client"

import React, { useState } from "react"
import { useTopRatedAnime } from "@/hooks/useTopRatedAnime"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs } from "@/components/ui/tabs"
import Image from "next/image"
import { motion } from "framer-motion"
import { FaStar } from "react-icons/fa"

type TabKey = "all" | "weekly" | "monthly"

const sortMap: Record<TabKey, string[]> = {
  all: ["SCORE_DESC"],
  weekly: ["TRENDING_DESC"],
  monthly: ["POPULARITY_DESC"],
}

export default function TopRatedList() {
  const [tab, setTab] = useState<TabKey>("all")

  const { data, isLoading } = useTopRatedAnime({
    page: 1,
    perPage: 10,
    sort: sortMap[tab],
  })

  return (
    <div className="w-full py-16 px-6">
      <h2 className="mb-8 text-3xl font-semibold text-center text-foreground">
        ⭐ Top Rated Anime
      </h2>

      <Tabs
        tabs={[
          { value: "all", label: "All Time" },
          { value: "weekly", label: "This Week" },
          { value: "monthly", label: "This Month" },
        ]}
        defaultValue="all"
      >
        {(active) => (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-40 w-full rounded-xl bg-muted/30"
                  />
                ))
              : data?.map((anime, index) => (
                  <motion.div
                    key={anime.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="flex items-center gap-6 rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#333333] p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all ease-in-out"
                  >
                    {/* Gambar Anime */}
                    <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-md shadow-lg">
                      <Image
                        src={anime.coverImage?.large || "/logo.png"}
                        alt={anime.title.romaji}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    {/* Detail Anime */}
                    <div className="flex flex-col w-full">
                      <span className="text-xl font-semibold text-white line-clamp-2">
                        {anime.title.romaji}
                      </span>

                      <div className="flex items-center gap-1 text-yellow-400 mt-2">
                        <FaStar className="text-yellow-400" />
                        <span>{anime.averageScore || "N/A"}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>
        )}
      </Tabs>
    </div>
  )
}
