import { pillars, fmtDate } from '../../data/index.js'

export default function FixadoTable({ fixado }) {
  return (
    <div className="capture-table-block">
      <h3>Programação da semana (fixado), {fixado.posts} posts no mês</h3>
      <p className="section-desc">
        Post único, trocado toda segunda, {fixado.posts} publicações reais no mês, {fixado.posts}{' '}
        sessões de captação própria (sem reaproveitar material de outro pilar, mesma regra do resto do
        feed).
      </p>
      <div className="table-scroll">
        <table className="grid-table capture-table">
          <thead>
            <tr><th>Segunda</th><th>Contexto da semana</th><th>Registros</th><th>Observação</th></tr>
          </thead>
          <tbody>
            {fixado.weeks.map((w) => (
              <tr key={w.date.toISOString()}>
                <td>{fmtDate(w.date)}</td>
                <td>{w.rotativePillars.map((id) => pillars.find((p) => p.id === id)?.name).join(' + ')}</td>
                <td className="fmt">2</td>
                <td className="capture-note-cell">
                  Captação própria dessa semana, até 2 registros se houver elemento visual (novo rótulo,
                  cartaz do line-up musical); senão é só arte com a agenda. Não usar fotos dos pilares
                  rotativos da coluna ao lado, é só contexto do que mais está rolando naquela semana.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
