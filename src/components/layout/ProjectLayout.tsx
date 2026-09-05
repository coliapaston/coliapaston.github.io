import { NavLink, Outlet } from "react-router-dom"
import clsx from "clsx"
import { getProject, type ProjectDefinition } from "@/app/projectRegistry"

type ProjectLayoutProps = {
  projectId: ProjectDefinition["id"]
}

export function ProjectLayout({ projectId }: ProjectLayoutProps) {
  const project = getProject(projectId)

  return (
    <div className="project-layout">
      <header className="project-header">
        <div className="project-context">
          <span>{project.shortLabel}</span>
        </div>
        <nav className="project-tabs" aria-label={`${project.label} sections`}>
          {project.sections.map((section) => (
            <NavLink
              key={section.path}
              to={section.path}
              end={section.end}
              className={({ isActive }) => clsx("project-tab", isActive && "is-active")}
            >
              {section.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet />
    </div>
  )
}

