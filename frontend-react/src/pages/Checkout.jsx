import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { formatPrecio } from '../utils/formatters'
import { getSession } from '../utils/auth'
import { useState } from 'react'
import './Checkout.css'

const COSTO_ENVIO = 2000

export default function Checkout() {
  const navigate = useNavigate()
  const { carrito, cambiarCantidad, eliminarItem, subtotal } = useCart()
  const [cubiertos, setCubiertos] = useState(false)
  const [salsa, setSalsa]         = useState(false)

  const handleContinuar = () => {
    if (carrito.length === 0) { alert('Tu carrito está vacío'); return }
    const sesion = getSession()
    if (!sesion) {
      localStorage.setItem('calcol_redirect', 'checkout')
      navigate('/login'); return
    }
    sessionStorage.setItem('calcol_checkout', JSON.stringify({ cubiertos: cubiertos ? 1 : 0, salsa: salsa ? 1 : 0 }))
    navigate('/entrega')
  }

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="progreso-wrap">
        <div className="progreso-step activo"><div className="progreso-circulo">1</div><span>Carrito</span></div>
        <div className="progreso-linea" />
        <div className="progreso-step"><div className="progreso-circulo">2</div><span>Entrega</span></div>
        <div className="progreso-linea" />
        <div className="progreso-step"><div className="progreso-circulo">3</div><span>Pago</span></div>
        <div className="progreso-linea" />
        <div className="progreso-step"><div className="progreso-circulo">4</div><span>Confirmación</span></div>
      </div>

      <div className="checkout-contenedor">
        <div className="checkout-izquierda">

          {/* ── Carrito ── */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              <img src="/assets/Carrito/carrito-de-compras.png" alt="Carrito" />
              <h2 className="checkout-card-titulo">Tu carrito</h2>
              <span className="resumen-badge">{carrito.reduce((s, p) => s + p.cantidad, 0)} artículos</span>
            </div>
            {carrito.length === 0 ? (
              <p className="carrito-vacio">Tu carrito está vacío</p>
            ) : carrito.map((item, i) => (
              <div className="carrito-item" key={i}>
                <img className="carrito-item-img" src={item.imagen} alt={item.nombre} />
                <div className="carrito-item-info">
                  <span className="carrito-item-nombre">{item.nombre}</span>
                  <span className="carrito-item-precio">{item.precio}</span>
                  {item.nota && <span className="carrito-item-nota">Sin: {item.nota}</span>}
                </div>
                <div className="carrito-item-controles">
                  <button className="btn-cantidad" onClick={() => cambiarCantidad(i, -1)}>−</button>
                  <span className="carrito-item-cantidad">{item.cantidad}</span>
                  <button className="btn-cantidad" onClick={() => cambiarCantidad(i, 1)}>+</button>
                  <button className="btn-eliminar-item" onClick={() => eliminarItem(i)}>🗑</button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Extras ── */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              <img src="/assets/Carrito/cruz-tenedor.png" alt="Extras" />
              <h2 className="checkout-card-titulo">Extras</h2>
            </div>
            <div className="extra-item">
              <div className="extra-info">
                <img src="/assets/Carrito/tenedor-cruz-colores.png" alt="Cubiertos" className="extra-icono" />
                <div>
                  <strong>Cubiertos</strong>
                  <span>Incluye cubiertos desechables</span>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={cubiertos} onChange={e => setCubiertos(e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="extra-item">
              <div className="extra-info">
                <img src="/assets/Carrito/salsa-de-casa.png" alt="Salsa" className="extra-icono" />
                <div>
                  <strong>Salsa de la casa</strong>
                  <span>Nuestra salsa criolla especial</span>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={salsa} onChange={e => setSalsa(e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

        </div>

        <div className="checkout-derecha">
          <div className="entrega-badge">
            <span className="entrega-icono">⏱</span>
            <div><strong>Tiempo estimado de entrega</strong><span>30 – 45 minutos</span></div>
          </div>
          <div className="checkout-card total-card">
            <h2 className="checkout-card-titulo" style={{ marginBottom: 16 }}>Resumen</h2>
            <div className="checkout-total-fila"><span>Subtotal</span><span>{formatPrecio(subtotal)}</span></div>
            <div className="checkout-total-fila"><span>Costo de envío</span><span>{formatPrecio(COSTO_ENVIO)}</span></div>
            <div className="checkout-total-fila checkout-total-final"><span>Total</span><span>{formatPrecio(subtotal + COSTO_ENVIO)}</span></div>
            <button className="btn-hacer-pedido" onClick={handleContinuar}>
              Continuar
              <img src="/assets/Carrito/flecha.png" alt="→" className="btn-flecha" />
            </button>
            <Link className="btn-seguir-comprando" to="/menu">← Seguir comprando</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}