import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueueProvider } from './context/QueueContext'
import AppLayout from './components/AppLayout'
import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'
import NotFoundPage from './pages/NotFoundPage'
import PanelPage from './pages/PanelPage'
import ServicePage from './pages/ServicePage'
import TotemPage from './pages/TotemPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <QueueProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route element={<AppLayout />}>
            <Route path="/inicio" element={<DashboardPage />} />
            <Route path="/atendimento" element={<ServicePage />} />
            <Route path="/historico" element={<HistoryPage />} />
          </Route>
          <Route path="/totem" element={<TotemPage />} />
          <Route path="/painel" element={<PanelPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </QueueProvider>
    </BrowserRouter>
  )
}

export default App
