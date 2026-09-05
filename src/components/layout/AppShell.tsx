import { useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import { ExternalLink, Github, Menu, X } from "lucide-react"
import clsx from "clsx"
import { projects } from "@/app/projectRegistry"

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <header className="mobile-header">
        <NavLink to="/" className="mobile-brand" onClick={closeMenu}>
          Ke Dong
        </NavLink>
        <button
          type="button"
          className="icon-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="site-sidebar"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          title={menuOpen ? "Close navigation" : "Open navigation"}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {menuOpen && <button className="sidebar-scrim" onClick={closeMenu} aria-label="Close navigation" />}

      <aside id="site-sidebar" className={clsx("site-sidebar", menuOpen && "is-open")}>
        <div className="sidebar-brand">
          <NavLink to="/" onClick={closeMenu}>Ke Dong</NavLink>
          <p>Research & projects</p>
        </div>

        <nav className="project-nav" aria-label="Projects">
          <span className="nav-label">Projects</span>
          {projects.map((project) => {
            const active = project.id === "cv"
              ? location.pathname === "/" || location.pathname.startsWith("/docs")
              : location.pathname.startsWith(project.path)

            return (
              <NavLink
                key={project.id}
                to={project.path}
                onClick={closeMenu}
                className={clsx("project-nav-link", active && "is-active")}
              >
                <span>{project.shortLabel}</span>
                <span className="project-nav-arrow" aria-hidden="true">↗</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar-links">
          <a href="https://github.com/coliapaston" target="_blank" rel="noreferrer">
            <Github size={16} /> GitHub
          </a>
          <a href="mailto:ked000@ksu.edu">
            <ExternalLink size={16} /> Contact
          </a>
        </div>
      </aside>

      <div className="site-main">
        <Outlet />
      </div>
    </div>
  )
}

