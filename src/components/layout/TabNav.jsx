export const TABS = [
  { id: 'briefing', label: 'Planejamento & Briefing' },
  { id: 'feed', label: 'Calendário de Postagens' },
  { id: 'captacao', label: 'Roteiro de Captação' },
]

export default function TabNav({ activeTab, onChange }) {
  return (
    <nav className="tabs">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab-btn ${activeTab === t.id ? 'tab-btn--active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
