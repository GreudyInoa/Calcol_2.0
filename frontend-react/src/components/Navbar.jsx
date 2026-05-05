import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { getSession } from '../utils/auth'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import './Navbar.css'

export default function Navbar() {
  const sesion    = getSession()
  const { totalItems } = useCart()
  const location  = useLocation()
  const navigate  = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const links = [
    { to: '/',           label: 'Inicio' },
    { to: '/menu',       label: 'Menú' },
    { to: '/promociones', label: 'Promociones' },
    { to: '/nosotros',   label: 'Nosotros' },
    { to: '/#contacto',  label: 'Contacto' },
  ]

  return (
    <nav className="navbar">
      <Link to="/">
        <img className="logo" src="/assets/General/doky-calcol-logo.png" alt="Calcol" />
      </Link>

      <button
        className={`nav-hamburger ${menuAbierto ? 'abierto' : ''}`}
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Menú"
      >
        <span /><span /><span />
      </button>

      <ul className={`nav-links ${menuAbierto ? 'abierto' : ''}`}>
        {links.map(link => (
          <li key={link.to}>
            <Link
              to={link.to}
              style={{ color: location.pathname === link.to ? '#FFD700' : '#fff' }}
              onClick={() => setMenuAbierto(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {sesion ? (
        <Link to="/perfil" className="btn-nav-cta logueado">
          <img src="/assets/General/icono-perfil.png" alt="perfil" width="22" height="22" />
          Hola, {sesion.nombre}
        </Link>
      ) : (
        <Link to="/login" className="btn-nav-cta">Login</Link>
      )}
    </nav>
  )
}