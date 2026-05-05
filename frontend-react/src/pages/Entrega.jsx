import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { formatPrecio } from '../utils/formatters'
import './Checkout.css'

const COSTO_ENVIO = 2000
const COMUNAS = ['Pudahuel', 'Cerro Navia', 'Lo Prado', 'Maipú', 'Renca', 'Quinta Normal', 'Estación Central']

export default function Entrega() {
  const navigate = useNavigate()
  const { carrito, subtotal } = useCart()
  const [comuna, setComuna]           = useState('')
  const [direccion, setDireccion]     = useState('')
  const [numero, setNumero]           = useState('')
  const [depto, setDepto]             = useState('')
  const [instrucciones, setInstrucciones] = useState('')
  const [errores, setErrores]         = useState({})

  if (carrito.length === 0) { navigate('/checkout'); return null }

  const handleContinuar = () => {
    const errs = {}
    if (!comuna)    errs.comuna    = 'Selecciona tu comuna'
    if (!direccion) errs.direccion = 'Ingresa tu calle'
    if (!numero)    errs.numero    = 'Ingresa el número'
    if (Object.keys(errs).length) { setErrores(errs); return }
    const direccionCompleta = `${direccion} ${numero}${depto ? ', ' + depto : ''}, ${comuna}`
    const checkout = JSON.parse(sessionStorage.getItem('calcol_checkout') || '{}')
    checkout.direccion     = direccionCompleta
    checkout.instrucciones = instrucciones
    sessionStorage.setItem('calcol_checkout', JSON.stringify(checkout))
    navigate('/pago')
  }

  return (
    <>
      <Navbar />
      <div className="progreso-wrap">
        <div className="progreso-step completado"><div className="progreso-circulo">✓</div><span>Carrito</span></div>
        <div className="progreso-linea completada" />
        <div className="progreso-step activo"><div className="progreso-circulo">2</div><span>Entrega</span></div>
        <div className="progreso-linea" />
        <div className="progreso-step"><div className="progreso-circulo">3</div><span>Pago</span></div>
        <div className="progreso-linea" />
        <div className="progreso-step"><div className="progreso-circulo">4</div><span>Confirmación</span></div>
      </div>

      <div className="checkout-contenedor">
        <div className="checkout-izquierda">
          <div className="checkout-card">
            <div className="checkout-card-header">
              <img src="/assets/Index/icono-ubi.png" alt="Entrega" />
              <h2 className="checkout-card-titulo">Dirección de entrega</h2>
            </div>
            <div className="entrega-grid">
              <div className="checkout-campo entrega-campo-full">
                <label className="checkout-label">Comuna</label>
                <select className="checkout-input checkout-select" value={comuna} onChange={e => { setComuna(e.target.value); setErrores(p => ({ ...p, comuna: '' })) }}>
                  <option value="">Selecciona tu comuna</option>
                  {COMUNAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errores.comuna && <span className="campo-error visible">{errores.comuna}</span>}
              </div>
              <div className="checkout-campo entrega-campo-full">
                <label className="checkout-label">Calle</label>
                <input className="checkout-input" type="text" placeholder="Ej: San Pablo" value={direccion} onChange={e => { setDireccion(e.target.value); setErrores(p => ({ ...p, direccion: '' })) }} />
                {errores.direccion && <span className="campo-error visible">{errores.direccion}</span>}
              </div>
              <div className="checkout-campo">
                <label className="checkout-label">Número</label>
                <input className="checkout-input" type="text" placeholder="Ej: 8648" value={numero} onChange={e => { setNumero(e.target.value.replace(/\D/g, '')); setErrores(p => ({ ...p, numero: '' })) }} />
                {errores.numero && <span className="campo-error visible">{errores.numero}</span>}
              </div>
              <div className="checkout-campo">
                <label className="checkout-label">Depto / Casa (opcional)</label>
                <input className="checkout-input" type="text" placeholder="Ej: Depto 302" value={depto} onChange={e => setDepto(e.target.value)} />
              </div>
              <div className="checkout-campo entrega-campo-full">
                <label className="checkout-label">Instrucciones especiales (opcional)</label>
                <input className="checkout-input" type="text" placeholder="Ej: Tocar el timbre..." value={instrucciones} onChange={e => setInstrucciones(e.target.value)} />
              </div>
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
            <h2 className="checkout-card-titulo" style={{ marginBottom: 16 }}>Resumen</h2>
            <div className="checkout-total-fila"><span>Subtotal</span><span>{formatPrecio(subtotal)}</span></div>
            <div className="checkout-total-fila"><span>Costo de envío</span><span>{formatPrecio(COSTO_ENVIO)}</span></div>
            <div className="checkout-total-fila checkout-total-final"><span>Total</span><span>{formatPrecio(subtotal + COSTO_ENVIO)}</span></div>
            <button className="btn-hacer-pedido" onClick={handleContinuar}>Continuar al pago →</button>
            <div className="seguridad-badge">🔒 Pago 100% seguro y encriptado</div>
            <Link className="btn-seguir-comprando" to="/checkout">← Volver al carrito</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}