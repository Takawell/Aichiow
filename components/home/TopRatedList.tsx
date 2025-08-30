"use client"

import React, { useState } from "react"
import { useTopRatedAnime } from "@/hooks/useTopRatedAnime"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs } from "@/components/ui/tabs"
import Image from "next/image"
import { motion } from "framer-motion"

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
    <div className="w-full py-10">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-32 w-full rounded-xl bg-muted/30"
                  />
                ))
              : data?.map((anime, index) => (
                  <motion.div
                    key={anime.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 rounded-xl bg-card p-3 shadow-md hover:shadow-lg transition"
                  >
                    <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={anime.coverImage?.large || "/logo.png"}
                        alt={anime.title.romaji}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="line-clamp-2 font-medium">
                        {anime.title.romaji}
                      </span>
                      <span className="mt-1 text-sm text-muted-foreground">
                        ⭐ {anime.averageScore || "N/A"}
                      </span>
                    </div>
                  </motion.div>
                ))}
          </div>
        )}
      </Tabs>
    </div>
  )
}
