export default function PillarCard({ pillar }) {
  return (
    <div className={`pillar-card pillar-card--${pillar.kind}`}>
      <span className={`tag tag--${pillar.kind}`}>{pillar.cadence}</span>
      <h3>{pillar.name}</h3>
      <p className="pillar-desc">{pillar.desc}</p>
      <div className="pillar-expect">
        <span className="pillar-expect-label">O que esperamos captar</span>
        <p>{pillar.expectation}</p>
      </div>
    </div>
  )
}
