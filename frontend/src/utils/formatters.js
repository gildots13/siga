export const formatTime = (date) => {
  if (!date) return '—'
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(date))
}

export const formatDate = (date) => {
  if (!date) return '—'
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

export const formatDateTime = (date) => {
  if (!date) return '—'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date))
}

export const minutesBetween = (start, end = new Date().toISOString()) => {
  if (!start) return 0
  return Math.max(0, Math.round((new Date(end) - new Date(start)) / 60000))
}

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours}h ${rest}min` : `${hours}h`
}

export const isToday = (date) => {
  if (!date) return false
  return new Date(date).toDateString() === new Date().toDateString()
}

export const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}
