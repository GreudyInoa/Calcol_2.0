import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartPanel from '../components/CartPanel'
import CarritoFlotante from '../components/CarritoFlotante'
import { useCart } from '../context/CartContext'
import './Menu.css'

const CATEGORIAS = ['completos', 'hamburguesa', 'churrasco', 'yaroa']

const PRODUCTOS = [
  { id: 1,  nombre: 'Completo',              precio: '$1.700', categoria: 'completos',   imagen: '/assets/Menu/Completos/completo-completo-pequeño.png',  desc: 'Pan bueno, salchichón, tomate, palta y torta mayo casera.' },
  { id: 2,  nombre: 'Completo XL',           precio: '$1.700', categoria: 'completos',   imagen: '/assets/Menu/Completos/completo-completo-xl.png',        desc: 'Pan bueno, salchichón, palta-Chimichurri y torta mayo casera.' },
  { id: 3,  nombre: 'Italiano',              precio: '$1.700', categoria: 'completos',   imagen: '/assets/Menu/Completos/completo-italiano-peque.png',     desc: 'Pan suave, salchicha, tomate fresco, palta y harta mayo casera.' },
  { id: 4,  nombre: 'Italiano XL',           precio: '$1.700', categoria: 'completos',   imagen: '/assets/Menu/Completos/completo-italiano-xl.png',        desc: 'Pan suave, salchicha, tomate fresco, palta y harta mayo casera.' },
  { id: 5,  nombre: 'As Queso',              precio: '$1.700', categoria: 'completos',   imagen: '/assets/Menu/Completos/completo-as-queso-pequeño.png',   desc: 'Pan, vienesa, salchicha y queso derretido.' },
  { id: 6,  nombre: 'As Queso XL',           precio: '$1.700', categoria: 'completos',   imagen: '/assets/Menu/Completos/completo-as-queso-xl.png',        desc: 'Pan, vienesa, salchicha y queso derretido.' },
  { id: 7,  nombre: 'Italiano',              precio: '$2.500', categoria: 'churrasco',   imagen: '/assets/Menu/churrasco/churrasco-italiano.webp',         desc: 'Pan, carne jugosa, tomate, palta y mayo casera.' },
  { id: 8,  nombre: 'Chacarero',             precio: '$2.500', categoria: 'churrasco',   imagen: '/assets/Menu/churrasco/chacarero.jpg',                   desc: 'Pan, carne jugosa, porotos verdes, ají verde y tomate.' },
  { id: 9,  nombre: 'Barros Luco',           precio: '$2.500', categoria: 'churrasco',   imagen: '/assets/Menu/churrasco/barro luco.webp',                 desc: 'Pan, carne jugosa y queso fundido.' },
  { id: 10, nombre: 'Churrasco a lo Pobre',  precio: '$2.500', categoria: 'churrasco',   imagen: '/assets/Menu/churrasco/a lo pobre.jpg',                  desc: 'Pan, carne jugosa, huevo frito, cebolla frita y papas fritas.' },
  { id: 11, nombre: 'Barros Jarpa',          precio: '$2.500', categoria: 'churrasco',   imagen: '/assets/Menu/churrasco/barros jarpa.webp',               desc: 'Pan, jamón cocido y queso fundido.' },
  { id: 12, nombre: 'Completo',              precio: '$2.500', categoria: 'churrasco',   imagen: '/assets/Menu/churrasco/completo.jpeg',                   desc: 'Pan, carne jugosa, tomate, chucrut y mayo casera.' },
  { id: 13, nombre: 'Cheeseburger',          precio: '$2.500', categoria: 'hamburguesa', imagen: '/assets/Menu/hamburguesas/Cheeseburger.png',             desc: 'Pan de hamburguesa, carne de res y queso fundido.' },
  { id: 14, nombre: 'Bacon Burger',          precio: '$2.500', categoria: 'hamburguesa', imagen: '/assets/Menu/hamburguesas/Bacon-Burger.png',             desc: 'Carne de res, tocino crujiente, queso cheddar, lechuga, tomate y salsas.' },
  { id: 15, nombre: 'Hamburguesa BBQ',       precio: '$2.500', categoria: 'hamburguesa', imagen: '/assets/Menu/hamburguesas/Hamburguesa-BBQ.png',          desc: 'Carne de res, salsa BBQ, queso cheddar, tocino, cebolla y tomate.' },
  { id: 16, nombre: 'Hamburguesa Suiza',     precio: '$2.500', categoria: 'hamburguesa', imagen: '/assets/Menu/hamburguesas/Hamburguesa Suiza.jpg',        desc: 'Carne de res, champiñones salteados, queso suizo, cebolla y salsas.' },
  { id: 17, nombre: 'Hawaiana',              precio: '$2.500', categoria: 'hamburguesa', imagen: '/assets/Menu/hamburguesas/Hamburguesa Hawaiana.jpg',     desc: 'Carne de res, jamón, piña, queso cheddar, lechuga y salsa.' },
  { id: 18, nombre: 'Stacker',               precio: '$2.500', categoria: 'hamburguesa', imagen: '/assets/Menu/hamburguesas/Hamburguesa Stacker.webp',    desc: 'Tres carnes de res, queso cheddar, lechuga, tomate, cebolla y salsas.' },
  { id: 19, nombre: 'Yaroa de pollo',        precio: '$2.500', categoria: 'yaroa',       imagen: '/assets/Menu/Yaroa/Yaroa-pollo.avif',                    desc: 'Papas fritas, pollo desmenuzado, queso y mayonesa/ketchup.' },
  { id: 20, nombre: 'Yaroa de carne molida', precio: '$2.500', categoria: 'yaroa',       imagen: '/assets/Menu/Yaroa/yaroa-carne-molida.jpg',              desc: 'Papas fritas, carne molida, queso y mayonesa/ketchup.' },
  { id: 21, nombre: 'Yaroa mixta',           precio: '$2.500', categoria: 'yaroa',       imagen: '/assets/Menu/Yaroa/yaroa-mixta.jpeg',                    desc: 'Papas fritas, pollo y carne, queso y salsas.' },
  { id: 22, nombre: 'Yaroa de longaniza',    precio: '$2.500', categoria: 'yaroa',       imagen: '/assets/Menu/Yaroa/yaroa-longaniza.jpg',                 desc: 'Papas fritas, longaniza, queso y salsas.' },
  { id: 23, nombre: 'Yaroa de res y tocino', precio: '$2.500', categoria: 'yaroa',       imagen: '/assets/Menu/Yaroa/yaroa-res-tocino.png',                desc: 'Papas fritas, carne de res, tocino, queso y salsas.' },
  { id: 24, nombre: 'Yaroa vegetariana',     precio: '$2.500', categoria: 'yaroa',       imagen: '/assets/Menu/Yaroa/yaroa-vegetariana.png',               desc: 'Papas fritas, vegetales salteados, queso y salsas.' },
]

