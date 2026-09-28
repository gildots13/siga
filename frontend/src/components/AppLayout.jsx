import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useQueue } from '../hooks/useQueue'
import Icon from './Icon'
import Logo from './Logo'

const menu = [
  { to: '/inicio', label: 'Visão geral', icon: 'activity' },
  { to: '/atendimento', label: 'Atendimento', icon: 'headset' },
  { to: '/historico', label: 'Histórico', icon: 'clock' },
]
const external = [
  { to: '/totem', label: 'Totem de senhas', icon: 'ticket' },
  { to: '/painel', label: 'Painel público', icon: 'monitor' },
]

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const { profile, notice, setNotice } = useQueue()
  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(null), 4200)
    return () => clearTimeout(timer)
  }, [notice, setNotice])

  const link = ({ to, label, icon }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}><Icon name={icon} size={18} />{label}</NavLink>

  return <div className="app-shell">
    <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
      <div className="sidebar__brand"><Logo light /></div>
      <nav className="sidebar__nav" aria-label="Navegação principal"><span className="sidebar__label">OPERAÇÃO</span>{menu.map(link)}<span className="sidebar__label sidebar__label--views">TELAS EXTERNAS</span>{external.map(link)}</nav>
      <div className="sidebar__footer"><span className="system-online"><i />Simulação local</span><small>Dados deste navegador</small></div>
    </aside>
    {open && <button className="sidebar-overlay" type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" />}
    <div className="app-content"><header className="topbar"><button className="icon-button topbar__menu" type="button" onClick={() => setOpen(true)} aria-label="Abrir menu"><Icon name="menu" /></button><div className="topbar__context"><span>UNIDADE</span><strong>Laboratório Central</strong></div><div className="topbar__actions"><div className="profile-chip"><span className="avatar">{profile?.name?.[0]?.toUpperCase() || 'A'}</span><div><strong>{profile?.name || 'Atendente'}</strong><small>{profile?.counter || 'Posto não configurado'}</small></div></div></div></header><main className="main-content"><Outlet /></main></div>
    {notice && <div className={`toast${notice.tone === 'warning' ? ' toast--warning' : ''}`} role="status"><Icon name={notice.tone === 'warning' ? 'alert' : 'check'} size={18} /><span>{notice.message}</span><button type="button" onClick={() => setNotice(null)} aria-label="Fechar aviso"><Icon name="close" size={16} /></button></div>}
  </div>
}