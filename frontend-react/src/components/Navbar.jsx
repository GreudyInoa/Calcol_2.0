import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getSession } from '../utils/auth'
import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar() {
  const sesion   = getSession()
  const loc      = useLocation()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [seccionActiva, setSeccionActiva] = useState('inicio')

  useEffect(() => {
    if (loc.pathname !== '/') {
      setSeccionActiva(loc.pathname)
      return
    }

    const onScroll = () => {
      const contacto = document.getElementById('contacto')
      if (!contacto) { setSeccionActiva('inicio'); return }
      const rect = contacto.getBoundingClientRect()
      if (rect.top <= 120) {
        setSeccionActiva('contacto')
      } else {
        setSeccionActiva('inicio')
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [loc.pathname])

  const handleInicio = (e) => {
    e.preventDefault()
    setMenuAbierto(false)
    if (loc.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  const handleContacto = (e) => {
    e.preventDefault()
    setMenuAbierto(false)
    if (loc.pathname === '/') {
      const contacto = document.getElementById('contacto')
      const top = contacto?.getBoundingClientRect().top + window.scrollY - 60
      window.scrollTo({ top, behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        const contacto = document.getElementById('contacto')
        const top = contacto?.getBoundingClientRect().top + window.scrollY - 60
        window.scrollTo({ top, behavior: 'smooth' })
      }, 300)
    }
  }

  const colorLink = (seccion) =>
    seccionActiva === seccion ? '#FFD700' : '#fff'

  const colorRuta = (ruta) =>
    loc.pathname === ruta && loc.pathname !== '/' ? '#FFD700' : '#fff'

  return (
    <nav className="navbar">

      <button
        className={`nav-hamburger ${menuAbierto ? 'abierto' : ''}`}
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Menú"
      >
        <span /><span /><span />
      </button>

      <Link to="/">
        <img className="logo" src="/assets/General/doky-calcol-logo.png" alt="Calcol" />
      </Link>

      <ul className={`nav-links ${menuAbierto ? 'abierto' : ''}`}>
        <li>
          <a href="/" style={{ color: colorLink('inicio') }} onClick={handleInicio}>
            Inicio
          </a>
        </li>
        <li>
          <Link
            to="/menu"
            style={{ color: loc.pathname === '/menu' ? '#FFD700' : '#fff' }}
            onClick={() => setMenuAbierto(false)}
          >
            Menú
          </Link>
        </li>
        <li>
          <Link
            to="/promociones"
            style={{ color: loc.pathname === '/promociones' ? '#FFD700' : '#fff' }}
            onClick={() => setMenuAbierto(false)}
          >
            Promociones
          </Link>
        </li>
        <li>
          <Link
            to="/nosotros"
            style={{ color: loc.pathname === '/nosotros' ? '#FFD700' : '#fff' }}
            onClick={() => setMenuAbierto(false)}
          >
            Nosotros
          </Link>
        </li>
        <li>
          <a href="/#contacto" style={{ color: colorLink('contacto') }} onClick={handleContacto}>
            Contacto
          </a>
        </li>
      </ul>

      {sesion ? (
        <Link to="/perfil" className="btn-nav-cta logueado">
          <img src="/assets/General/icono-perfil.png" alt="perfil" width="28" height="28" />
          <span className="nav-nombre">Hola, {sesion.nombre}</span>
        </Link>
      ) : (
        <Link to="/login" className="btn-nav-cta">Login</Link>
      )}
    </nav>
  )
}