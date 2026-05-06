import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartPanel from '../components/CartPanel'
import CarritoFlotante from '../components/CarritoFlotante'
import { useCart } from '../context/CartContext'
import './Promociones.css'

const PROMOS = [
  { id: 25, nombre: 'Combo Yaroa Full',      desc: 'Yaroa de pollo + bebida + postre',    antes: '$4.500', ahora: '$3.200', badge: '-30%',    categoria: 'yaroa',       imagen: '/assets/Menu/Yaroa/Yaroa-pollo.avif' },
  { id: 26, nombre: 'Combo Burger Caliente', desc: 'Bacon Burger + papas fritas + bebida', antes: '$5.000', ahora: '$3.800', badge: '¡Promo!', categoria: 'hamburguesa', imagen: '/assets/Menu/hamburguesas/Bacon Burger.jpg' },
  { id: 27, nombre: 'Combo Doble Completo',  desc: '2 completos + bebida familiar',        antes: '$4.200', ahora: '$3.400', badge: '-20%',    categoria: 'completo',    imagen: '/assets/Menu/Completos/completo-completo-pequeño.png' },
  { id: 28, nombre: 'Combo Burger Familiar', desc: '2 BBQ Burger + papas + 2 bebidas',    antes: '$8.000', ahora: '$5.600', badge: '-30%',    categoria: 'hamburguesa', imagen: '/assets/Menu/hamburguesas/Hamburguesa BBQ.webp' },
  { id: 29, nombre: 'Yaroa Carne Especial',  desc: 'Yaroa de carne molida + bebida',      antes: '$4.000', ahora: '$2.900', badge: '¡Promo!', categoria: 'yaroa',       imagen: '/assets/Menu/Yaroa/yaroa-carne-molida.jpg' },
  { id: 30, nombre: 'Italiano Combo',        desc: 'Italiano XL + bebida + postre',       antes: '$3.800', ahora: '$2.850', badge: '-25%',    categoria: 'completo',    imagen: '/assets/Menu/Completos/completo-italiano-peque.png' },
  { id: 31, nombre: 'Yaroa Mixta Combo',     desc: 'Yaroa mixta + bebida',                antes: '$3.500', ahora: '$2.800', badge: '-20%',    categoria: 'yaroa',       imagen: '/assets/Menu/Yaroa/yaroa-mixta.jpeg' },
  { id: 32, nombre: 'Stacker Combo',         desc: 'Stacker triple + papas + bebida',     antes: '$6.500', ahora: '$4.900', badge: '¡Promo!', categoria: 'hamburguesa', imagen: '/assets/Menu/hamburguesas/Hamburguesa Stacker.webp' },
]

const FILTROS = ['todos', 'yaroa', 'hamburguesa', 'completo']

export default function Promociones() {
  const { agregarItem } = useCart()
  const [filtro, setFiltro]           = useState('todos')
  const [modal, setModal]             = useState(null)
  const [cantidad, setCantidad]       = useState(1)
  const [cartAbierto, setCartAbierto] = useState(false)

  const promasFiltradas = PROMOS.filter(p => filtro === 'todos' || p.categoria === filtro)

  const handleAgregar = () => {
    if (!modal) return
    agregarItem({ id: modal.id, nombre: modal.nombre, precio: modal.ahora, imagen: modal.imagen }, cantidad)
    setModal(null)
    if (window.innerWidth > 1024) setCartAbierto(true)
  }

  return (
    <>
      <Navbar />
      <section className="promo-hero">
        <div className="promo-hero-bg" />
        <div className="promo-hero-overlay" />
        <div className="promo-hero-contenido">
          <span className="promo-hero-badge">🔥 Ofertas del día</span>
          <h1 className="promo-hero-titulo">OFERTAS<br /><span>ESPECIALES</span></h1>
          <p className="promo-hero-sub">Combos irresistibles por tiempo limitado</p>
        </div>
        <div className="promo-filtros-wrap">
          {FILTROS.map(f => (
            <button key={f} className={`promo-filtro-btn ${filtro === f ? 'activo' : ''}`} onClick={() => setFiltro(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section className="promo-seccion">
        <h2 className="promo-seccion-titulo">🔥 Promos <span>del momento</span></h2>
        <div className="promo-grid">
          {promasFiltradas.map(promo => (
            <div className="promo-card visible" key={promo.id} onClick={() => { setModal(promo); setCantidad(1) }}>
              <span className="promo-badge">{promo.badge}</span>
              <img className="promo-card-imagen" src={promo.imagen} alt={promo.nombre} />
              <div className="promo-card-body">
                <h3 className="promo-card-nombre">{promo.nombre}</h3>
                <p className="promo-card-desc">{promo.desc}</p>
                <div className="promo-card-precios">
                  <span className="promo-precio-antes">{promo.antes}</span>
                  <span className="promo-precio-ahora">{promo.ahora}</span>
                </div>
                <button className="promo-card-btn">Pedir ahora</button>
              </div>
            </div>
          ))}
        </div>

        <div className="happy-hour">
          <div className="happy-hour-bg" />
          <div className="happy-hour-overlay" />
          <div className="happy-hour-texto">
            <p className="happy-hour-label">⏰ Solo por tiempo limitado</p>
            <h2 className="happy-hour-titulo">Happy Hour</h2>
            <div className="happy-hour-hora">6pm — 9pm</div>
            <p className="happy-hour-desc">Todos los días de lunes a viernes. Descuento especial en todos nuestros combos.</p>
          </div>
          <div className="happy-hour-descuento">
            <div className="happy-hour-numero">25%</div>
            <div className="happy-hour-off">OFF</div>
            <p className="happy-hour-aplica">En todos los combos</p>
          </div>
        </div>
      </section>

      {modal && (
        <div className="modal-overlay abierto" onClick={e => e.target.className.includes('modal-overlay') && setModal(null)}>
          <div className="promo-modal abierto">
            <button className="promo-modal-cerrar" onClick={() => setModal(null)}>✕</button>
            <img className="promo-modal-imagen" src={modal.imagen} alt={modal.nombre} />
            <div className="promo-modal-body">
              <span className="promo-badge">{modal.badge}</span>
              <h3 className="promo-modal-nombre">{modal.nombre}</h3>
              <p className="promo-modal-desc">{modal.desc}</p>
              <div className="promo-card-precios">
                <span className="promo-precio-antes">{modal.antes}</span>
                <span className="promo-precio-ahora">{modal.ahora}</span>
              </div>
              <div className="promo-modal-footer">
                <div className="promo-modal-cantidad">
                  <button className="promo-modal-menos" onClick={() => setCantidad(c => Math.max(1, c - 1))}>−</button>
                  <span className="promo-modal-num">{cantidad}</span>
                  <button className="promo-modal-mas" onClick={() => setCantidad(c => c + 1)}>+</button>
                </div>
                <button className="promo-modal-btn" onClick={handleAgregar}>🛒 Agregar al carrito</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CartPanel abierto={cartAbierto} onCerrar={() => setCartAbierto(false)} />
      <CarritoFlotante onClick={() => setCartAbierto(true)} />

      <Footer />
    </>
  )
}