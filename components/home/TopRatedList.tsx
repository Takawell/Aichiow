"use client"

import React, { useState } from "react"
import { useTopRatedAnime } from "@/hooks/useTopRatedAnime"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Star } from "lucide-react"

type TabKey = "weekly" | "monthly" | "all"

const sortMap: Record<TabKey, string[]> = {
  weekly: ["SCORE_DESC", "TRENDING_DESC"],
  monthly: ["SCORE_DESC", "POPULARITY_DESC"],
  all: ["SCORE_DESC"],
}

export default function TopRatedList() {
  const [tab, setTab] = useState<TabKey>("all")

  const weekly = useTopRatedAnime(1, 10, sortMap.weekly)
  const monthly = useTopRatedAnime(1, 10, sortMap.monthly)
  const all = useTopRatedAnime(1, 10, sortMap.all)

  const renderGrid = (data: any[] | undefined, isLoading: boolean, color: string) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {data?.map((anime, idx) => (
          <motion.div
            key={anime.id}
            className="relative bg-card rounded-2xl overflow-hidden shadow-md cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={anime.coverImage.large}
              alt={anime.title.romaji}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-90 group-hover:opacity-100 transition-all p-3 flex flex-col justify-end">
              <h3 className="text-sm font-semibold text-white truncate">
                {anime.title.romaji || anime.title.english}
              </h3>
              <div className="flex items-center text-yellow-400 text-xs mt-1">
                <Star size={14} className="mr-1" /> {anime.averageScore ?? "N/A"}
              </div>
            </div>
            <span
              className={`absolute top-2 left-2 ${color} text-white text-xs font-bold rounded-full px-2 py-1`}
            >
              #{idx + 1}
            </span>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">🔥 Top Rated Anime</h2>

      <Tabs
        defaultValue="all"
        value={tab}
        onValueChange={(v) => setTab(v as TabKey)}
        className="w-full"
      >
        <TabsList className="mx-auto mb-8 flex justify-center gap-4 rounded-2xl bg-muted/30 p-1">
          <TabsTrigger
            value="weekly"
            className="px-4 py-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Weekly
          </TabsTrigger>
          <TabsTrigger
            value="monthly"
            className="px-4 py-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Monthly
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="px-4 py-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            All Time
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          {renderGrid(weekly.data, weekly.isLoading, "bg-primary")}
        </TabsContent>
        <TabsContent value="monthly">
          {renderGrid(monthly.data, monthly.isLoading, "bg-blue-500")}
        </TabsContent>
        <TabsContent value="all">
          {renderGrid(all.data, all.isLoading, "bg-green-500")}
        </TabsContent>
      </Tabs>
    </div>
  )
}
