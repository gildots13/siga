export default function Logo({ compact = false, light = false }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''} ${light ? 'brand--light' : ''}`}>
      <div className="brand__mark" aria-hidden="true"><span /><span /><span /></div>
      {!compact && (
        <div className="brand__text">
          <strong>SIGA</strong>
          <small>Gestão de Atendimento</small>
        </div>
      )}
    </div>
  )
}
