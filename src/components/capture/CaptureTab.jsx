import { useRef, useState } from 'react'
import { buildCaptureReport } from '../../data/index.js'
import { exportElementToPdf } from '../../utils/exportPdf.js'
import CaptureStats from './CaptureStats.jsx'
import CaptureFeedTable from './CaptureFeedTable.jsx'
import CaptureNightTable from './CaptureNightTable.jsx'
import FixadoTable from './FixadoTable.jsx'
import ChecklistGrid from './ChecklistGrid.jsx'

export default function CaptureTab() {
  const report = buildCaptureReport()
  const captureRef = useRef(null)
  const [exporting, setExporting] = useState(false)

  async function handleExportPdf() {
    if (!captureRef.current || exporting) return
    setExporting(true)
    try {
      await exportElementToPdf(
        captureRef.current,
        'hopsbeer-roteiro-captacao.pdf',
        'Hops Beer, Roteiro de Captacao'
      )
    } catch (err) {
      console.error('Falha ao exportar PDF', err)
      alert('Nao foi possivel gerar o PDF. Tente novamente.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="panel">
      <section>
        <div className="capture-head">
          <div>
            <h2>Roteiro de captação, {report.monthLabel}</h2>
            <p className="section-desc">
              Uma captação mensal, dividida por tipo de conteúdo. As quantidades abaixo são a contagem
              real de posts do calendário desse mês, não estimativa.
            </p>
          </div>
          <button className="export-btn" onClick={handleExportPdf} disabled={exporting}>
            {exporting ? 'Gerando PDF...' : 'Exportar PDF'}
          </button>
        </div>

        <div ref={captureRef}>
          <CaptureStats totals={report.totals} />

          <h3 className="capture-section-title">Visita diurna, pilares fixos e rotativos</h3>
          <CaptureFeedTable rows={report.feed} title="Feed (visita diurna)" />

          <h3 className="capture-section-title">Sessão noturna, evento de música ao vivo (sexta)</h3>
          <CaptureNightTable rows={report.night} title="Música ao vivo, aviso" />

          <h3 className="capture-section-title">Programação da semana, feita em qualquer visita antes da segunda</h3>
          <FixadoTable fixado={report.fixado} />

          <ChecklistGrid />
        </div>
      </section>
    </div>
  )
}
