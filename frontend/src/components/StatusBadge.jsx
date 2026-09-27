import { statusLabels } from '../data/initialData'

export default function StatusBadge({ status }) {
  return <span className={`status status--${status.toLowerCase()}`}>{statusLabels[status]}</span>
}
