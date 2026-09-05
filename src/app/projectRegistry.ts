export type ProjectSection = {
  label: string
  path: string
  end?: boolean
}

export type ProjectDefinition = {
  id: "cv" | "trs-clusters"
  label: string
  shortLabel: string
  path: string
  summary: string
  sections: readonly ProjectSection[]
  featured?: boolean
  preview?: string
}

export const projects: readonly ProjectDefinition[] = [
  {
    id: "cv",
    label: "Ke Dong",
    shortLabel: "CV",
    path: "/",
    summary: "Research profile and personal documentation hub.",
    sections: [
      { label: "CV", path: "/", end: true },
      { label: "Docs", path: "/docs" },
    ],
  },
  {
    id: "trs-clusters",
    label: "TRS Clusters",
    shortLabel: "TRS Clusters",
    path: "/projects/trs-clusters",
    summary: "Explore linguistic structure in language-model embedding spaces.",
    sections: [
      { label: "Overview", path: "/projects/trs-clusters", end: true },
      { label: "Docs", path: "/projects/trs-clusters/docs" },
      { label: "Playground", path: "/projects/trs-clusters/playground" },
    ],
    featured: true,
    preview: "/images/trs-preview.jpg",
  },
] as const

export function getProject(id: ProjectDefinition["id"]) {
  const project = projects.find((item) => item.id === id)
  if (!project) throw new Error(`Unknown project: ${id}`)
  return project
}
