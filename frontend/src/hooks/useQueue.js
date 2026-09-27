import { useContext } from 'react'
import { QueueContext } from '../context/queue-context'

export function useQueue() {
  const context = useContext(QueueContext)
  if (!context) throw new Error('useQueue deve ser usado dentro de QueueProvider')
  return context
}
