// 4 posts fixos por semana, sempre nos mesmos dias: Segunda (fixado),
// Quarta (Produto), Sexta (Música ao vivo) e Domingo (Rotativo). Sem
// alternância de padrão, cadência simples e previsível.
const ROTATIVE_CYCLE = ['experiencia', 'bastidores', 'institucional', 'gastronomia', 'educacional']

const MONTH_ABBR = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
export const MONTH_NAME = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
export const WEEKDAY_HEADERS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const WEEKDAY_LABEL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function fmtDate(date) {
  return `${String(date.getDate()).padStart(2, '0')} ${MONTH_ABBR[date.getMonth()]}`
}

export function fmtRange(start, end) {
  return `${fmtDate(start)} a ${fmtDate(end)}`
}

// Primeira segunda-feira da janela (31/ago/2026) até cobrir set + out inteiros.
const START_MONDAY = new Date(2026, 7, 31)
const WEEK_COUNT = 9 // até a semana de 26/out a 01/nov, que fecha outubro

export function buildCalendar() {
  const weeks = []

  for (let w = 0; w < WEEK_COUNT; w++) {
    const weekNumber = w + 1
    const monday = addDays(START_MONDAY, w * 7)
    const wednesday = addDays(monday, 2)
    const friday = addDays(monday, 4)
    const sunday = addDays(monday, 6)
    const rotativePillar = ROTATIVE_CYCLE[w % ROTATIVE_CYCLE.length]
    const produtoFormat = weekNumber % 2 === 1 ? 'Estático' : 'Reels'

    const days = [
      { date: monday, weekdayLabel: WEEKDAY_LABEL[monday.getDay()], pillarId: 'fixado', format: 'Estático · Fixado' },
      { date: wednesday, weekdayLabel: WEEKDAY_LABEL[wednesday.getDay()], pillarId: 'produto', format: produtoFormat },
      { date: friday, weekdayLabel: WEEKDAY_LABEL[friday.getDay()], pillarId: 'musica-ao-vivo', format: 'Estático/Reels' },
      { date: sunday, weekdayLabel: WEEKDAY_LABEL[sunday.getDay()], pillarId: rotativePillar, format: 'Estático/Reels' },
    ]

    weeks.push({
      weekNumber,
      rotativePillars: [rotativePillar],
      start: monday,
      end: sunday,
      days,
    })
  }
  return weeks
}
