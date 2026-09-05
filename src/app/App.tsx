import { lazy, Suspense } from "react"
import type { PropsWithChildren } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { ProjectLayout } from "@/components/layout/ProjectLayout"
import { CVHomePage } from "@/projects/cv/CVHomePage"

const CVDocsPage = lazy(() =>
  import("@/projects/cv/CVDocsPage").then((module) => ({ default: module.CVDocsPage })),
)
const TRSOverviewPage = lazy(() =>
  import("@/projects/trs/TRSOverviewPage").then((module) => ({ default: module.TRSOverviewPage })),
)
const TRSDocsPage = lazy(() =>
  import("@/projects/trs/TRSDocsPage").then((module) => ({ default: module.TRSDocsPage })),
)
const TRSPlaygroundPage = lazy(() => import("@/projects/trs/TRSPlaygroundPage"))

function PageSuspense({ children }: PropsWithChildren) {
  return <Suspense fallback={<div className="route-loading">Loading...</div>}>{children}</Suspense>
}

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route element={<ProjectLayout projectId="cv" />}>
          <Route index element={<CVHomePage />} />
          <Route path="docs" element={<PageSuspense><CVDocsPage /></PageSuspense>} />
          <Route path="docs/:docSlug" element={<PageSuspense><CVDocsPage /></PageSuspense>} />
        </Route>

        <Route path="projects/trs-clusters" element={<ProjectLayout projectId="trs-clusters" />}>
          <Route index element={<PageSuspense><TRSOverviewPage /></PageSuspense>} />
          <Route path="docs" element={<PageSuspense><TRSDocsPage /></PageSuspense>} />
          <Route path="docs/:docSlug" element={<PageSuspense><TRSDocsPage /></PageSuspense>} />
          <Route
            path="playground"
            element={
              <PageSuspense>
                <TRSPlaygroundPage />
              </PageSuspense>
            }
          />
        </Route>

        <Route path="projects/TRS_clusters/*" element={<Navigate to="/projects/trs-clusters" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
