"use client"

import React, { useState } from "react"
import { useTopRatedAnime } from "@/hooks/useTopRatedAnime"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs } from "@/components/ui/tabs"
import Image from "next/image"
import { motion } from "framer-motion"
import { FaStar, FaPlayCircle, FaCalendarAlt } from "react-icons/fa"
import { BsFillPersonFill } from "react-icons/bs"

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
    <div className="w-full py-16 px-4">
      <h2 className="mb-6 text-3xl font-bold text-center text-foreground">
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
                    className="h-52 w-full rounded-3xl bg-muted/30"
                  />
                ))
              : data?.map((anime, index) => (
                  <motion.div
                    key={anime.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col gap-4 bg-gradient-to-b from-[#2a2a2a] to-[#1c1c1c] rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all ease-in-out p-6"
                  >
                    <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-lg transition-all">
                      <Image
                        src={anime.coverImage?.large || "/logo.png"}
                        alt={anime.title.romaji}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div className="flex flex-col gap-2 text-white">
                      <span className="text-2xl font-semibold line-clamp-2">
                        {anime.title.romaji}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FaStar className="text-yellow-400" />
                        <span>{anime.averageScore || "N/A"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BsFillPersonFill className="text-gray-400" />
                        <span>{anime.characters?.length || "Unknown"} Characters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>
                          {anime.startDate
                            ? new Date(anime.startDate).toLocaleDateString()
                            : "TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaPlayCircle className="text-gray-400" />
                        <span>{anime.episodes || "N/A"} Episodes</span>
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
