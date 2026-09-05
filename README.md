# coliapaston.github.io

Personal research homepage, documentation hub, and interactive project playgrounds.

## Local development

```bash
npm install
npm run dev
```

Build the static site with:

```bash
npm run build
```

## Structure

```text
src/
  app/                  project registry and routes
  components/
    docs/               reusable Markdown document hub
    layout/             global sidebar and project tabs
  content/
    cv/                 CV notes and publication summaries
    trs/                TRS project documentation
  projects/
    cv/                 CV homepage and docs adapter
    trs/                overview, docs adapter, and playground
```

`src/app/projectRegistry.ts` is the navigation source of truth. A project owns its pages
and Markdown collection, while the global shell and document reader remain shared.

## Adding a document

Add a Markdown file to the relevant directory under `src/content/`. Supported frontmatter:

```yaml
---
title: Document title
summary: One-sentence summary
date: 2026-01-01
category: Research note
order: 1
---
```

Documents are discovered at build time. `order` is optional; without it, documents are
sorted by date and title.

