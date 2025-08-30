import React, { useState } from "react"
import { cn } from "@/utils/cn"

type Tab = {
  value: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  defaultValue?: string
  children: (active: string) => React.ReactNode
}

export function Tabs({ tabs, defaultValue, children }: TabsProps) {
  const [active, setActive] = useState(defaultValue || tabs[0].value)

  return (
    <div>
      {/* Tab List */}
      <div className="flex space-x-2 rounded-2xl bg-muted/30 p-1 shadow-sm backdrop-blur">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-all",
              active === tab.value
                ? "bg-primary text-white shadow"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">{children(active)}</div>
    </div>
  )
}
