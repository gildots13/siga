import { useEffect, useState } from 'react'
import { createInitialTickets } from '../data/initialData'
import { isToday } from '../utils/formatters'
import { QueueContext } from './queue-context'

const STORAGE_KEY = 'siga:tickets:v1'
const PROFILE_KEY = 'siga:attendant-profile:v1'

const getStoredTickets = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(stored) && stored.length) return stored
  } catch {
    // Dados inválidos são substituídos pela base local de demonstração.
  }
  return createInitialTickets()
}

const getStoredProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null
  } catch {
    return null
  }
}

const getDatePrefix = () => {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${String(date.getFullYear()).slice(-2)}${month}${day}`
}

export function QueueProvider({ children }) {
  const [tickets, setTickets] = useState(getStoredTickets)
  const [profile, setProfile] = useState(getStoredProfile)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
  }, [tickets])

  useEffect(() => {
    if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    else localStorage.removeItem(PROFILE_KEY)
  }, [profile])

  useEffect(() => {
    const syncStorage = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) setTickets(JSON.parse(event.newValue))
      if (event.key === PROFILE_KEY) setProfile(event.newValue ? JSON.parse(event.newValue) : null)
    }
    window.addEventListener('storage', syncStorage)
    return () => window.removeEventListener('storage', syncStorage)
  }, [])

  const showNotice = (message, tone = 'success') => {
    setNotice({ message, tone, id: Date.now() })
  }

  const issueTicket = (type) => {
    const todayTickets = tickets.filter((ticket) => ticket.type === type && isToday(ticket.emittedAt))
    const sequence = Math.max(0, ...todayTickets.map((ticket) => ticket.sequence || 0)) + 1
    const ticket = {
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${type}`,
      code: `${getDatePrefix()}-${type}${String(sequence).padStart(3, '0')}`,
      type,
      sequence,
      status: 'AGUARDANDO',
      emittedAt: new Date().toISOString(),
      calledAt: null,
      startedAt: null,
      finishedAt: null,
      lastCalledAt: null,
      counter: null,
      attendant: null,
      callAttempts: 0,
    }
    setTickets((current) => [...current, ticket])
    return ticket
  }

  const updateTicket = (id, changes) => {
    setTickets((current) => current.map((ticket) => (ticket.id === id ? { ...ticket, ...changes } : ticket)))
  }

  const callNext = () => {
    if (!profile) return null
    const waiting = tickets
      .filter((ticket) => ticket.status === 'AGUARDANDO')
      .sort((a, b) => new Date(a.emittedAt) - new Date(b.emittedAt))

    if (!waiting.length) return null

    const lastCalled = [...tickets]
      .filter((ticket) => ticket.lastCalledAt)
      .sort((a, b) => new Date(b.lastCalledAt) - new Date(a.lastCalledAt))[0]
    const preferredPool = lastCalled?.type === 'SP'
      ? waiting.filter((ticket) => ticket.type !== 'SP')
      : waiting.filter((ticket) => ticket.type === 'SP')
    const next = preferredPool[0] || waiting[0]
    const now = new Date().toISOString()

    updateTicket(next.id, {
      status: 'CHAMADA',
      calledAt: now,
      lastCalledAt: now,
      counter: profile.counter,
      attendant: profile.name,
      callAttempts: 1,
    })
    showNotice(`Senha ${next.code} chamada com sucesso.`)
    return next
  }

  const recallTicket = (id) => {
    const now = new Date().toISOString()
    updateTicket(id, { status: 'CHAMADA_NOVAMENTE', lastCalledAt: now, callAttempts: 2 })
    showNotice('Segunda chamada realizada.')
  }

  const startService = (id) => {
    updateTicket(id, { status: 'EM_ATENDIMENTO', startedAt: new Date().toISOString() })
    showNotice('Atendimento iniciado.')
  }

  const finishService = (id) => {
    updateTicket(id, { status: 'ATENDIDA', finishedAt: new Date().toISOString() })
    showNotice('Atendimento finalizado.')
  }

  const markNoShow = (id) => {
    updateTicket(id, { status: 'NAO_COMPARECEU', finishedAt: new Date().toISOString() })
    showNotice('Ausência registrada.', 'warning')
  }

  const saveProfile = (newProfile) => {
    setProfile(newProfile)
    showNotice('Posto de atendimento configurado.')
  }

  const resetDemo = () => {
    setTickets(createInitialTickets())
    showNotice('Dados de demonstração restaurados.')
  }

  const value = {
    tickets, profile, notice, setNotice, issueTicket, callNext, recallTicket,
    startService, finishService, markNoShow, saveProfile, resetDemo,
  }

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
}
