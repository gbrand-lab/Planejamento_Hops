import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildCalendar } from '../../data/index.js'
import { apiUrl } from '../../api.js'
import MonthGrid from './MonthGrid.jsx'
import PostDrawer, { CLIENTE } from './PostDrawer.jsx'

// Cada semana só tem 1 post por dia (segunda/quarta/sexta/domingo), mas
// mantemos o agrupamento por número do dia pra caber posts extras no futuro.
function groupByDay(entries) {
  const map = new Map()
  for (const entry of entries) {
    const day = entry.date.getDate()
    if (!map.has(day)) map.set(day, [])
    map.get(day).push(entry)
  }
  return map
}

export default function FeedCalendarTab() {
  const weeks = buildCalendar()
  const allDays = weeks.flatMap((w) => w.days)
  const byDaySept = groupByDay(allDays.filter((d) => d.date.getMonth() === 8))
  const byDayOct = groupByDay(allDays.filter((d) => d.date.getMonth() === 9))

  const [posts, setPosts] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [error, setError] = useState(null)

  const loadPosts = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/posts'))
      if (!res.ok) throw new Error('Falha ao carregar os posts.')
      const data = await res.json()
      setPosts(data.filter((p) => p.cliente === CLIENTE))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar posts.')
    }
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const postsByDate = useMemo(() => {
    const map = new Map()
    for (const post of posts) {
      if (!map.has(post.data)) map.set(post.data, [])
      map.get(post.data).push(post)
    }
    return map
  }, [posts])

  const postsDoDia = selectedDate ? postsByDate.get(selectedDate) ?? [] : []

  async function handleCreate(input) {
    setError(null)
    try {
      const res = await fetch(apiUrl('/api/posts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Falha ao criar o post.')
      }
      const created = await res.json()
      setPosts((prev) => [...prev, created])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao criar post.')
      throw err
    }
  }

  async function handleUpdate(id, input) {
    setError(null)
    try {
      const res = await fetch(apiUrl(`/api/posts/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Falha ao atualizar o post.')
      }
      const updated = await res.json()
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao atualizar post.')
      throw err
    }
  }

  async function handleDelete(id) {
    setError(null)
    try {
      const res = await fetch(apiUrl(`/api/posts/${id}`), { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Falha ao excluir o post.')
      }
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao excluir post.')
    }
  }

  return (
    <div className="panel">
      <div className="calendar-head">
        <h2>Calendário de postagens</h2>
        <div className="legend">
          <span className="legend-item"><i className="dot dot--fixo" />Fixo (Produto/Música)</span>
          <span className="legend-item"><i className="dot dot--rotativo" />Rotativo</span>
          <span className="legend-item"><i className="dot dot--fixado" />Fixado (segunda)</span>
        </div>
      </div>
      <p className="section-desc">
        Cadência fixa de 4 posts por semana, sempre nos mesmos dias: segunda (fixado), quarta (Produto),
        sexta (Música ao vivo) e domingo (Rotativo). Sem alternância de padrão, mesma estrutura toda
        semana.
      </p>
      <p className="section-desc">
        O pilar rotativo de domingo (Experiência → Bastidores → Institucional → Gastronomia →
        Educacional) segue um ciclo de 5 semanas, contínuo entre setembro e outubro, ponto de partida
        proposto, ajustável conforme a agenda real.
      </p>
      <p className="section-desc">
        Clique em qualquer dia para subir a foto do post com a legenda.
      </p>

      {error && <div className="banner-error">{error}</div>}

      <div className="months-stack">
        <MonthGrid year={2026} monthIndex={8} byDay={byDaySept} postsByDate={postsByDate} onSelectDate={setSelectedDate} />
        <MonthGrid year={2026} monthIndex={9} byDay={byDayOct} postsByDate={postsByDate} onSelectDate={setSelectedDate} />
      </div>

      {selectedDate && (
        <PostDrawer
          date={selectedDate}
          posts={postsDoDia}
          onClose={() => setSelectedDate(null)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
