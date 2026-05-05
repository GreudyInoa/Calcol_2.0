import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('carrito')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (carrito.length > 0) {
      localStorage.setItem('carrito', JSON.stringify(carrito))
    } else {
      localStorage.removeItem('carrito')
    }
  }, [carrito])

  const agregarItem = (producto, cantidad = 1, nota = '') => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id && p.nota === nota)
      if (existe) {
        return prev.map(p =>
          p.id === producto.id && p.nota === nota
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p
        )
      }
      return [...prev, { ...producto, cantidad, nota }]
    })
  }

  const cambiarCantidad = (index, delta) => {
    setCarrito(prev => {
      const nuevo = [...prev]
      nuevo[index] = { ...nuevo[index], cantidad: nuevo[index].cantidad + delta }
      if (nuevo[index].cantidad <= 0) nuevo.splice(index, 1)
      return nuevo
    })
  }

  const eliminarItem = (index) => {
    setCarrito(prev => prev.filter((_, i) => i !== index))
  }

  const limpiarCarrito = () => setCarrito([])

  const totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0)

  const subtotal = carrito.reduce((sum, p) => {
    const precio = parseInt(String(p.precio).replace(/\D/g, '')) || 0
    return sum + precio * p.cantidad
  }, 0)

  return (
    <CartContext.Provider value={{
      carrito,
      agregarItem,
      cambiarCantidad,
      eliminarItem,
      limpiarCarrito,
      totalItems,
      subtotal,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}