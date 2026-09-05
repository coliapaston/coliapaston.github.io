import { ArrowRight, BookOpen, ChartNoAxesCombined } from "lucide-react"
import { NavLink } from "react-router-dom"

export function TRSOverviewPage() {
  return (
    <main className="trs-overview page-frame">
      <div className="page-heading trs-heading">
        <p className="eyebrow">Representation analysis</p>
        <h1>TRS Clusters</h1>
        <p>
          A document hub and interactive playground for exploring linguistic structure
          in language-model embedding and unembedding spaces.
        </p>
      </div>

      <div className="trs-overview-grid">
        <section>
          <h2>What it explores</h2>
          <p>
            The playground compares token clusters across Mistral-7B, Mixtral-8x7B,
            and GPT-oss-20B. It exposes principal-component projections, cluster centers,
            token membership, local dimension, and deterministic cluster sampling.
          </p>
        </section>
        <section>
          <h2>How it is organized</h2>
          <p>
            Documentation records the data flow and component architecture. The playground
            turns the same datasets into an inspectable interface for model, component,
            and normalization choices.
          </p>
        </section>
      </div>

      <div className="trs-entry-links">
        <NavLink to="/projects/trs-clusters/docs">
          <BookOpen size={20} />
          <span><strong>Read the docs</strong><small>Architecture and component notes</small></span>
          <ArrowRight size={18} />
        </NavLink>
        <NavLink to="/projects/trs-clusters/playground">
          <ChartNoAxesCombined size={20} />
          <span><strong>Open playground</strong><small>Explore the cluster datasets</small></span>
          <ArrowRight size={18} />
        </NavLink>
      </div>
    </main>
  )
}