export default function Menu() {
  const { agregarItem } = useCart()
  const [filtro, setFiltro]           = useState('completos')
  const [modal, setModal]             = useState(null)
  const [cantidad, setCantidad]       = useState(1)
  const [nota, setNota]               = useState('')
  const [cartAbierto, setCartAbierto] = useState(false)

  const productosFiltrados = PRODUCTOS.filter(p => p.categoria === filtro)

  const abrirModal = (producto) => {
    setModal(producto)
    setCantidad(1)
    setNota('')
  }

  const handleAgregar = () => {
    if (!modal) return
    agregarItem(modal, cantidad, nota)
    setModal(null)
    if (window.innerWidth > 1024) setCartAbierto(true)
  }

  return (
    <div className="menu-page">
      <div className="menu-fondo" />
      <div className="menu-fondo-overlay" />

      <Navbar />

      <div className="menu-header">
        <h1 className="menu-titulo">NUESTRO <span className="resaltar">MENÚ</span></h1>
        <p className="menu-subtitulo">Lo mejor de la calle, preparado con nivel.</p>
      </div>

      <div className="filtros">
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            className={`filtro-btn ${filtro === cat ? 'activo' : ''}`}
            onClick={() => setFiltro(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="productos-grid">
        {productosFiltrados.map(producto => (
          <div
            className="tarjeta-producto"
            key={producto.id}
            onClick={() => abrirModal(producto)}
          >
            <img className="imagen-producto" src={producto.imagen} alt={producto.nombre} />
            <div className="producto-card-body">
              <h3 className="producto-nombre">{producto.nombre}</h3>
              <span className="producto-precio">{producto.precio}</span>
              <button className="btn-agregar">+ Agregar</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div
          className="modal-producto-overlay abierto"
          onClick={e => e.target.className.includes('overlay') && setModal(null)}
        >
          <div className="modal-producto">
            <button className="modal-producto-cerrar" onClick={() => setModal(null)}>✕</button>
            <img className="modal-producto-imagen" src={modal.imagen} alt={modal.nombre} />
            <div className="modal-producto-body">
              <h2 className="modal-producto-nombre">{modal.nombre}</h2>
              <p className="modal-producto-desc">{modal.desc}</p>
              <span className="modal-producto-precio">{modal.precio}</span>
              <div className="modal-producto-nota">
                <label>Sin:</label>
                <input
                  type="text"
                  placeholder="Ej: sin tomate, sin cebolla..."
                  value={nota}
                  onChange={e => setNota(e.target.value)}
                />
              </div>
              <div className="modal-producto-footer">
                <div className="modal-cantidad">
                  <button className="modal-btn-cantidad" onClick={() => setCantidad(c => Math.max(1, c - 1))}>−</button>
                  <span className="modal-numero-cantidad">{cantidad}</span>
                  <button className="modal-btn-cantidad" onClick={() => setCantidad(c => c + 1)}>+</button>
                </div>
                <button className="modal-btn-agregar" onClick={handleAgregar}>
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CartPanel abierto={cartAbierto} onCerrar={() => setCartAbierto(false)} />
      <CarritoFlotante onClick={() => setCartAbierto(true)} />

      <Footer />
    </div>
  )
}