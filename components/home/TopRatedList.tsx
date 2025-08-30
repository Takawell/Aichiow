"use client"
import React, { useState } from "react"
import { useTopRatedAnime } from "@/hooks/useTopRatedAnime"
import { Tabs } from "@/components/ui/tabs"
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
  const { data, isLoading } = useTopRatedAnime(1, 10, sortMap[tab])

  return (
    <div className="w-full py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">🔥 Top Rated Anime</h2>

      <Tabs
        tabs={[
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" },
          { value: "all", label: "All Time" },
        ]}
        defaultValue="all"
      >
        {(active) => {
          // Update state untuk trigger fetch sesuai tab
          if (active !== tab) setTab(active as TabKey)

          return (
            <>
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-2xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-6">
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
                          <Star size={14} className="mr-1" />{" "}
                          {anime.averageScore ?? "N/A"}
                        </div>
                      </div>

                      {/* Badge warna beda tiap tab */}
                      <span
                        className={`absolute top-2 left-2 text-white text-xs font-bold rounded-full px-2 py-1
                          ${active === "weekly" ? "bg-primary" : ""}
                          ${active === "monthly" ? "bg-blue-500" : ""}
                          ${active === "all" ? "bg-green-500" : ""}
                        `}
                      >
                        #{idx + 1}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )
        }}
      </Tabs>
    </div>
  )
}
