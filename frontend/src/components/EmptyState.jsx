import Icon from './Icon'

export default function EmptyState({ icon = 'search', title, description }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon"><Icon name={icon} size={26} /></span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
