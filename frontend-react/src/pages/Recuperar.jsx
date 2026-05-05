import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import './Login.css'

export default function Recuperar() {
  const canvasRef = useRef(null)
  const [email, setEmail]     = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let particulas = []

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    function crearParticula() {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 20,
        r: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.4 + 0.15),
        alpha: Math.random() * 0.8 + 0.2,
        color: `hsl(${Math.random() * 30 + 10}, 100%, ${Math.random() * 30 + 50}%)`,
      }
    }

    particulas = Array.from({ length: 200 }, crearParticula)
    particulas.forEach(p => { p.y = Math.random() * canvas.height })

    let animId
    function animar() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particulas.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.alpha -= 0.0004
        if (p.alpha <= 0 || p.y < 0) particulas[i] = crearParticula()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle   = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(animar)
    }
    animar()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  const handleEnviar = async () => {
    setError('')
    if (!email) { setError('Por favor ingresa tu correo'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('El correo no es válido'); return }
    setLoading(true)
    try {
      await api.recuperarPassword(email)
      setEnviado(true)
    } catch {
      setError('Error de conexión con el servidor')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <canvas ref={canvasRef} id="brasas" />
      <Link to="/login" className="back-btn">
        <img src="/assets/Login/flecha-izquierda.png" alt="←" width="14" />
        Volver al login
      </Link>
      <div className="login-wrap">
        <div className="login-card recuperar-card">
          <div className="col-form">
            <div className="recuperar-logo">
              <img src="/assets/General/doky-calcol-logo.png" alt="Calcol" />
            </div>
            <h2 className="recuperar-titulo">¿Olvidaste tu contraseña?</h2>
            <p className="recuperar-subtitulo">
              Ingresa tu correo y te enviaremos un link para restablecer tu contraseña.
            </p>
            {error && <div className="alerta v"><span>⚠️</span><span>{error}</span></div>}
            {enviado ? (
              <>
                <div className="alerta-exito v">✅ Si tu correo está registrado, recibirás un email con las instrucciones.</div>
                <button className="btn-main listo" onClick={() => { setEnviado(false); setEmail('') }}>
                  Intentar con otro correo
                </button>
              </>
            ) : (
              <>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleEnviar()}
                  />
                </div>
                <button className="btn-main listo" onClick={handleEnviar} disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar link de recuperación'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}