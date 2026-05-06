import { useCart } from '../context/CartContext'
import { formatPrecio } from '../utils/formatters'
import { useNavigate } from 'react-router-dom'
import './CartPanel.css'

const ENVIO_GRATIS = 10000

export default function CartPanel({ abierto, onCerrar }) {
  const navigate = useNavigate()
  const { carrito, cambiarCantidad, eliminarItem, totalItems, subtotal } = useCart()
  const falta    = Math.max(0, ENVIO_GRATIS - subtotal)
  const progreso = Math.min(100, (subtotal / ENVIO_GRATIS) * 100)

  return (
    <>
      <div className={`carrito-overlay ${abierto ? 'abierto' : ''}`} onClick={onCerrar} />
      <div className={`panel-carrito ${abierto ? 'abierto' : ''}`}>
        <div className="carrito-header">
          <div className="carrito-titulo-wrap">
            <img className="carrito-icono" src="/assets/Carrito/carrito-de-compras.png" alt="Carrito" />
            <h2 className="carrito-titulo">Tu pedido</h2>
          </div>
          <button className="carrito-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <div className="carrito-items">
          {carrito.length === 0 ? (
            <p className="carrito-vacio">Tu carrito está vacío</p>
          ) : carrito.map((item, index) => (
            <div className="carrito-item" key={index}>
              <img className="carrito-item-imagen" src={item.imagen} alt={item.nombre} />
              <div className="carrito-item-info">
                <span className="carrito-item-nombre">{item.nombre}</span>
                {item.nota && <span className="carrito-item-nota">Sin: {item.nota}</span>}
                <span className="carrito-item-precio">{item.precio}</span>
              </div>
              <div className="carrito-item-controles">
                <button className="carrito-item-eliminar" onClick={() => eliminarItem(index)}>
                  <img src="/assets/Carrito/bote-de-basura.png" alt="Eliminar" />
                </button>
                <div className="cantidad">
                  <button className="btn-cantidad" onClick={() => cambiarCantidad(index, -1)}>-</button>
                  <span className="numero-cantidad">{item.cantidad}</span>
                  <button className="btn-cantidad" onClick={() => cambiarCantidad(index, 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="envio-gratis-wrap">
          <div className="envio-gratis-texto">
            {falta === 0
              ? <span>🎉 ¡Tienes <strong>envío gratis!</strong></span>
              : <span>🚀 Te faltan <strong>{formatPrecio(falta)}</strong> para envío gratis</span>
            }
          </div>
          <div className="envio-gratis-barra">
            <div className="envio-gratis-progreso" style={{ width: progreso + '%' }} />
          </div>
        </div>

        <div className="carrito-subtotal">
          <span>Subtotal:</span>
          <span id="carrito-total">{formatPrecio(subtotal)}</span>
        </div>

        <button
          className="btn-finalizar"
          onClick={() => {
            if (carrito.length === 0) return
            onCerrar()
            navigate('/checkout')
          }}
          disabled={carrito.length === 0}
        >
          Finalizar pedido
          <img className="icono-flecha" src="/assets/Carrito/flecha.png" alt="flecha" />
        </button>

        {carrito.length === 0 && (
          <p className="carrito-mensaje-vacio">
            Agrega productos para continuar
          </p>
        )}
      </div>
    </>
  )
}