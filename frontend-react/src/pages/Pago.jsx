import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { formatPrecio, parsePrecio } from '../utils/formatters'
import { getSession } from '../utils/auth'
import { api } from '../services/api'
import './Checkout.css'

const COSTO_ENVIO = 2000

export default function Pago() {
  const navigate = useNavigate()
  const { carrito, subtotal, limpiarCarrito } = useCart()
  const checkout = JSON.parse(sessionStorage.getItem('calcol_checkout') || '{}')
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [loading, setLoading]       = useState(false)

  if (!checkout.direccion) { navigate('/entrega'); return null }

  const handleConfirmar = async () => {
    const sesion = getSession()
    if (!sesion) { navigate('/login'); return }
    setLoading(true)
    const items = carrito.map(p => ({
      producto_id: p.id,
      cantidad:    p.cantidad,
      nota:        p.nota || '',
    }))
    try {
      const data = await api.crearPedido({
        direccion:     checkout.direccion,
        instrucciones: checkout.instrucciones || '',
        items,
        cubiertos:     checkout.cubiertos || 0,
        salsa:         checkout.salsa || 0,
        metodo_pago:   metodoPago,
      })
      if (data.error) { alert('Error: ' + data.error); setLoading(false); return }
      limpiarCarrito()
      sessionStorage.removeItem('calcol_checkout')
      navigate('/confirmacion')
    } catch { alert('Error de conexión'); setLoading(false) }
  }

  return (
    <>
      <Navbar />
      <div className="progreso-wrap">
        <div className="progreso-step completado"><div className="progreso-circulo">✓</div><span>Carrito</span></div>
        <div className="progreso-linea completada" />
        <div className="progreso-step completado"><div className="progreso-circulo">✓</div><span>Entrega</span></div>
        <div className="progreso-linea completada" />
        <div className="progreso-step activo"><div className="progreso-circulo">3</div><span>Pago</span></div>
        <div className="progreso-linea" />
        <div className="progreso-step"><div className="progreso-circulo">4</div><span>Confirmación</span></div>
      </div>

      <div className="checkout-contenedor">
        <div className="checkout-izquierda">
          <div className="checkout-card">
            <div className="checkout-card-header">
              <img src="/assets/Carrito/dinero.png" alt="Pago" width="22" />
              <h2 className="checkout-card-titulo">Método de pago</h2>
            </div>
            <div className="pago-opciones">
              <label className="pago-opcion">
                <input type="radio" name="pago" value="efectivo" checked={metodoPago === 'efectivo'} onChange={() => setMetodoPago('efectivo')} />
                <img className="pago-opcion-icono" src="/assets/Carrito/dinero.png" alt="Efectivo" />
                <div className="pago-opcion-texto"><strong>Efectivo</strong><span>Paga al momento de la entrega</span></div>
              </label>
              <label className="pago-opcion">
                <input type="radio" name="pago" value="tarjeta" checked={metodoPago === 'tarjeta'} onChange={() => setMetodoPago('tarjeta')} />
                <img className="pago-opcion-icono" src="/assets/Carrito/icono-visa.png" alt="Tarjeta" />
                <div className="pago-opcion-texto"><strong>Tarjeta</strong><span>Débito o crédito</span></div>
              </label>
            </div>
          </div>

          <div className="checkout-card">
            <div className="checkout-card-header">
              <img src="/assets/Index/icono-ubi.png" alt="Entrega" />
              <h2 className="checkout-card-titulo">Dirección de entrega</h2>
              <button className="btn-editar-link" onClick={() => navigate('/entrega')}>Editar</button>
            </div>
            <div className="entrega-resumen">
              <p>{checkout.direccion}</p>
              {checkout.instrucciones && <p className="entrega-instrucciones">{checkout.instrucciones}</p>}
            </div>
          </div>
        </div>

        <div className="checkout-derecha">
          <div className="checkout-card">
            <div className="checkout-card-header">
              <img src="/assets/Carrito/carrito-de-compras.png" alt="Pedido" width="20" />
              <h2 className="checkout-card-titulo">Tu pedido</h2>
              <span className="resumen-badge">{carrito.reduce((s, p) => s + p.cantidad, 0)} artículos</span>
            </div>
            {carrito.map((item, i) => (
              <div className="carrito-item" key={i}>
                <img className="carrito-item-img" src={item.imagen} alt={item.nombre} />
                <div className="carrito-item-info">
                  <span className="carrito-item-nombre">{item.nombre}</span>
                  <span className="carrito-item-precio">{item.precio}</span>
                </div>
                <span className="resumen-badge">{item.cantidad}</span>
              </div>
            ))}
          </div>
          <div className="checkout-card total-card">
            <h2 className="checkout-card-titulo" style={{ marginBottom: 16 }}>Total del pedido</h2>
            <div className="checkout-total-fila"><span>Subtotal</span><span>{formatPrecio(subtotal)}</span></div>
            <div className="checkout-total-fila"><span>Costo de envío</span><span>{formatPrecio(COSTO_ENVIO)}</span></div>
            <div className="checkout-total-fila checkout-total-final"><span>Total</span><span>{formatPrecio(subtotal + COSTO_ENVIO)}</span></div>
            <button className="btn-hacer-pedido" onClick={handleConfirmar} disabled={loading}>
              {loading ? 'Procesando...' : '🔥 Confirmar pedido'}
            </button>
            <div className="seguridad-badge">🔒 Pago 100% seguro y encriptado</div>
            <Link className="btn-seguir-comprando" to="/entrega">← Volver a entrega</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}