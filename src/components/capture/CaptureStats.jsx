export default function CaptureStats({ totals }) {
  return (
    <div className="capture-stats">
      <div className="capture-stat">
        <span className="capture-stat-num">{totals.feed}</span>
        <span className="capture-stat-label">registros, feed (visita diurna)</span>
      </div>
      <div className="capture-stat">
        <span className="capture-stat-num">{totals.night}</span>
        <span className="capture-stat-label">registros, sessão noturna (música ao vivo)</span>
      </div>
      <div className="capture-stat">
        <span className="capture-stat-num">{totals.fixado}</span>
        <span className="capture-stat-label">registros, programação da semana</span>
      </div>
      <div className="capture-stat capture-stat--alert">
        <span className="capture-stat-num">{totals.month}</span>
        <span className="capture-stat-label">total de registros no mês</span>
      </div>
    </div>
  )
}
