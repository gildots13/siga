import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Logo from '../components/Logo'

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <Logo />
      <span>404</span>
      <h1>Página não encontrada</h1>
      <p>O endereço acessado não faz parte do SIGA.</p>
      <Link className="button button--primary" to="/inicio"><Icon name="arrowLeft" size={18} />Voltar ao início</Link>
    </main>
  )
}
