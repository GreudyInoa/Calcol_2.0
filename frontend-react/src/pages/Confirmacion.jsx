import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Confirmacion.css'

export default function Confirmacion() {
  const navigate = useNavigate()

  useEffect(() => {
    const t1 = setTimeout(() => {
      document.getElementById('wrap')?.classList.add('fadeout')
    }, 3500)
    const t2 = setTimeout(() => navigate('/'), 4200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [navigate])

  return (
    <div className="confirmacion-wrap" id="wrap">
      <img className="confirmacion-imagen" src="/assets/Carrito/confirmacion-doki.png" alt="Gracias por tu pedido" />
    </div>
  )
}