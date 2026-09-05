import { useEffect } from "react"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ArrowLeft, BookOpen } from "lucide-react"
import type { DocumentEntry } from "@/components/docs/documentCollection"

type DocsHubProps = {
  documents: readonly DocumentEntry[]
  basePath: string
  title: string
  description: string
}

export function DocsHub({ documents, basePath, title, description }: DocsHubProps) {
  const { docSlug } = useParams()
  const navigate = useNavigate()
  const selected = docSlug ? documents.find((doc) => doc.slug === docSlug) : undefined

  useEffect(() => {
    if (docSlug && !selected) navigate(basePath, { replace: true })
  }, [basePath, docSlug, navigate, selected])

  if (selected) {
    return (
      <div className="docs-reader">
        <aside className="docs-index docs-index-reader" aria-label="Documents">
          <NavLink to={basePath} className="docs-back-link">
            <ArrowLeft size={16} /> All documents
          </NavLink>
          <DocumentLinks documents={documents} basePath={basePath} activeSlug={selected.slug} />
        </aside>

        <article className="markdown-body">
          <div className="document-kicker">
            {selected.category && <span>{selected.category}</span>}
            {selected.date && <time dateTime={selected.date}>{selected.date.slice(0, 4)}</time>}
          </div>
          <h1>{selected.title}</h1>
          {selected.summary && <p className="document-summary">{selected.summary}</p>}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{selected.body}</ReactMarkdown>
        </article>
      </div>
    )
  }

  return (
    <main className="docs-home page-frame">
      <div className="page-heading">
        <span className="eyebrow"><BookOpen size={15} /> Documentation</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="document-list">
        {documents.map((doc) => (
          <NavLink key={doc.slug} to={`${basePath}/${doc.slug}`} className="document-row">
            <div>
              <div className="document-meta">
                {doc.category && <span>{doc.category}</span>}
                {doc.date && <time dateTime={doc.date}>{doc.date.slice(0, 4)}</time>}
              </div>
              <h2>{doc.title}</h2>
              {doc.summary && <p>{doc.summary}</p>}
            </div>
            <span aria-hidden="true">→</span>
          </NavLink>
        ))}
      </div>
    </main>
  )
}

function DocumentLinks({
  documents,
  basePath,
  activeSlug,
}: {
  documents: readonly DocumentEntry[]
  basePath: string
  activeSlug: string
}) {
  return (
    <nav className="document-links">
      {documents.map((doc) => (
        <NavLink
          key={doc.slug}
          to={`${basePath}/${doc.slug}`}
          className={doc.slug === activeSlug ? "is-active" : undefined}
        >
          {doc.title}
        </NavLink>
      ))}
    </nav>
  )
}
