import { DocsHub } from "@/components/docs/DocsHub"
import { createDocumentCollection } from "@/components/docs/documentCollection"

const modules = import.meta.glob("/src/content/cv/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

const documents = createDocumentCollection(modules).filter(
  (document) => document.slug !== "omega-language",
)

export function CVDocsPage() {
  return (
    <DocsHub
      documents={documents}
      basePath="/docs"
      title="Notes & publications"
      description="A small, growing collection of research notes and publication summaries."
    />
  )
}
