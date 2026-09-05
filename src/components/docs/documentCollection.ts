import { parse } from "yaml"

export type DocumentMeta = {
  title: string
  summary?: string
  date?: string
  category?: string
  order?: number
}

export type DocumentEntry = DocumentMeta & {
  slug: string
  body: string
}

type RawDocumentModules = Record<string, string>

function fallbackTitle(path: string) {
  return path
    .split("/")
    .pop()!
    .replace(/\.md$/i, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function parseDocument(path: string, source: string): DocumentEntry {
  const slug = path.split("/").pop()!.replace(/\.md$/i, "")
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)

  if (!match) {
    return { slug, title: fallbackTitle(path), body: source }
  }

  const meta = parse(match[1]) as Partial<DocumentMeta> | null
  return {
    slug,
    title: meta?.title || fallbackTitle(path),
    summary: meta?.summary,
    date: meta?.date ? String(meta.date) : undefined,
    category: meta?.category,
    order: typeof meta?.order === "number" ? meta.order : undefined,
    body: match[2].trim(),
  }
}

export function createDocumentCollection(modules: RawDocumentModules) {
  return Object.entries(modules)
    .map(([path, source]) => parseDocument(path, source))
    .sort((a, b) => {
      if (a.order !== undefined || b.order !== undefined) {
        return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)
      }
      return (b.date ?? "").localeCompare(a.date ?? "") || a.title.localeCompare(b.title)
    })
}

