import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Logo from '../components/Logo'
import { useQueue } from '../hooks/useQueue'
import { ticketTypes } from '../data/initialData'
import { formatTime } from '../utils/formatters'

export default function PanelPage() {
  const { tickets } = useQueue()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const calls = [...tickets]
    .filter((ticket) => ticket.lastCalledAt)
    .sort((a, b) => new Date(b.lastCalledAt) - new Date(a.lastCalledAt))
  const current = calls.find((ticket) => ['CHAMADA', 'CHAMADA_NOVAMENTE'].includes(ticket.status)) || calls[0]
  const previous = calls.filter((ticket) => ticket.id !== current?.id).slice(0, 5)

  const enterFullscreen = () => document.documentElement.requestFullscreen?.()

  return (
    <div className="public-panel">
      <header className="public-panel__header">
        <Logo light />
        <div className="public-panel__clock"><span>{new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(now)}</span><strong>{new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(now)}</strong></div>
        <button className="panel-icon-button" type="button" onClick={enterFullscreen} aria-label="Tela cheia"><Icon name="maximize" /></button>
      </header>

      <main className="public-panel__body">
        <section className="current-call-panel">
          <span className="call-eyebrow"><i /> SENHA CHAMADA</span>
          {current ? (
            <>
              <span className="current-call-panel__type">{ticketTypes[current.type].label}</span>
              <strong className="current-call-panel__code">{current.code.split('-').slice(-1)}</strong>
              <div className="counter-display"><span>Dirija-se ao</span><strong>{current.counter || 'Recepção'}</strong></div>
              {current.status === 'CHAMADA_NOVAMENTE' && <span className="second-call"><Icon name="bell" size={18} />Segunda chamada</span>}
            </>
          ) : (
            <div className="panel-waiting"><Icon name="monitor" size={48} /><h1>Aguardando chamadas</h1><p>As próximas senhas aparecerão aqui.</p></div>
          )}
        </section>

        <section className="previous-calls">
          <div className="previous-calls__header"><h2>Últimas chamadas</h2><span>Senha <b>Guichê</b></span></div>
          <div className="previous-calls__list">
            {previous.length ? previous.map((ticket) => (
              <article key={ticket.id}>
                <div><strong>{ticket.code.split('-').slice(-1)}</strong><span>{ticketTypes[ticket.type].shortLabel} · {formatTime(ticket.lastCalledAt)}</span></div>
                <b>{ticket.counter?.replace('Guichê ', '') || '—'}</b>
              </article>
            )) : <p className="panel-empty">Nenhuma chamada anterior.</p>}
          </div>
          <div className="panel-guidance"><Icon name="bell" size={20} /><span>Aguarde sua senha aparecer no painel. Tenha seus documentos em mãos.</span></div>
        </section>
      </main>

      <footer className="public-panel__footer"><span>Laboratório Central · Cuidando de você com eficiência</span><Link to="/inicio"><Icon name="arrowLeft" size={16} />Voltar ao sistema</Link></footer>
    </div>
  )
}
