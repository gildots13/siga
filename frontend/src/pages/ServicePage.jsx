import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { useQueue } from '../hooks/useQueue'
import { ticketTypes } from '../data/initialData'
import {
  formatDuration,
  formatTime,
  minutesBetween,
  isToday,
} from '../utils/formatters'

export default function ServicePage() {
  const {
    tickets,
    profile,
    callNext,
    recallTicket,
    startService,
    finishService,
    markNoShow,
    saveProfile,
  } = useQueue()

  const [showSetup, setShowSetup] = useState(!profile)
  const [name, setName] = useState(profile?.name || '')
  const [counter, setCounter] = useState(profile?.counter || '')
  const [formError, setFormError] = useState('')
  const [queueType, setQueueType] = useState('TODOS')

  const activeTicket = useMemo(() => {
    if (!profile) return null

    return (
      [...tickets]
        .filter(
          (ticket) =>
            ticket.attendant === profile.name &&
            ticket.counter === profile.counter &&
            isToday(ticket.emittedAt) &&
            ['CHAMADA', 'CHAMADA_NOVAMENTE', 'EM_ATENDIMENTO'].includes(
              ticket.status
            )
        )
        .sort(
          (a, b) =>
            new Date(b.lastCalledAt || b.startedAt) -
            new Date(a.lastCalledAt || a.startedAt)
        )[0] || null
    )
  }, [tickets, profile])

  const waiting = tickets
    .filter(
      (ticket) =>
        ticket.status === 'AGUARDANDO' &&
        isToday(ticket.emittedAt) &&
        (queueType === 'TODOS' || ticket.type === queueType)
    )
    .sort(
      (a, b) =>
        new Date(a.emittedAt) - new Date(b.emittedAt)
    )

  const totalWaitingCount = tickets.filter(
    (ticket) =>
      ticket.status === 'AGUARDANDO' &&
      isToday(ticket.emittedAt)
  ).length

  const submitProfile = (event) => {
    event.preventDefault()

    if (name.trim().length < 3) {
      setFormError(
        'Informe o nome do atendente com pelo menos 3 caracteres.'
      )
      return
    }

    if (!counter) {
      setFormError('Selecione o guichê de atendimento.')
      return
    }

    saveProfile({
      name: name.trim(),
      counter,
    })

    setFormError('')
    setShowSetup(false)
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="OPERAÇÃO"
        title="Terminal do atendente"
        description={
          profile
            ? `${profile.name} · ${profile.counter}`
            : 'Configure o posto para começar a atender.'
        }
        actions={
          <button
            className="button button--ghost"
            type="button"
            onClick={() => setShowSetup(true)}
          >
            <Icon name="settings" size={17} />
            Configurar posto
          </button>
        }
      />

      {showSetup && (
        <section className="setup-card card">
          <button
            className="setup-card__close"
            type="button"
            aria-label="Fechar configuração"
            onClick={() => profile && setShowSetup(false)}
            disabled={!profile}
          >
            <Icon name="close" />
          </button>

          <div className="setup-card__intro">
            <span>
              <Icon name="user" size={25} />
            </span>

            <div>
              <h2>Identificação do posto</h2>
              <p>
                Esses dados serão associados aos atendimentos realizados neste
                navegador.
              </p>
            </div>
          </div>

          <form
            className="setup-form"
            onSubmit={submitProfile}
            noValidate
          >
            <label>
              <span>Nome do atendente *</span>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: Ana Souza"
                autoFocus
              />
            </label>

            <label>
              <span>Guichê *</span>

              <select
                value={counter}
                onChange={(event) => setCounter(event.target.value)}
              >
                <option value="">
                  Selecione
                </option>

                {[
                  'Guichê 01',
                  'Guichê 02',
                  'Guichê 03',
                  'Guichê 04',
                ].map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="button button--primary"
              type="submit"
            >
              Salvar e continuar
            </button>
          </form>

          {formError && (
            <p
              className="form-error"
              role="alert"
            >
              <Icon name="alert" size={17} />
              {formError}
            </p>
          )}
        </section>
      )}

      {!showSetup && profile && (
        <>
          <section className="service-grid">
            <div className="card active-service">
              <div className="card__header">
                <div>
                  <h2>Atendimento atual</h2>
                  <p>Controle da senha vinculada ao seu guichê</p>
                </div>

                {activeTicket && (
                  <StatusBadge status={activeTicket.status} />
                )}
              </div>

              {activeTicket ? (
                <div className="current-ticket">
                  <span
                    className={`ticket-type-tag ticket-type-tag--${activeTicket.type.toLowerCase()}`}
                  >
                    {ticketTypes[activeTicket.type].label}
                  </span>

                  <strong className="current-ticket__code">
                    {activeTicket.code.split('-').slice(-1)}
                  </strong>

                  <div className="current-ticket__meta">
                    <span>
                      <small>Emitida às</small>
                      <strong>
                        {formatTime(activeTicket.emittedAt)}
                      </strong>
                    </span>

                    <span>
                      <small>Tempo de espera</small>
                      <strong>
                        {formatDuration(
                          minutesBetween(
                            activeTicket.emittedAt,
                            activeTicket.calledAt || undefined
                          )
                        )}
                      </strong>
                    </span>

                    <span>
                      <small>Chamadas</small>
                      <strong>
                        {activeTicket.callAttempts || 0}
                      </strong>
                    </span>
                  </div>

                  <div className="service-actions">
                    {activeTicket.status === 'CHAMADA' && (
                      <button
                        className="button button--soft"
                        type="button"
                        onClick={() =>
                          recallTicket(activeTicket.id)
                        }
                      >
                        <Icon name="rotate" size={18} />
                        Chamar novamente
                      </button>
                    )}

                    {[
                      'CHAMADA',
                      'CHAMADA_NOVAMENTE',
                    ].includes(activeTicket.status) && (
                      <button
                        className="button button--primary"
                        type="button"
                        onClick={() =>
                          startService(activeTicket.id)
                        }
                      >
                        <Icon name="play" size={18} />
                        Iniciar atendimento
                      </button>
                    )}

                    {activeTicket.status ===
                      'CHAMADA_NOVAMENTE' && (
                      <button
                        className="button button--danger-soft"
                        type="button"
                        onClick={() =>
                          markNoShow(activeTicket.id)
                        }
                      >
                        Não compareceu
                      </button>
                    )}

                    {activeTicket.status ===
                      'EM_ATENDIMENTO' && (
                      <button
                        className="button button--primary button--wide"
                        type="button"
                        onClick={() =>
                          finishService(activeTicket.id)
                        }
                      >
                        <Icon name="check" size={18} />
                        Finalizar atendimento
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="ready-state">
                  <span>
                    <Icon name="headset" size={34} />
                  </span>

                  <h3>Posto disponível</h3>

                  <p>
                    Você pode chamar a próxima pessoa da fila.
                  </p>

                  <button
                    className="button button--primary button--large"
                    type="button"
                    disabled={!totalWaitingCount}
                    onClick={callNext}
                  >
                    <Icon name="phone" size={20} />

                    {totalWaitingCount
                      ? 'Chamar próxima senha'
                      : 'Fila sem senhas'}
                  </button>
                </div>
              )}
            </div>

            <aside className="card queue-summary-card">
              <div className="card__header">
                <div>
                  <h2>Resumo da fila</h2>
                  <p>Senhas aguardando agora</p>
                </div>

                <strong className="queue-total">
                  {totalWaitingCount}
                </strong>
              </div>

              <div className="queue-counts">
                {Object.entries(ticketTypes).map(
                  ([type, info]) => {
                    const count = tickets.filter(
                      (ticket) =>
                        ticket.status === 'AGUARDANDO' &&
                        ticket.type === type &&
                        isToday(ticket.emittedAt)
                    ).length

                    return (
                      <div key={type}>
                        <span>
                          <i
                            className={`type-dot type-dot--${type.toLowerCase()}`}
                          />
                          {info.shortLabel}
                        </span>

                        <strong>
                          {count}
                        </strong>
                      </div>
                    )
                  }
                )}
              </div>

              <div className="rule-note">
                <Icon name="activity" size={19} />

                <p>
                  <strong>
                    Ordem de chamada
                  </strong>

                  <span>
                    O sistema alterna senhas prioritárias com as demais por
                    ordem de emissão.
                  </span>
                </p>
              </div>
            </aside>
          </section>

          <section className="card queue-table-card">
            <div className="card__header">
              <div>
                <h2>Fila de espera</h2>
                <p>Acompanhe as próximas senhas</p>
              </div>

              <div
                className="segmented-control"
                aria-label="Filtrar fila"
              >
                {['TODOS', 'SP', 'SG', 'SE'].map(
                  (item) => (
                    <button
                      type="button"
                      key={item}
                      className={
                        queueType === item ? 'active' : ''
                      }
                      onClick={() =>
                        setQueueType(item)
                      }
                    >
                      {item === 'TODOS'
                        ? 'Todas'
                        : item}
                    </button>
                  )
                )}
              </div>
            </div>

            {waiting.length ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Posição</th>
                      <th>Senha</th>
                      <th>Serviço</th>
                      <th>Emissão</th>
                      <th>Espera</th>
                    </tr>
                  </thead>

                  <tbody>
                    {waiting.map(
                      (ticket, index) => (
                        <tr key={ticket.id}>
                          <td>
                            <span className="position-number">
                              {index + 1}
                            </span>
                          </td>

                          <td>
                            <strong className="ticket-code">
                              {ticket.code
                                .split('-')
                                .slice(-1)}
                            </strong>
                          </td>

                          <td>
                            {
                              ticketTypes[
                                ticket.type
                              ].label
                            }
                          </td>

                          <td>
                            {formatTime(
                              ticket.emittedAt
                            )}
                          </td>

                          <td>
                            {formatDuration(
                              minutesBetween(
                                ticket.emittedAt
                              )
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon="check"
                title="Fila em dia"
                description="Não há senhas aguardando neste filtro."
              />
            )}
          </section>
        </>
      )}
    </div>
  )
}