import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession } from '../utils/auth'
import './Bienvenido.css'

export default function Bienvenido() {
  const navigate = useNavigate()
  const sesion   = getSession()

  useEffect(() => {
    const t1 = setTimeout(() => {
      document.getElementById('wrap')?.classList.add('fadeout')
    }, 3500)
    const t2 = setTimeout(() => navigate('/'), 4500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [navigate])

  return (
    <div className="bienvenido-wrap" id="wrap">
      <img src="/assets/Login/bienvenido-doki.png" alt="¡Bienvenido!" />
      <div className="nombre-txt">
        {sesion?.nombre ? `¡Bienvenido, ${sesion.nombre}!` : '¡Bienvenido!'}
      </div>
    </div>
  )
}