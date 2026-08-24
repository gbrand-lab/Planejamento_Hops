export default function CaptureNightTable({ rows, title }) {
  return (
    <div className="capture-table-block capture-table-block--night">
      <h3>{title}</h3>
      <div className="table-scroll">
        <table className="grid-table capture-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantidade</th>
              <th>Registros</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td>{r.label}</td>
                <td>{r.qty}</td>
                <td className="fmt">{r.records}</td>
                <td className="capture-note-cell">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
