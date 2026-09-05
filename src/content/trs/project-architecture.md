- **Frontend Framework**: Vite + React + TypeScript
- **UI layer**: Shared project shell with TailwindCSS utilities for the playground
- **Routing**: Nested `react-router-dom` routes registered by project
- **Directory Structure (core parts)**:

```
src/
  app/
    projectRegistry.ts            # Project and section navigation metadata
    App.tsx                       # Nested application routes
  components/
    docs/                         # Shared Markdown document hub
    layout/                       # Global and project-level navigation
  projects/trs/
    PlaygroundComponents.tsx     # Plotly chart and dataset controls
    PlaygroundContainer.tsx      # Playground mode container
    TRSOverviewPage.tsx           # Project overview
    TRSDocsPage.tsx               # TRS document collection adapter
    TRSPlaygroundPage.tsx         # Playground route
  content/trs/                    # Project-owned Markdown documents
    
public/
 data/non-weight-tied/
 	mistralai/
        Mistral-7B-v0.1/
            output_proj_cluster_l2_with_localdim.json
            ...
        Mixtral-8x7B-v0.1/
            output_proj_cluster_l2_with_localdim.json
            ...
 	gpt-oss/
 		output_proj_cluster_l2_with_localdim.json
        ...
        
 non-weight-tied/
 	(To be continued...)

vite.config.ts                    # Root-site Vite configuration
```

---

##  Implemented Features

1. **Project Navigation**: Switch between the CV hub, TRS overview, documentation, and playground.  
2. **Cluster Visualization (Plotly)**:
 * Load JSON data (`output_proj_cluster_l2_with_localdim.json`).  
 * Compute and plot **PCA coordinates** of cluster points.  
 * Random seed controls sampled clusters.  
 * Cluster center calculation: average of `pca_x, pca_y` values in the cluster.  
 * `local_dim`: average within-cluster value, rounded to two decimals.  
 * Jitter: prevent overlapping points.  
3. **Interactions**:
 * Click a single point → show JSON row details.  
 * Click cluster center → show aggregated cluster info (mean + token list).  
 * Reset → clear plot and selection.  
4. **Statistics Display**:
 * Clusters total = max cluster_id + 1  
 * Valid Tokens total = total number of data points  

---

##  Technical Details

* **JSON Data Schema (`DataPoint`)**:

```ts
type DataPoint = {
  token_id?: number
  token_label?: string
  cluster_label: number
  probability?: number
  local_dim?: number
  pca_x?: number
  pca_y?: number
  members?: string[]
}
```

(Some fields are optional, used for synthetic cluster center points)

- **State Management**:
  - `data` → currently loaded JSON data.
  - `clusters` → number of clusters displayed.
  - `pickedClusters` → randomly selected clusters.
  - `seed` → random seed.
  - `selectedPoint` → currently selected point (or cluster center).
  - `error` → flag for failed file read.
- **Styling**:
  - Tailwind v3 (using `@apply` syntax)
  - Shared black-and-white site shell with focused playground controls
---
title: Project architecture
summary: The application layers, data schema, and runtime flow behind TRS Clusters.
category: Architecture
order: 2
---
