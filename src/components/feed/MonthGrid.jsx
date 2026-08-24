import { pillars, MONTH_NAME, WEEKDAY_HEADERS } from '../../data/index.js'

const KIND_LABEL = { fixo: 'FIXO', rotativo: 'ROTATIVO', fixado: 'FIXADO' }

function EntryChip({ entry }) {
  const pillar = pillars.find((p) => p.id === entry.pillarId)
  return (
    <div className="cell-chip">
      <span className={`cell-unit cell-unit--${pillar.kind}`}>{KIND_LABEL[pillar.kind]}</span>
      <span className="cell-pillar">{pillar.name}</span>
      <span className="cell-format">{entry.format}</span>
    </div>
  )
}

function toDateKey(year, monthIndex, day) {
  const m = String(monthIndex + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

export default function MonthGrid({ year, monthIndex, byDay, postsByDate = new Map(), onSelectDate }) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const leadingBlanks = new Date(year, monthIndex, 1).getDay() // 0 dom
  const totalCells = leadingBlanks + daysInMonth
  const trailingBlanks = (7 - (totalCells % 7)) % 7

  const cells = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ...Array(trailingBlanks).fill(null),
  ]

  return (
    <div className="month-block">
      <div className="month-banner">
        <span className="month-name">{MONTH_NAME[monthIndex]}</span>
        <span className="month-year">{year}</span>
      </div>
      <div className="calendar-grid">
        {WEEKDAY_HEADERS.map((h) => (
          <div key={h} className="calendar-weekday">{h}</div>
        ))}
        {cells.map((day, idx) => {
          if (day === null) return <div key={idx} className="calendar-cell calendar-cell--blank" />
          const dateKey = toDateKey(year, monthIndex, day)
          const entries = byDay.get(day)
          const dayPosts = postsByDate.get(dateKey) ?? []
          const multi = entries && entries.length > 1
          return (
            <button
              key={idx}
              type="button"
              className={`calendar-cell calendar-cell--clickable ${entries ? 'calendar-cell--filled' : ''} ${multi ? 'calendar-cell--multi' : ''}`}
              onClick={() => onSelectDate?.(dateKey)}
            >
              <span className="cell-day">
                {day}
                {dayPosts.length > 0 && <span className="cell-photo-dot" title={`${dayPosts.length} foto(s) anexada(s)`} />}
              </span>
              {entries?.map((entry, i) => (
                <EntryChip key={i} entry={entry} />
              ))}
            </button>
          )
        })}
      </div>
    </div>
  )
}
