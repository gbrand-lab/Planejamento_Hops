export default function CaptureFeedTable({ rows, title }) {
  return (
    <div className="capture-table-block">
      <h3>{title}</h3>
      <div className="table-scroll">
        <table className="grid-table capture-table">
          <thead>
            <tr>
              <th>Pilar</th>
              <th>Posts no mês</th>
              <th>Registros</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.pillarId}>
                <td>{r.label}</td>
                <td>{r.posts}</td>
                <td className="fmt">{r.records}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
