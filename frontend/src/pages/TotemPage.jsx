import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Logo from '../components/Logo'
import { useQueue } from '../hooks/useQueue'
import { ticketTypes } from '../data/initialData'
import { formatTime } from '../utils/formatters'

export default function TotemPage() {
  const { tickets, issueTicket } = useQueue()
  const [issued, setIssued] = useState(null)

  const emit = (type) => {
    setIssued(issueTicket(type))
  }

  const closeModal = () => {
    setIssued(null)
  }

  const peopleAhead = issued
    ? tickets.filter(
        (ticket) =>
          ticket.status === 'AGUARDANDO' &&
          new Date(ticket.emittedAt) < new Date(issued.emittedAt)
      ).length
    : 0

  useEffect(() => {
    if (!issued) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [issued])

  return (
    <div className="kiosk-page">
      <header className="kiosk-header">
        <Logo />

        <div>
          <span className="online-dot" />
          Atendimento em funcionamento
        </div>
      </header>

      <main className="kiosk-main">
        <span className="eyebrow">
          BEM-VINDO AO LABORATÓRIO CENTRAL
        </span>

        <h1>Como podemos ajudar?</h1>

        <p>
          Selecione abaixo o tipo de atendimento que você precisa.
        </p>

        <section className="service-options">
          {Object.entries(ticketTypes).map(([type, info]) => (
            <button
              className={`service-option service-option--${type.toLowerCase()}`}
              type="button"
              key={type}
              onClick={() => emit(type)}
            >
              <span className="service-option__type">
                {type}
              </span>

              <span className="service-option__content">
                <strong>{info.label}</strong>
                <small>{info.description}</small>
              </span>

              <span className="service-option__arrow">
                <Icon name="arrowRight" />
              </span>
            </button>
          ))}
        </section>

        <div className="kiosk-help">
          <Icon name="headset" size={20} />

          <span>
            Precisa de ajuda? Procure um de nossos colaboradores.
          </span>
        </div>
      </main>

      <footer className="kiosk-footer">
        <span>
          Atendimento: segunda a sexta, das 7h às 17h
        </span>

        <Link to="/inicio">
          <Icon name="arrowLeft" size={16} />
          Voltar ao sistema
        </Link>
      </footer>

      {issued && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ticket-title"
          onClick={closeModal}
        >
          <div
            className="ticket-modal"
            onClick={(event) => event.stopPropagation()}
          >
          <button
            className="ticket-modal__close"
            type="button"
            aria-label="Fechar"
            onClick={closeModal}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 10,
            }}
        >
          <Icon name="close" size={20} />
        </button>

            <span className="ticket-modal__check">
              <Icon name="check" size={28} />
            </span>

            <h2 id="ticket-title">
              Senha emitida com sucesso
            </h2>

            <p>
              Acompanhe a chamada no painel e aguarde na recepção.
            </p>

            <div className="printed-ticket">
              <Logo compact />

              <span>
                {ticketTypes[issued.type].shortLabel}
              </span>

              <strong>
                {issued.code.split('-').slice(-1)}
              </strong>

              <small>
                {new Intl.DateTimeFormat('pt-BR').format(
                  new Date(issued.emittedAt)
                )}{' '}
                · {formatTime(issued.emittedAt)}
              </small>

              <i />

              <p>
                {peopleAhead}{' '}
                {peopleAhead === 1
                  ? 'pessoa à sua frente'
                  : 'pessoas à sua frente'}
              </p>
            </div>

            <div className="ticket-modal__actions">
              <button
                className="button button--soft"
                type="button"
                onClick={() => window.print()}
              >
                <Icon name="printer" size={18} />
                Imprimir
              </button>

              <button
                className="button button--primary"
                type="button"
                onClick={closeModal}
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}