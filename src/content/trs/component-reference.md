---
title: Component reference
summary: Responsibilities and interactions of the control panel and cluster chart.
category: Reference
order: 3
---

Version: 0.1

## 1. Overview

- **`ControlPanel`**
   Left-side UI panel responsible for:
  - Selecting **model**, **component**, and **normalization**
  - Building the corresponding dataset file path
  - Triggering `Run` (load dataset) and `Reset` (clear dataset)
- **`ClusterChart`**
   Main visualization panel responsible for:
  - Loading cluster data from JSON files
  - Plotting token-level PCA projections
  - Rendering cluster centers
  - Providing interactive features (click, filter, inspect details)
  - Controls for toggling cluster points/centers, adjusting random seed, and setting number of clusters

------

## 2. `ControlPanel`

### Features

- Stepwise user selection:
  1. **Model Name** (`Mistral 7B`, `Mixtral 8x7B`, `GPT-oss-20B`)
  2. **Component** (`input embedding` / `output projection`)
  3. **Normalization** (`l2` / `non-l2`)
- `Run` button:
  - Builds a normalized file path
  - Calls `onAction(path)` to trigger loading in the parent
- `Reset` button:
  - Clears all selections
  - Calls `onAction("reset")` to clear chart data

### Development Flow

1. **State Management**
   - `model`, `component`, `norm`
   - `isReady` ensures Run is enabled only when all are selected
2. **Path Building**
   - Uses lookup maps (`modelMap`, `compMap`, `normMap`)
   - Concatenates into standardized file path
3. **Interaction Design**
   - Conditional rendering for each step
   - Reset ensures proper cascading reset of selections

------

## 3. `ClusterChart`

### Features

- Accepts `filePath` prop → loads JSON file

- JSON structure:

  ```json
  {
    "token_id": 123,
    "token_label": "word",
    "cluster_label": 5,
    "probability": 0.9,
    "local_dim": 75,
    "pca_x": 0.12,
    "pca_y": -0.34
  }
  ```

- After load:

  - Extracts unique clusters
  - Picks up to 20 clusters (pseudo-random, seed-based)
  - Displays first `N` clusters (slider controlled)
  - Each cluster mapped to a stable HSL color
  - Optionally show **cluster points** and/or **cluster centers**

### Interaction

- **Click on point**
   → Show token details in table below
- **Click on center**
   → Toggle between single-cluster-only mode and global mode
- **Checkboxes**
   → Toggle visibility of points and centers

### Development Flow

1. **Data Loading (`useEffect`)**
   - Fetches JSON on `filePath` change
   - Updates internal states (`data`, `pickedClusters`, `error`)
2. **Cluster Sampling**
   - `pickRandomClusters` sorts with `sin(seed * i)` → deterministic pseudo-random
3. **Color Mapping**
   - `getClusterColor(clusterId)` uses HSL hue wheel (step-based) → stable and diverse
4. **Visualization**
   - **Points:** scatter `markers+text` with labels
   - **Centers:** scatter `text+markers` with ⚜️ emoji + cross marker
   - Legend always shown (`showlegend: true`) to avoid disappearing with single cluster
5. **UI Controls**
   - Row 1: Random seed input
   - Row 2: Slider (cluster count) + checkboxes (show points/centers)

------

## 4. Component Data Flow

```plaintext
PlaygroundContainer
   ├── ControlPanel
   │     └── onAction(path) → update filePath
   │
   └── ClusterChart(filePath)
         ├── useEffect: fetch JSON
         ├── traces: scatter points + centers
         ├── UI controls: seed + slider + checkboxes
         ├── onClick: handle cluster/center clicks
         └── details table: show selected token/center
```

------

## 5. Key Notes

- **Color stability**:
   `hsl(hue, 65%, 50%)` ensures consistent cluster–color mapping, even after filtering.
- **Legend handling**:
   `showlegend: true` avoids losing the legend when only one cluster is displayed.
- **Performance**:
   Limits to top-N clusters (via slider) to avoid rendering overload.
- **Click filtering**:
   Clicking a cluster center toggles “single-cluster mode.”
- **Extensibility**:
  - Add jitter to prevent label overlaps
  - Allow exporting chart snapshots
  - Swap HSL scheme with perceptually uniform palettes (e.g., d3-scale-chromatic)

------

 **Summary**

- `ControlPanel` = dataset selection + path building
- `ClusterChart` = visualization + interactivity
- Both work together via `filePath` state, forming a clean **data → control → visualization** pipeline.
