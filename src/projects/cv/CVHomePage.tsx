import { ArrowUpRight, FileText, Github, Mail, MapPin } from "lucide-react"
import { NavLink } from "react-router-dom"
import { projects } from "@/app/projectRegistry"
import { profile, publications } from "@/projects/cv/profile"

export function CVHomePage() {
  const featuredProjects = projects.filter((project) => project.featured)

  return (
    <main className="cv-page page-frame">
      <section className="cv-intro" aria-labelledby="profile-name">
        <div className="cv-intro-copy">
          <p className="eyebrow">Computer Science</p>
          <h1 id="profile-name">{profile.name}</h1>
          <p className="cv-role">{profile.role}</p>
          <p className="cv-lede">{profile.introduction}</p>

          <div className="profile-links" aria-label="Contact links">
            <a href={`mailto:${profile.email}`}><Mail size={16} /> {profile.email}</a>
            <a href={profile.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
            <span><MapPin size={16} /> {profile.location}</span>
          </div>
        </div>

        <figure className="profile-portrait">
          <img src={profile.image} alt={`Illustrated portrait of ${profile.name}`} />
        </figure>
      </section>

      <section className="cv-section cv-grid" aria-labelledby="research-heading">
        <div>
          <p className="section-number">01</p>
          <h2 id="research-heading">Research</h2>
        </div>
        <div>
          <p className="section-intro">
            I am interested in the internal structure and reliability of modern AI systems,
            especially where representation analysis, symbolic structure, and human-facing
            exploration tools meet.
          </p>
          <ul className="interest-list">
            {profile.interests.map((interest) => <li key={interest}>{interest}</li>)}
          </ul>
        </div>
      </section>

      <section className="cv-section cv-grid" aria-labelledby="publications-heading">
        <div>
          <p className="section-number">02</p>
          <h2 id="publications-heading">Selected publications</h2>
        </div>
        <ol className="publication-list">
          {publications.map((publication) => (
            <li key={publication.title}>
              <span className="publication-year">{publication.year}</span>
              <div>
                <h3>{publication.title}</h3>
                <p>{publication.authors}</p>
                <div className="publication-footer">
                  <span>{publication.venue}</span>
                  {publication.pdf && (
                    <a href={publication.pdf} target="_blank" rel="noreferrer">
                      <FileText size={14} /> PDF
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="cv-section project-section" aria-labelledby="projects-heading">
        <div className="cv-grid section-heading-row">
          <div>
            <p className="section-number">03</p>
            <h2 id="projects-heading">Projects</h2>
          </div>
          <p>Interactive research tools and their supporting documentation.</p>
        </div>

        <div className="project-card-grid">
          {featuredProjects.map((project) => (
            <NavLink key={project.id} to={project.path} className="project-card">
              <div className="project-preview">
                {project.preview && <img src={project.preview} alt={`${project.label} interface preview`} />}
              </div>
              <div className="project-card-copy">
                <div>
                  <h3>{project.label}</h3>
                  <p>{project.summary}</p>
                </div>
                <ArrowUpRight size={20} aria-hidden="true" />
              </div>
            </NavLink>
          ))}
        </div>
      </section>
    </main>
  )
}
