import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { setSession } from '../utils/auth'
import './Login.css'

export default function Login() {
  const navigate  = useNavigate()
  const canvasRef = useRef(null)
  const [tab, setTab]           = useState('login')
  const [lEmail, setLEmail]     = useState('')
  const [lPass, setLPass]       = useState('')
  const [verL, setVerL]         = useState(false)
  const [lError, setLError]     = useState('')
  const [rNombre, setRNombre]   = useState('')
  const [rTel, setRTel]         = useState('')
  const [rEmail, setREmail]     = useState('')
  const [rPass, setRPass]       = useState('')
  const [rPass2, setRPass2]     = useState('')
  const [verR, setVerR]         = useState(false)
  const [verR2, setVerR2]       = useState(false)
  const [rError, setRError]     = useState('')
  const [loading, setLoading]   = useState(false)
  const [exito, setExito]       = useState('')

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let particulas = []
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    function crearP() {
      return { x: Math.random() * canvas.width, y: canvas.height + Math.random() * 20, r: Math.random() * 3 + 1, vx: (Math.random() - 0.5) * 0.3, vy: -(Math.random() * 0.4 + 0.15), alpha: Math.random() * 0.8 + 0.2, color: `hsl(${Math.random() * 30 + 10}, 100%, ${Math.random() * 30 + 50}%)` }
    }
    particulas = Array.from({ length: 200 }, crearP)
    particulas.forEach(p => { p.y = Math.random() * canvas.height })
    let animId
    function animar() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particulas.forEach((p, i) => { p.x += p.vx; p.y += p.vy; p.alpha -= 0.0004; if (p.alpha <= 0 || p.y < 0) particulas[i] = crearP(); ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill() })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(animar)
    }
    animar()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  const handleLogin = async () => {
    setLError('')
    if (!lEmail || !lPass) { setLError('Completa todos los campos'); return }
    setLoading(true)
    try {
      const data = await api.login(lEmail, lPass)
      if (data.error) { setLError(data.error); setLoading(false); return }
      setSession(data)
      setExito(data.usuario.nombre)
      const redirect = localStorage.getItem('calcol_redirect')
      if (redirect === 'checkout') { localStorage.removeItem('calcol_redirect'); setTimeout(() => navigate('/checkout'), 1300) }
      else setTimeout(() => navigate('/bienvenido'), 1300)
    } catch { setLError('Error de conexión con el servidor') }
    setLoading(false)
  }

  const handleRegistro = async () => {
    setRError('')
    if (!rNombre || rTel.length !== 9 || !rEmail || rPass.length < 8 || rPass !== rPass2) {
      setRError('Revisa todos los campos'); return
    }
    setLoading(true)
    try {
      const data = await api.registro({ nombre: rNombre, email: rEmail, password: rPass, telefono: '+56' + rTel })
      if (data.error) { setRError(data.error); setLoading(false); return }
      setSession(data)
      setExito(data.usuario.nombre)
      setTimeout(() => navigate('/bienvenido'), 1300)
    } catch { setRError('Error de conexión con el servidor') }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <canvas ref={canvasRef} id="brasas" />
      <Link to="/" className="back-btn">
        <img src="/assets/Login/flecha-izquierda.png" alt="←" width="14" />
        Inicio
      </Link>
      <div className="login-wrap">
        <div className="login-card">
          <div className="col-imagen">
            <img src="/assets/Login/login-doki-piensa.jpeg" alt="Calcol" />
          </div>
          <div className="col-form">
            <div className="tabs">
              <button className={`tab-btn ${tab === 'login' ? 'activo' : ''}`} onClick={() => setTab('login')}>Iniciar sesión</button>
              <button className={`tab-btn ${tab === 'registro' ? 'activo' : ''}`} onClick={() => setTab('registro')}>Registrarse</button>
            </div>

            {tab === 'login' ? (
              <div className="panel activo">
                <h2>Inicia sesión en tu cuenta</h2>
                {lError && <div className="alerta v"><span>⚠️</span><span>{lError}</span></div>}
                <div className="form-group">
                  <input type="email" placeholder="Correo electrónico" value={lEmail} onChange={e => setLEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                </div>
                <div className="form-group pass-wrap">
                  <input type={verL ? 'text' : 'password'} placeholder="Contraseña" value={lPass} onChange={e => setLPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                  <button className="btn-ojo" type="button" onClick={() => setVerL(!verL)}>{verL ? '🙈' : '👁️'}</button>
                </div>
                <div className="forgot"><Link to="/recuperar">¿Olvidaste tu contraseña?</Link></div>
                <button className={`btn-main ${exito ? 'exito' : 'listo'}`} onClick={handleLogin} disabled={loading}>
                  {exito ? `¡Bienvenido, ${exito}!` : loading ? 'Ingresando...' : 'Iniciar sesión'}
                </button>
              </div>
            ) : (
              <div className="panel activo">
                <h2>Crea tu cuenta</h2>
                {rError && <div className="alerta v"><span>⚠️</span><span>{rError}</span></div>}
                <div className="form-group">
                  <input type="text" placeholder="Nombre completo" value={rNombre} onChange={e => setRNombre(e.target.value)} />
                </div>
                <div className="form-group tel-wrap">
                  <span className="prefijo">+56</span>
                  <input type="tel" placeholder="9 1234 5678" maxLength={9} value={rTel} onChange={e => setRTel(e.target.value.replace(/\D/g, ''))} />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Correo electrónico" value={rEmail} onChange={e => setREmail(e.target.value)} />
                </div>
                <div className="form-group pass-wrap">
                  <input type={verR ? 'text' : 'password'} placeholder="Contraseña (mínimo 8 caracteres)" value={rPass} onChange={e => setRPass(e.target.value)} />
                  <button className="btn-ojo" type="button" onClick={() => setVerR(!verR)}>{verR ? '🙈' : '👁️'}</button>
                </div>
                <div className="form-group pass-wrap">
                  <input type={verR2 ? 'text' : 'password'} placeholder="Confirmar contraseña" value={rPass2} onChange={e => setRPass2(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRegistro()} />
                  <button className="btn-ojo" type="button" onClick={() => setVerR2(!verR2)}>{verR2 ? '🙈' : '👁️'}</button>
                </div>
                <button className={`btn-main ${exito ? 'exito' : 'listo'}`} onClick={handleRegistro} disabled={loading}>
                  {exito ? `¡Bienvenido, ${exito}!` : loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}