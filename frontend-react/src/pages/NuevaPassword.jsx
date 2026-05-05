import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../services/api'
import './Login.css'

export default function NuevaPassword() {
  const canvasRef = useRef(null)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [nuevaPass, setNuevaPass]       = useState('')
  const [confirmar, setConfirmar]       = useState('')
  const [error, setError]               = useState('')
  const [exito, setExito]               = useState(false)
  const [loading, setLoading]           = useState(false)
  const [verNueva, setVerNueva]         = useState(false)
  const [verConfirmar, setVerConfirmar] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let particulas = []
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    function crearP() {
      return { x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 3 + 1, vx: (Math.random() - 0.5) * 0.3, vy: -(Math.random() * 0.4 + 0.15), alpha: Math.random() * 0.8 + 0.2, color: `hsl(${Math.random() * 30 + 10}, 100%, ${Math.random() * 30 + 50}%)` }
    }
    particulas = Array.from({ length: 200 }, crearP)
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

  const handleCambiar = async () => {
    setError('')
    if (nuevaPass.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return }
    if (nuevaPass !== confirmar) { setError('Las contraseñas no coinciden'); return }
    setLoading(true)
    try {
      const data = await api.nuevaPassword(token, nuevaPass)
      if (data.error) { setError(data.error) } else { setExito(true) }
    } catch { setError('Error de conexión con el servidor') }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <canvas ref={canvasRef} id="brasas" />
      <div className="login-wrap">
        <div className="login-card recuperar-card">
          <div className="col-form">
            <div className="recuperar-logo">
              <img src="/assets/General/doky-calcol-logo.png" alt="Calcol" />
            </div>
            <h2 className="recuperar-titulo">Nueva contraseña</h2>
            {!token ? (
              <div className="token-invalido">
                <p>❌ El link es inválido o ha expirado.</p>
                <Link to="/recuperar">Solicitar nuevo link</Link>
              </div>
            ) : exito ? (
              <div className="cambio-exitoso">
                <p>✅ ¡Contraseña cambiada exitosamente!</p>
                <Link className="btn-main listo" to="/login">Iniciar sesión</Link>
              </div>
            ) : (
              <>
                {error && <div className="alerta v"><span>{error}</span></div>}
                <div className="form-group pass-wrap">
                  <input type={verNueva ? 'text' : 'password'} placeholder="Nueva contraseña" value={nuevaPass} onChange={e => setNuevaPass(e.target.value)} />
                  <button className="btn-ojo" type="button" onClick={() => setVerNueva(!verNueva)}>{verNueva ? '🙈' : '👁️'}</button>
                </div>
                <div className="form-group pass-wrap">
                  <input type={verConfirmar ? 'text' : 'password'} placeholder="Confirmar contraseña" value={confirmar} onChange={e => setConfirmar(e.target.value)} />
                  <button className="btn-ojo" type="button" onClick={() => setVerConfirmar(!verConfirmar)}>{verConfirmar ? '🙈' : '👁️'}</button>
                </div>
                <button className="btn-main listo" onClick={handleCambiar} disabled={loading}>
                  {loading ? 'Cambiando...' : 'Cambiar contraseña'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}