// Left panel with buttons
import Plot from "react-plotly.js"
import type { Data } from "plotly.js"
import clsx from "clsx"
import { useState, useEffect } from "react"
//import { interpolateRainbow } from "d3-scale-chromatic"


export function ControlPanel({ onAction }: { onAction: (path: string) => void }) {
  const [model, setModel] = useState<string | null>(null)
  const [component, setComponent] = useState<string | null>(null)
  const [norm, setNorm] = useState<string | null>(null)

  const isReady = model && component && norm

  // build full path based on user selection
  const buildPath = (model: string, component: string, norm: string): string => {
    // map model
    const modelMap: Record<string, string> = {
      "Mistral 7B": "mistralai/Mistral-7B-v0.1",
      "Mixtral 8x7B": "mistralai/Mixtral-8x7B-v0.1",
      "GPT-oss-20B": "gpt-oss/GPT-oss-20B-v0.1",
    }

    // map component
    const compMap: Record<string, string> = {
      "input embedding": "input_embd_cluster",
      "output projection": "output_proj_cluster",
    }

    // map normalization
    const normMap: Record<string, string> = {
      "l2": "l2_with_localdim.json",
      "non-l2": "with_localdim.json",
    }

    return `${import.meta.env.BASE_URL}data/non-weight-tied/${modelMap[model]}/${compMap[component]}_${normMap[norm]}`

  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Controls</h2>

      {/* Layer 1: Model Name */}
      <div>
        <p className="text-sm font-medium mb-2">Model Name</p>
        <div className="flex flex-wrap gap-2">
          {["Mistral 7B", "Mixtral 8x7B", "GPT-oss-20B"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setModel(m)
                setComponent(null)
                setNorm(null)
              }}
              className={clsx(
                "px-2 py-1 text-xs rounded border",
                model === m
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-gray-200 hover:bg-gray-300 border-gray-300"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Layer 2: Component */}
      {model && (
        <div>
          <p className="text-sm font-medium mb-2">Component</p>
          <div className="flex flex-wrap gap-2">
            {["input embedding", "output projection"].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setComponent(c)
                  setNorm(null)
                }}
                className={clsx(
                  "px-2 py-1 text-xs rounded border",
                  component === c
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-gray-200 hover:bg-gray-300 border-gray-300"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Layer 3: Normalization */}
      {model && component && (
        <div>
          <p className="text-sm font-medium mb-2">Normalization</p>
          <div className="flex flex-wrap gap-2">
            {["l2", "non-l2"].map((n) => (
              <button
                key={n}
                onClick={() => setNorm(n)}
                className={clsx(
                  "px-2 py-1 text-xs rounded border",
                  norm === n
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-gray-200 hover:bg-gray-300 border-gray-300"
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <button
          disabled={!isReady}
          onClick={() => {
            if (model && component && norm) {
              const path = buildPath(model, component, norm)
              onAction(path)  //  send full path out
            }
          }}
          className={clsx(
            "px-3 py-1.5 rounded",
            isReady
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          Run
        </button>
        <button
          onClick={() => {
            setModel(null)
            setComponent(null)
            setNorm(null)
            onAction("reset")
          }}
          className="px-3 py-1.5 rounded bg-gray-300 hover:bg-gray-400"
        >
          Reset
        </button>
      </div>
    </div>
  )
}


type DataPoint = {
  token_id?: number        // optional now
  token_label?: string     // optional now
  cluster_label: number
  probability?: number     // center doesn’t need prob
  local_dim?: number       // center uses mean instead of per-point
  pca_x?: number           // center uses mean
  pca_y?: number
  members?: string[]       // only for cluster centers
}

export function ClusterChart({ filePath }: { filePath: string | null }) {
  const [data, setData] = useState<DataPoint[]>([])
  const [clusters, setClusters] = useState(5) // number of clusters to display (0–20)
  const [pickedClusters, setPickedClusters] = useState<number[]>([]) // randomly picked cluster IDs
  const [seed, setSeed] = useState(42)
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null)
  const [error, setError] = useState(false)
  const [activeCluster, setActiveCluster] = useState<number | null>(null)
  // const clusterColorMap: Record<number, string> = {}
  const [showCenters, setShowCenters] = useState(true)
  const [showPoints, setShowPoints] = useState(true)



  // Load JSON data
  useEffect(() => {
    if (!filePath) {
      setData([])
      setPickedClusters([])
      setSelectedPoint(null)
      setError(false)
      return
    }
    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${filePath}`)
        return res.json()
      })
      .then((json: DataPoint[]) => {
        setData(json)
        setSelectedPoint(null)
        setError(false)   // Success -> Clear Error
        const allClusters = Array.from(new Set(json.map((d) => d.cluster_label)))
        const picked = pickRandomClusters(allClusters, 20, seed)
        setPickedClusters(picked)
      })
      .catch((err) => {
        console.error("Error loading JSON:", err)
        setData([])
        setSelectedPoint(null)
        setPickedClusters([])
        setError(true)    // Failure -> Mark as error
      })
  }, [filePath, seed])

  // pseudo-random cluster picking function
  function pickRandomClusters(
    all: number[],
    maxCount: number,
    seed: number
  ): number[] {
    const arr = [...all]
    // pseudo-random sort based on sin(seed * i)
    arr.sort((a, b) => {
      const ra = Math.sin(seed * (a + 1)) * 10000
      const rb = Math.sin(seed * (b + 1)) * 10000
      return ra - rb
    })
    return arr.slice(0, maxCount)
  }

// const palette = [
//   "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
//   "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
//   "#393b79", "#637939", "#8c6d31", "#843c39", "#7b4173",
//   "#3182bd", "#31a354", "#756bb1", "#636363", "#e6550d"
// ]

function getClusterColor(clusterId: number): string {
  const step = 40   
  const hue = (clusterId % step) * (360 / step)
  return `hsl(${hue}, 65%, 50%)`
}


  // const TAU = Math.PI * 2
  // const ANGLE_EPS = 0.5 // try 0.5 first; if still overlapping, bump to 0.8~1.0

  // // deterministic [0,1) PRNG based on a scalar
  // function prng(x: number) {
  //   const s = Math.sin(x) * 10000
  //   return s - Math.floor(s)
  // }

  // display only the first `clusters` from pickedClusters
  // const clustersToShow = pickedClusters.slice(0, clusters)

  // Plotly traces
  const traces: Data[] = []
  // clustersToShow.forEach((c) => {
  //   const clusterPoints = data.filter((d) => d.cluster_label === c)
  const visibleClusters = activeCluster !== null 
    ? [activeCluster] 
    : pickedClusters.slice(0, clusters)

  visibleClusters.forEach((c) => {
    const clusterPoints = data.filter((d) => d.cluster_label === c)
    const color = getClusterColor(c);

    // --- compute cluster center from pca_x/pca_y ---
    const sum = clusterPoints.reduce(
      (acc, d) => {
        acc.x += d.pca_x ?? 0
        acc.y += d.pca_y ?? 0
        return acc
      },
      { x: 0, y: 0 }
    )
    const centerX = sum.x / clusterPoints.length
    const centerY = sum.y / clusterPoints.length

    // scatter points for each cluster
    // traces.push({
    //   x: clusterPoints.map((d) => d.pca_x ?? 0),
    //   y: clusterPoints.map((d) => d.pca_y ?? 0),
    //   mode: "markers+text",
    //   text: clusterPoints.map((d) => d.token_label ?? ""),
    //   textposition: "top center",
    //   type: "scatter",
    //   name: `Cluster ${c}`,
    // } as unknown as Data)
    if (showPoints) {
      traces.push({
          x: clusterPoints.map((d) => d.pca_x ?? 0),
          y: clusterPoints.map((d) => d.pca_y ?? 0),
          mode: "markers+text",
          marker: { color },
          text: clusterPoints.map((d) => d.token_label ?? ""),
          textposition: "top center",
          type: "scatter",
          name: `Cluster ${c}`,
          showlegend: true,
          customdata: clusterPoints.map((d) => [
            d.token_label ?? "",
            d.cluster_label,
            d.pca_x ?? 0,
            d.pca_y ?? 0
          ]),
          hovertemplate:
            "Token: %{customdata[0]}<br>" +
            "Cluster: %{customdata[1]}<br>" +
            "Coords: (%{customdata[2]:.2f}, %{customdata[3]:.2f})" +
            "<extra></extra>",
        } as unknown as Data)
      }



    // traces.push({
    //   x: clusterPoints.map((d) => {
    //     // base jitter: same as your original (scaled by 1 - probability), but deterministic
    //     const baseX = (1 - d.probability) * ((prng(seed * 0.73 + d.token_id * 0.37 + c * 0.19) - 0.5) * 2)
    //     // angle jitter: fixed radius ANGLE_EPS, angle depends on seed/token/cluster
    //     const ang  = TAU * prng(seed * 1.11 + d.token_id * 1.07 + c * 0.97)
    //     const ax   = ANGLE_EPS * Math.cos(ang)
    //     return centerX + baseX + ax
    //   }),
    //   y: clusterPoints.map((d) => {
    //     const baseY = (1 - d.probability) * ((prng(seed * 0.61 + d.token_id * 0.53 + c * 0.29) - 0.5) * 2)
    //     const ang   = TAU * prng(seed * 1.11 + d.token_id * 1.07 + c * 0.97) // same angle as x
    //     const ay    = ANGLE_EPS * Math.sin(ang)
    //     return centerY + baseY + ay
    //   }),
    //   mode: "markers+text",
    //   text: clusterPoints.map((d) => d.token_label),
    //   textposition: "top center",
    //   type: "scatter",
    //   name: `Cluster ${c}`,
    // } as unknown as Data)


    // cluster center
  //   traces.push({
  //     x: [centerX],
  //     y: [centerY],
  //     mode: "markers",
  //     marker: { color: "red", size: 12, symbol: "x" },
  //     type: "scatter",
  //     name: `Center ${c}`,
  //   } as Data)

      if (showCenters) {
        traces.push({
          x: [centerX],
          y: [centerY],
          mode: "text+markers",
          type: "scatter",
          marker: { size: 16, symbol: "x", color},
          text: ["⚜️"],
          textfont: { size: 14 },
          textposition: "middle center",
          customdata: [[c, centerX, centerY]],
          hovertemplate:
            "Cluster: %{customdata[0]}<br>" +
            "Coords: (%{customdata[1]:.2f}, %{customdata[2]:.2f})" +
            "<extra></extra>",
          name: `⚜️ Center ${c}`,
          showlegend: true,
        } as Data)
      }

  })

  return (
    <div className="space-y-4">

      {/* section title */}
        <h2 className="text-lg font-bold">2D PCA Results:</h2>

      {/* file path info */}
      {filePath && (
        <p className={clsx("text-xs", error ? "text-red-700" : "text-gray-500")}>
          {error ? "The selected dataset could not be loaded." : `Data source: ${filePath}`}
        </p>
      )}

      {/* Control Area */}
      <div className="flex flex-col gap-4">

        {/* 第一行: Seed */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Random Seed:</label>
          <input
            type="number"
            value={seed}
            onChange={(e) => setSeed(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24"
          />
        </div>

        {/* 第二行: Slider + Checkbox */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          {/* Slider */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Clusters:</label>
            <input
              type="range"
              min={0}
              max={20}
              value={clusters}
              onChange={(e) => setClusters(Number(e.target.value))}
            />
            <span>{clusters}</span>
          </div>

          {/* Checkbox group */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={showPoints}
                onChange={(e) => setShowPoints(e.target.checked)}
              />
              Show Cluster Points
            </label>

            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={showCenters}
                onChange={(e) => setShowCenters(e.target.checked)}
              />
              Show Cluster Centers
            </label>
          </div>
        </div>
      </div>



      {/* Plotly chart */}
      <div className="border rounded bg-white">
        <Plot
          data={traces}
          layout={{
            autosize: true,
            height: 400,
            margin: { t: 20, r: 20, b: 40, l: 40 },
            hovermode: "closest",
            showlegend: true,
            legend: { 
              orientation: "v",
              x: 1.02,
              y: 1 
            }
          }}
          style={{ width: "100%", height: "100%" }}
          config={{ responsive: true, displaylogo: false }}
          onClick={(event) => {
            const pointIndex = event.points?.[0]?.pointIndex
            const traceName = event.points?.[0]?.data?.name
            if (!traceName) return

            // Case 1: User clicked on a normal cluster point
            if (typeof pointIndex === "number" && traceName.startsWith("Cluster")) {
              const clusterId = parseInt(traceName.split(" ")[1])
              const clusterPoints = data.filter((d) => d.cluster_label === clusterId)
              const point = clusterPoints[pointIndex]
              setSelectedPoint(point)

              // // Toggle activeCluster
              // if (activeCluster === clusterId) {
              //   setActiveCluster(null) // Cancel filter → show all
              // } else {
              //   setActiveCluster(clusterId) // Only show the cluster this point belongs to
              // }
            } 

            // Case 2: User clicked on the cluster center
            else if (traceName.includes("Center")) {
              const parts = traceName.split(" ")
              const clusterId = parseInt(parts[parts.length - 1])
              // const clusterId = parseInt(traceName.split(" ")[1])
              const clusterPoints = data.filter((d) => d.cluster_label === clusterId)
              const tokens = clusterPoints.map(d => d.token_label ?? "")

              setShowPoints(true)
              setShowCenters(true)

              if (activeCluster === clusterId) {
                  setActiveCluster(null)   // Show all
                } else {
                  setActiveCluster(clusterId) // Display only this cluster
                }

              // Compute mean PCA coordinates and mean local_dim
              let cx = 0, cy = 0, dim = 0
              if (clusterPoints.length > 0) {
                // const n = clusterPoints.length
                for (const d of clusterPoints) {
                  cx += d.pca_x ?? 0
                  cy += d.pca_y ?? 0
                  dim += d.local_dim ?? 0
                }
                cx /= clusterPoints.length
                cy /= clusterPoints.length
                dim /= clusterPoints.length
              }

              // Round to 2 decimals
              const avgDim = Number(dim.toFixed(2))

              // Construct pseudo DataPoint for the cluster center
              setSelectedPoint({
                cluster_label: clusterId,
                local_dim: avgDim,
                pca_x: cx,
                pca_y: cy,
                members: tokens,
              })
            }
          }}


        />
      </div>
      
      {/* dataset stats */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700">
        <p>
          <span className="font-medium">Clusters total:</span>{" "}
          {data.length > 0 ? Math.max(...data.map((d) => d.cluster_label)) + 1 : 0}
        </p>
        <p>
          <span className="font-medium">Valid tokens total:</span>{" "}
          {data.length}
        </p>
      </div>

      {/* selected JSON row */}
      {selectedPoint && (
        <table className="w-full table-auto border-collapse border border-gray-300 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-1 text-left">Key</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(selectedPoint).map(([key, value]) => (
              <tr key={key}>
                <td className="border border-gray-300 px-2 py-1 font-medium">{key}</td>
                <td className="border border-gray-300 px-2 py-1">
                  {Array.isArray(value) ? (
                    <div className="flex flex-wrap gap-1">
                      {value.map((v, i) => (
                        <span
                          key={i}
                          className="px-1 py-0.5 bg-gray-100 border rounded text-[10px]"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  ) : (
                    String(value)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  )
}
