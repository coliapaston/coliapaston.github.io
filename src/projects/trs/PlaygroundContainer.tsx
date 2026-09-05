import { useState } from "react"
import { ControlPanel, ClusterChart } from "./PlaygroundComponents"
import clsx from "clsx"

export function PlaygroundContainer() {
  const [activeTab, setActiveTab] = useState<"non" | "weight">("non")
  const [filePath, setFilePath] = useState<string | null>(null)
  const [chartKey, setChartKey] = useState<number>(Date.now())

  return (
    <div className="border rounded bg-zinc-50 p-4 space-y-4">
      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => setActiveTab("non")}
          className={clsx(
            "px-3 py-1.5 text-sm font-medium rounded-t",
            activeTab === "non"
              ? "bg-blue-500 text-white"
              : "text-zinc-700 hover:text-zinc-900"
          )}
        >
          non-weight tied
        </button>
        <button
          onClick={() => setActiveTab("weight")}
          className={clsx(
            "px-3 py-1.5 text-sm font-medium rounded-t",
            activeTab === "weight"
              ? "bg-blue-500 text-white"
              : "text-zinc-700 hover:text-zinc-900"
          )}
        >
          weight tied
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "non" && (
        <div className="grid gap-4 xl:grid-cols-[18rem_minmax(0,1fr)]">
          <div className="border rounded p-4">
            <ControlPanel
              onAction={(path) => {
                if (path === "reset") {
                  setFilePath(null)
                } else {
                  setFilePath(`${path}`) // ensure served from /public
                }
                setChartKey(Date.now())
              }}
            />
          </div>
          <div className="min-w-0 border rounded p-4">
            <ClusterChart key={chartKey} filePath={filePath} />
          </div>
        </div>
      )}

      {activeTab === "weight" && (
        <div className="p-6 text-zinc-500 italic">(empty for now)</div>
      )}
    </div>
  )
}
