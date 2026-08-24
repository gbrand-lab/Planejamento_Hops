import { buildCalendar } from './calendar.js'

// ---- Captação ----
// Relatório mensal: uma única captação (unidade única), dividida por tipo de
// conteúdo. As quantidades vêm direto da contagem real de posts do
// calendário de feed do mês de referência, não são estimativa solta.

const CAPTURE_MONTH = { year: 2026, monthIndex: 8, label: 'Setembro 2026' } // monthIndex 8 = setembro

// Registros (fotos/vídeos) necessários por post, por pilar. Feed nunca
// reaproveita material entre posts, cada post exige captação própria.
const FEED_RECORDS_PER_POST = {
  produto: 8, // 6 ângulos + consumo + ambiente
  experiencia: 4, // 2 horários × ~2 registros
  bastidores: 4,
  institucional: 3,
  gastronomia: 4,
  educacional: 3,
}

const PILLAR_LABELS = {
  produto: 'Produto',
  experiencia: 'Experiência / Ambiente',
  bastidores: 'Rotativo, Bastidores / Equipe',
  institucional: 'Rotativo, Institucional / Casa',
  gastronomia: 'Rotativo, Gastronomia',
  educacional: 'Rotativo, Educacional de Cerveja',
}

export function buildCaptureReport() {
  const { year, monthIndex, label } = CAPTURE_MONTH

  const weeks = buildCalendar()
  const allDays = weeks.flatMap((w) => w.days)
  const monthDays = allDays.filter((d) => d.date.getFullYear() === year && d.date.getMonth() === monthIndex)

  // Cada segunda (fixado) do mês, com os pilares rotativos daquela semana pra dar contexto.
  const fixadoDetails = weeks
    .filter((w) => w.start.getFullYear() === year && w.start.getMonth() === monthIndex)
    .map((w) => ({ date: w.start, rotativePillars: w.rotativePillars }))

  const feedCount = {}
  for (const d of monthDays) {
    feedCount[d.pillarId] = (feedCount[d.pillarId] || 0) + 1
  }

  const feedRows = Object.keys(PILLAR_LABELS)
    .map((pillarId) => ({ pillarId, label: PILLAR_LABELS[pillarId], posts: feedCount[pillarId] || 0 }))
    .filter((r) => r.posts > 0)
    .map((r) => ({ ...r, records: r.posts * FEED_RECORDS_PER_POST[r.pillarId] }))

  const fixadoPosts = feedCount.fixado || 0
  const fixadoRecords = fixadoPosts * 2 // até 2 registros/post, só se houver elemento visual

  // Sessão noturna: feed só pode ser captado durante o evento de música ao
  // vivo de sexta, fora da visita diurna padrão.
  const musicaPosts = feedCount['musica-ao-vivo'] || 0
  const nightRows = [
    {
      label: 'Feed, Música ao vivo (aviso)',
      qty: `${musicaPosts} posts no mês`,
      records: musicaPosts * 2,
      note: 'foto/vídeo de palco + banda tocando, captado durante o evento de sexta à noite, não na visita diurna',
    },
  ]

  const sum = (rows) => rows.reduce((acc, r) => acc + r.records, 0)
  const feedTotal = sum(feedRows)
  const nightTotal = sum(nightRows)
  const total = feedTotal + fixadoRecords + nightTotal

  return {
    monthLabel: label,
    totals: { feed: feedTotal, fixado: fixadoRecords, night: nightTotal, month: total },
    feed: feedRows,
    fixado: { posts: fixadoPosts, records: fixadoRecords, weeks: fixadoDetails },
    night: nightRows,
  }
}

export const captureChecklist = [
  {
    id: 'produto',
    title: 'Produto',
    items: [
      '2 rótulos/chopps selecionados na visita, sempre itens diferentes dos já postados nas visitas/posts anteriores',
      'Por item: 6 ângulos de produto + 1 foto de consumo + 1 foto de ambiente',
      'Preto e dourado da marca sempre presentes em algum elemento do enquadramento ou da arte final',
    ],
  },
  {
    id: 'rotativo',
    title: 'Rotativo, pilar do domingo',
    items: [
      'Experiência: sempre gente na cena, mesa servida, nunca ambiente vazio; cobrir 2 horários (dia e golden hour/noite)',
      'Bastidores: personagem fixo (garçom/bartender recorrente) + mestre-cervejeiro em preparo/produção',
      'Institucional: fachada de dia e à noite (letreiro aceso), referência de localização clara',
      'Gastronomia: prato pronto + 1 foto de detalhe + 1 foto da dupla prato+chopp',
      'Educacional: pode reaproveitar banco de fotos de Produto, foco é o texto/carrossel, baixo custo de captação extra',
    ],
  },
  {
    id: 'musica',
    title: 'Música ao vivo, aviso',
    items: [
      'Foto/vídeo de palco + banda tocando, captação única durante o evento',
      'Post fixo de aviso toda sexta',
      'Precisa ser feito durante o evento à noite, não na visita diurna de captação',
    ],
  },
  {
    id: 'fixado',
    title: 'Programação da semana (fixado)',
    items: [
      '1 sessão de captação por segunda-feira do mês, não é uma cota fixa genérica, é uma sessão por publicação real',
      'Post é feed, então segue a mesma regra de material exclusivo: não reaproveitar foto de Produto ou do Rotativo da mesma semana',
      'Se não houver elemento visual pra aquela semana (sem line-up, sem cartaz, sem lançamento), o post sai só como arte com a agenda, sem necessidade de captação',
      'Agenda da semana precisa estar fechada com antecedência pra dar tempo de produzir a arte antes da segunda',
    ],
  },
]
