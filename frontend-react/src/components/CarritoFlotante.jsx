import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import './CartPanel.css'

export default function CarritoFlotante({ onClick }) {
  const { totalItems } = useCart()
  const [bottom, setBottom] = useState(30)

  useEffect(() => {
    const actualizar = () => {
      const footer = document.querySelector('.footer')
      if (!footer) return
      const footerTop   = footer.getBoundingClientRect().top
      const windowH     = window.innerHeight
      if (footerTop < windowH) {
        setBottom(windowH - footerTop + 10)
      } else {
        setBottom(30)
      }
    }

    window.addEventListener('scroll', actualizar, { passive: true })
    window.addEventListener('resize', actualizar)
    actualizar()

    return () => {
      window.removeEventListener('scroll', actualizar)
      window.removeEventListener('resize', actualizar)
    }
  }, [])

  return (
    <button
      className="btn-carrito-flotante"
      onClick={onClick}
      style={{ bottom: `${bottom}px` }}
    >
      <img className="icono-carrito-flotante" src="/assets/Carrito/carrito-de-compras.png" alt="Carrito" />
      <span>{totalItems}</span>
    </button>
  )
}