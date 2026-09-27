import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useQueue } from '../hooks/useQueue'
import Icon from './Icon'
import Logo from './Logo'

const navigation = [
  { to: '/inicio', label: 'Visão geral', icon: 'home' },
  { to: '/atendimento', label: 'Atendimento', icon: 'headset' },
  { to: '/historico', label: 'Histórico', icon: 'history' },
]

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { profile, notice, setNotice } = useQueue()

  useEffect(() => {
    if (!notice) return undefined
    const timeout = setTimeout(() => setNotice(null), 3500)
    return () => clearTimeout(timeout)
  }, [notice, setNotice])

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand"><Logo light /></div>
        <nav className="sidebar__nav" aria-label="Navegação principal">
          <span className="sidebar__label">OPERAÇÃO</span>
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-item nav-item--active' : 'nav-item'}>
              <Icon name={item.icon} size={19} /><span>{item.label}</span>
            </NavLink>
          ))}
          <span className="sidebar__label sidebar__label--views">TELAS EXTERNAS</span>
          <NavLink to="/totem" className="nav-item" onClick={() => setMenuOpen(false)}><Icon name="ticket" size={19} /><span>Totem de senhas</span></NavLink>
          <NavLink to="/painel" className="nav-item" onClick={() => setMenuOpen(false)}><Icon name="monitor" size={19} /><span>Painel público</span></NavLink>
        </nav>
        <div className="sidebar__footer">
          <span className="system-online"><i /> Sistema operacional</span>
          <small>AV1 · Dados locais</small>
        </div>
      </aside>

      {menuOpen && <button className="sidebar-overlay" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}

      <div className="app-content">
        <header className="topbar">
          <button className="icon-button topbar__menu" type="button" aria-label="Abrir menu" onClick={() => setMenuOpen(true)}>
            <Icon name="menu" />
          </button>
          <div className="topbar__context"><span>Unidade</span><strong>Laboratório Central</strong></div>
          <div className="topbar__actions">
            <button className="icon-button notification-button" type="button" aria-label="Notificações"><Icon name="bell" /><i /></button>
            <div className="profile-chip">
              <span className="avatar">{profile?.name?.charAt(0).toUpperCase() || 'A'}</span>
              <div><strong>{profile?.name || 'Atendente'}</strong><small>{profile?.counter || 'Posto não configurado'}</small></div>
            </div>
          </div>
        </header>
        <main className="main-content"><Outlet /></main>
      </div>

      {notice && (
        <div className={`toast toast--${notice.tone}`} role="status">
          <Icon name={notice.tone === 'warning' ? 'alert' : 'check'} size={19} />
          <span>{notice.message}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Fechar"><Icon name="close" size={16} /></button>
        </div>
      )}
    </div>
  )
}
