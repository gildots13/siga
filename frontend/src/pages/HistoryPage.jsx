import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { useQueue } from '../hooks/useQueue'
import { statusLabels, ticketTypes } from '../data/initialData'
import { formatDateTime, formatDuration, minutesBetween } from '../utils/formatters'

export default function HistoryPage() {
  const { tickets, resetDemo } = useQueue()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('TODOS')
  const [status, setStatus] = useState('TODOS')
  const [sort, setSort] = useState('recentes')

  const filtered = useMemo(() => {
    const result = tickets.filter((ticket) => {
      const matchesQuery = ticket.code.toLowerCase().includes(query.toLowerCase()) ||
        ticket.attendant?.toLowerCase().includes(query.toLowerCase())
      return matchesQuery && (type === 'TODOS' || ticket.type === type) && (status === 'TODOS' || ticket.status === status)
    })
    return result.sort((a, b) => sort === 'antigas'
      ? new Date(a.emittedAt) - new Date(b.emittedAt)
      : new Date(b.emittedAt) - new Date(a.emittedAt))
  }, [tickets, query, type, status, sort])

  const clearFilters = () => { setQuery(''); setType('TODOS'); setStatus('TODOS'); setSort('recentes') }

  return (
    <div className="page">
      <PageHeader eyebrow="REGISTROS" title="Histórico de atendimentos" description="Consulte as senhas, os horários e o resultado de cada atendimento." />

      <section className="card filters-card">
        <div className="search-field"><Icon name="search" size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por senha ou atendente" aria-label="Buscar histórico" /></div>
        <label className="select-field"><span>Tipo</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="TODOS">Todos</option>{Object.entries(ticketTypes).map(([key, item]) => <option key={key} value={key}>{item.shortLabel}</option>)}</select></label>
        <label className="select-field"><span>Situação</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="TODOS">Todas</option>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        <label className="select-field"><span>Ordenar</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recentes">Mais recentes</option><option value="antigas">Mais antigas</option></select></label>
      </section>

      <section className="card card--table history-card">
        <div className="card__header">
          <div><h2>{filtered.length} {filtered.length === 1 ? 'registro encontrado' : 'registros encontrados'}</h2><p>Os dados permanecem salvos neste navegador.</p></div>
          <div className="header-buttons"><button className="button button--ghost button--small" type="button" onClick={clearFilters}>Limpar filtros</button><button className="button button--soft button--small" type="button" onClick={resetDemo}><Icon name="refresh" size={16} />Restaurar demonstração</button></div>
        </div>
        {filtered.length ? (
          <div className="table-wrap">
            <table className="history-table">
              <thead><tr><th>Senha</th><th>Tipo</th><th>Emissão</th><th>Guichê</th><th>Duração</th><th>Situação</th></tr></thead>
              <tbody>{filtered.map((ticket) => (
                <tr key={ticket.id}>
                  <td><strong className="ticket-code">{ticket.code}</strong></td>
                  <td>{ticketTypes[ticket.type].shortLabel}</td>
                  <td>{formatDateTime(ticket.emittedAt)}</td>
                  <td><span>{ticket.counter || '—'}</span>{ticket.attendant && <small className="table-subline">{ticket.attendant}</small>}</td>
                  <td>{ticket.startedAt ? formatDuration(minutesBetween(ticket.startedAt, ticket.finishedAt)) : '—'}</td>
                  <td><StatusBadge status={ticket.status} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <EmptyState title="Nenhum resultado" description="Tente remover algum filtro ou buscar por outro termo." />}
      </section>
    </div>
  )
}