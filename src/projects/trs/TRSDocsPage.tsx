import { DocsHub } from "@/components/docs/DocsHub"
import { createDocumentCollection } from "@/components/docs/documentCollection"

const modules = import.meta.glob("/src/content/trs/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

const documents = createDocumentCollection(modules)

export function TRSDocsPage() {
  return (
    <DocsHub
      documents={documents}
      basePath="/projects/trs-clusters/docs"
      title="TRS documentation"
      description="Architecture, data flow, and interaction notes for the TRS Clusters playground."
    />
  )
}

