// 6 posts por semana, em 5 dias. Segunda é só o fixado com a agenda da semana.
// Terça e sexta têm um post complementar que gira entre os pilares de conteúdo
// (TUESDAY_BONUS_ORDER / FRIDAY_BONUS_ORDER), pra dar mais volume sem repetir
// sempre o mesmo assunto; a sexta ainda leva o aviso de Música ao vivo,
// amarrado ao evento real da noite, então é o único dia com 2 posts. Cada
// semana o complementar de terça, o de sexta e o pilar rotativo caem em
// pilares diferentes entre si. Quarta e domingo alternam ENTRE si
// a cada semana: numa semana Produto entra na quarta e o pilar Rotativo no
// domingo; na semana seguinte é o contrário — Rotativo na quarta e Produto
// no domingo. Assim Produto continua entrando toda semana, mas não fica
// sempre no mesmo dia, e a ordem de postagem varia semana a semana.
//
// O pilar rotativo em si (Experiência/Bastidores/Institucional/Gastronomia/
// Educacional) passa por 5 pilares, mas em vez de repetir sempre a
// mesma ordem a cada 5 semanas (o que faz o padrão ficar previsível ao
// longo dos meses), alternamos entre variações de ordem: cada "volta" de
// 5 semanas usa uma sequência diferente das anteriores. Quando as
// variações abaixo se esgotam, volta pra primeira — mas isso só aconteceria
// depois de 15 semanas (~3,5 meses) de calendário.
// Cada variante termina num pilar diferente do pilar que abre a próxima
// (e a última termina diferente do que abre a primeira, pro caso de dar
// a volta), pra nunca repetir o mesmo pilar em domingos consecutivos na
// transição entre uma volta e a próxima.
const ROTATIVE_ORDER_VARIANTS = [
  ['experiencia', 'bastidores', 'institucional', 'gastronomia', 'educacional'],
  ['gastronomia', 'educacional', 'bastidores', 'experiencia', 'institucional'],
  ['educacional', 'gastronomia', 'experiencia', 'institucional', 'bastidores'],
]

// Posts complementares de terça e sexta: cada um gira entre os pilares de
// conteúdo numa ordem própria, defasada do pilar rotativo da semana e um do
// outro, pra não cair o mesmo assunto duas vezes na mesma semana. Se ainda
// assim coincidir, pula pro próximo pilar da lista.
const TUESDAY_BONUS_ORDER = ['educacional', 'institucional', 'experiencia', 'bastidores', 'gastronomia']
const FRIDAY_BONUS_ORDER = ['gastronomia', 'experiencia', 'institucional', 'educacional', 'bastidores']

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
    const tuesday = addDays(monday, 1)
    const wednesday = addDays(monday, 2)
    const friday = addDays(monday, 4)
    const sunday = addDays(monday, 6)
    const cycleLength = ROTATIVE_ORDER_VARIANTS[0].length
    const variant = ROTATIVE_ORDER_VARIANTS[Math.floor(w / cycleLength) % ROTATIVE_ORDER_VARIANTS.length]
    const rotativePillar = variant[w % cycleLength]
    const produtoFormat = weekNumber % 2 === 1 ? 'Estático' : 'Reels'
    const isOddWeek = weekNumber % 2 === 1

    let tuesdayBonusPillar = TUESDAY_BONUS_ORDER[w % TUESDAY_BONUS_ORDER.length]
    for (let bump = 1; tuesdayBonusPillar === rotativePillar && bump < TUESDAY_BONUS_ORDER.length; bump++) {
      tuesdayBonusPillar = TUESDAY_BONUS_ORDER[(w + bump) % TUESDAY_BONUS_ORDER.length]
    }

    let fridayBonusPillar = FRIDAY_BONUS_ORDER[w % FRIDAY_BONUS_ORDER.length]
    for (
      let bump = 1;
      (fridayBonusPillar === rotativePillar || fridayBonusPillar === tuesdayBonusPillar) &&
      bump < FRIDAY_BONUS_ORDER.length;
      bump++
    ) {
      fridayBonusPillar = FRIDAY_BONUS_ORDER[(w + bump) % FRIDAY_BONUS_ORDER.length]
    }

    const wednesdaySlot = isOddWeek
      ? { pillarId: 'produto', format: produtoFormat }
      : { pillarId: rotativePillar, format: 'Estático/Reels' }
    const sundaySlot = isOddWeek
      ? { pillarId: rotativePillar, format: 'Estático/Reels' }
      : { pillarId: 'produto', format: produtoFormat }

    const days = [
      { date: monday, weekdayLabel: WEEKDAY_LABEL[monday.getDay()], pillarId: 'fixado', format: 'Estático · Fixado' },
      { date: tuesday, weekdayLabel: WEEKDAY_LABEL[tuesday.getDay()], pillarId: tuesdayBonusPillar, format: 'Complementar · Estático/Reels' },
      { date: wednesday, weekdayLabel: WEEKDAY_LABEL[wednesday.getDay()], ...wednesdaySlot },
      { date: friday, weekdayLabel: WEEKDAY_LABEL[friday.getDay()], pillarId: 'musica-ao-vivo', format: 'Estático/Reels' },
      { date: friday, weekdayLabel: WEEKDAY_LABEL[friday.getDay()], pillarId: fridayBonusPillar, format: 'Complementar · Estático/Reels' },
      { date: sunday, weekdayLabel: WEEKDAY_LABEL[sunday.getDay()], ...sundaySlot },
    ]

    weeks.push({
      weekNumber,
      rotativePillars: [rotativePillar],
      tuesdayBonusPillar,
      fridayBonusPillar,
      start: monday,
      end: sunday,
      days,
    })
  }
  return weeks
}
