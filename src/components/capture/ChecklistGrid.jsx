import { captureChecklist } from '../../data/index.js'

export default function ChecklistGrid() {
  return (
    <>
      <h3 className="capture-checklist-title">Checklist por item</h3>
      <div className="capture-checklist">
        {captureChecklist.map((c) => (
          <div key={c.id} className="checklist-card">
            <h4>{c.title}</h4>
            <ul>
              {c.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}
