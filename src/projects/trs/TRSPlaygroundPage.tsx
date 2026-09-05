import { PlaygroundContainer } from "@/projects/trs/PlaygroundContainer"

export default function TRSPlaygroundPage() {
  return (
    <main className="playground-page">
      <div className="playground-heading">
        <div>
          <p className="eyebrow">Interactive analysis</p>
          <h1>Cluster playground</h1>
        </div>
        <p>Select a model, matrix component, and normalization to inspect its token clusters.</p>
      </div>
      <PlaygroundContainer />
    </main>
  )
}
