const pad = (value) => String(value).padStart(2, '0')

const datePrefix = (date) =>
  `${String(date.getFullYear()).slice(-2)}${pad(date.getMonth() + 1)}${pad(date.getDate())}`

const atToday = (hours, minutes) => {
  const value = new Date()
  value.setHours(hours, minutes, 0, 0)
  return value.toISOString()
}

export const ticketTypes = {
  SP: {
    label: 'Atendimento prioritário',
    shortLabel: 'Prioritário',
    description: 'Idosos, gestantes, PCD e demais prioridades previstas em lei.',
    estimatedMinutes: 8,
  },
  SG: {
    label: 'Atendimento geral',
    shortLabel: 'Geral',
    description: 'Cadastro, coleta agendada e orientações gerais.',
    estimatedMinutes: 14,
  },
  SE: {
    label: 'Entrega de resultados',
    shortLabel: 'Resultados',
    description: 'Retirada de laudos e resultados já liberados.',
    estimatedMinutes: 5,
  },
}

export const statusLabels = {
  AGUARDANDO: 'Aguardando',
  CHAMADA: 'Chamada',
  CHAMADA_NOVAMENTE: '2ª chamada',
  EM_ATENDIMENTO: 'Em atendimento',
  ATENDIDA: 'Atendida',
  NAO_COMPARECEU: 'Não compareceu',
}

export function createInitialTickets() {
  const prefix = datePrefix(new Date())

  return [
    {
      id: 'demo-sg-001', code: `${prefix}-SG001`, type: 'SG', sequence: 1,
      status: 'ATENDIDA', emittedAt: atToday(8, 4), calledAt: atToday(8, 14),
      startedAt: atToday(8, 16), finishedAt: atToday(8, 28), lastCalledAt: atToday(8, 14),
      counter: 'Guichê 01', attendant: 'Marina Costa', callAttempts: 1,
    },
    {
      id: 'demo-sp-001', code: `${prefix}-SP001`, type: 'SP', sequence: 1,
      status: 'ATENDIDA', emittedAt: atToday(8, 9), calledAt: atToday(8, 29),
      startedAt: atToday(8, 31), finishedAt: atToday(8, 42), lastCalledAt: atToday(8, 29),
      counter: 'Guichê 02', attendant: 'Lucas Almeida', callAttempts: 1,
    },
    {
      id: 'demo-se-001', code: `${prefix}-SE001`, type: 'SE', sequence: 1,
      status: 'NAO_COMPARECEU', emittedAt: atToday(8, 18), calledAt: atToday(8, 44),
      lastCalledAt: atToday(8, 47), finishedAt: atToday(8, 49), counter: 'Guichê 01',
      attendant: 'Marina Costa', callAttempts: 2,
    },
    {
      id: 'demo-sg-002', code: `${prefix}-SG002`, type: 'SG', sequence: 2,
      status: 'ATENDIDA', emittedAt: atToday(8, 23), calledAt: atToday(8, 51),
      startedAt: atToday(8, 52), finishedAt: atToday(9, 6), lastCalledAt: atToday(8, 51),
      counter: 'Guichê 02', attendant: 'Lucas Almeida', callAttempts: 1,
    },
    {
      id: 'demo-sp-002', code: `${prefix}-SP002`, type: 'SP', sequence: 2,
      status: 'EM_ATENDIMENTO', emittedAt: atToday(8, 34), calledAt: atToday(9, 8),
      startedAt: atToday(9, 10), finishedAt: null, lastCalledAt: atToday(9, 8),
      counter: 'Guichê 01', attendant: 'Marina Costa', callAttempts: 1,
    },
    {
      id: 'demo-se-002', code: `${prefix}-SE002`, type: 'SE', sequence: 2,
      status: 'CHAMADA', emittedAt: atToday(8, 49), calledAt: atToday(9, 12),
      lastCalledAt: atToday(9, 12), counter: 'Guichê 02', attendant: 'Lucas Almeida', callAttempts: 1,
    },
    {
      id: 'demo-sg-003', code: `${prefix}-SG003`, type: 'SG', sequence: 3,
      status: 'AGUARDANDO', emittedAt: atToday(8, 56), counter: null, attendant: null, callAttempts: 0,
    },
    {
      id: 'demo-sp-003', code: `${prefix}-SP003`, type: 'SP', sequence: 3,
      status: 'AGUARDANDO', emittedAt: atToday(9, 2), counter: null, attendant: null, callAttempts: 0,
    },
    {
      id: 'demo-sg-004', code: `${prefix}-SG004`, type: 'SG', sequence: 4,
      status: 'AGUARDANDO', emittedAt: atToday(9, 7), counter: null, attendant: null, callAttempts: 0,
    },
  ]
}
