import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { useQueue } from '../hooks/useQueue'
import { ticketTypes } from '../data/initialData'
import { formatDuration, formatTime, getGreeting, isToday, minutesBetween } from '../utils/formatters'

export default function DashboardPage() {
  const { tickets, profile } = useQueue()
  const todayTickets = tickets.filter((ticket) => isToday(ticket.emittedAt))
  const waiting = todayTickets.filter((ticket) => ticket.status === 'AGUARDANDO')
  const inService = todayTickets.filter((ticket) => ticket.status === 'EM_ATENDIMENTO')
  const completed = todayTickets.filter((ticket) => ticket.status === 'ATENDIDA')
  const completedDurations = completed
    .filter((ticket) => ticket.startedAt && ticket.finishedAt)
    .map((ticket) => minutesBetween(ticket.startedAt, ticket.finishedAt))
  const averageTime = completedDurations.length
    ? Math.round(completedDurations.reduce((sum, value) => sum + value, 0) / completedDurations.length)
    : 0
  const recent = [...todayTickets].sort((a, b) => new Date(b.emittedAt) - new Date(a.emittedAt)).slice(0, 6)
  const maxByType = Math.max(1, ...Object.keys(ticketTypes).map((type) => waiting.filter((ticket) => ticket.type === type).length))

  return (
    <div className="page">
      <PageHeader
        eyebrow="CENTRAL DE ATENDIMENTO"
        title={`${getGreeting()}${profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}`}
        description="Acompanhe o movimento da unidade e acesse rapidamente as operações do dia."
        actions={<span className="date-chip"><Icon name="clock" size={17} />{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date())}</span>}
      />

      <section className="stats-grid" aria-label="Indicadores do dia">
        <MetricCard icon="users" tone="blue" label="Aguardando" value={waiting.length} note="na fila agora" />
        <MetricCard icon="activity" tone="orange" label="Em atendimento" value={inService.length} note="em andamento" />
        <MetricCard icon="check" tone="green" label="Atendidos hoje" value={completed.length} note={`${todayTickets.length} senhas emitidas`} />
        <MetricCard icon="clock" tone="purple" label="Tempo médio" value={formatDuration(averageTime)} note="por atendimento" />
      </section>

      <section className="quick-actions">
        <Link className="quick-card quick-card--primary" to="/atendimento">
          <span className="quick-card__icon"><Icon name="headset" size={26} /></span>
          <div><strong>Iniciar atendimento</strong><span>Acessar terminal do atendente</span></div>
          <Icon name="arrowRight" />
        </Link>
        <Link className="quick-card" to="/totem">
          <span className="quick-card__icon"><Icon name="ticket" size={26} /></span>
          <div><strong>Abrir totem</strong><span>Emitir uma nova senha</span></div>
          <Icon name="arrowRight" />
        </Link>
        <Link className="quick-card" to="/painel">
          <span className="quick-card__icon"><Icon name="monitor" size={26} /></span>
          <div><strong>Abrir painel</strong><span>Exibir chamadas ao público</span></div>
          <Icon name="arrowRight" />
        </Link>
      </section>

      <section className="dashboard-grid">
        <div className="card card--table">
          <div className="card__header">
            <div><h2>Movimentação recente</h2><p>Últimas senhas registradas hoje</p></div>
            <Link to="/historico" className="text-link">Ver histórico <Icon name="chevronRight" size={16} /></Link>
          </div>
          {recent.length ? (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Senha</th><th>Serviço</th><th>Emissão</th><th>Situação</th></tr></thead>
                <tbody>
                  {recent.map((ticket) => (
                    <tr key={ticket.id}>
                      <td><strong className="ticket-code">{ticket.code.split('-').slice(-1)}</strong></td>
                      <td>{ticketTypes[ticket.type].shortLabel}</td>
                      <td>{formatTime(ticket.emittedAt)}</td>
                      <td><StatusBadge status={ticket.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState icon="ticket" title="Nenhuma senha hoje" description="As novas senhas aparecerão aqui." />}
        </div>

        <div className="card queue-card">
          <div className="card__header"><div><h2>Fila por serviço</h2><p>Distribuição das senhas aguardando</p></div></div>
          <div className="queue-bars">
            {Object.entries(ticketTypes).map(([type, info]) => {
              const count = waiting.filter((ticket) => ticket.type === type).length
              return (
                <div className="queue-bar" key={type}>
                  <div className="queue-bar__header"><span><i className={`type-dot type-dot--${type.toLowerCase()}`} />{info.shortLabel}</span><strong>{count}</strong></div>
                  <div className="queue-bar__track"><span className={`queue-bar__fill queue-bar__fill--${type.toLowerCase()}`} style={{ width: `${count ? Math.max(12, (count / maxByType) * 100) : 0}%` }} /></div>
                  <small>Estimativa: {count * info.estimatedMinutes} min</small>
                </div>
              )
            })}
          </div>
          <div className="queue-summary"><Icon name="activity" size={18} /><span>Fluxo da unidade</span><strong>{waiting.length <= 4 ? 'Normal' : waiting.length <= 8 ? 'Moderado' : 'Elevado'}</strong></div>
        </div>
      </section>
    </div>
  )
}

function MetricCard({ icon, tone, label, value, note }) {
  return (
    <article className="metric-card">
      <span className={`metric-card__icon metric-card__icon--${tone}`}><Icon name={icon} size={23} /></span>
      <div><span className="metric-card__label">{label}</span><strong>{value}</strong><small>{note}</small></div>
    </article>
  )
}
