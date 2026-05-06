import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { setSession } from '../utils/auth'
import styles from './Login.module.css'

function useValidation() {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})

  const set = (name, value) => {
    setValues(v => ({ ...v, [name]: value }))
    setErrors(e => ({ ...e, [name]: undefined }))
  }

  const validate = (vals, fields) => {
    const e = {}
    if (fields.includes('nombre') && !vals.nombre?.trim())
      e.nombre = 'El nombre es obligatorio'
    if (fields.includes('telefono') && !/^9\d{8}$/.test(vals.telefono || ''))
      e.telefono = 'Debe empezar con 9 y tener 9 dígitos'
    if (fields.includes('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email || ''))
      e.email = 'Correo no válido'
    if (fields.includes('password') && (vals.password || '').length < 8)
      e.password = 'Mínimo 8 caracteres'
    if (fields.includes('confirmar') && vals.confirmar !== vals.password)
      e.confirmar = 'Las contraseñas no coinciden'
    if (fields.includes('lEmail') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.lEmail || ''))
      e.lEmail = 'Correo no válido'
    if (fields.includes('lPass') && !(vals.lPass || ''))
      e.lPass = 'La contraseña es obligatoria'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (fields) => validate(values, fields)
  const reset  = () => { setValues({}); setErrors({}) }

  return { values, errors, set, submit, reset }
}

const soloLetras = (e) => {
  if (e.type === 'paste') {
    e.preventDefault()
    const texto = e.clipboardData.getData('text')
    const limpio = texto.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/g, '')
    document.execCommand('insertText', false, limpio)
    return
  }
  if (e.key && e.key.length === 1 && !/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]$/.test(e.key)) {
    e.preventDefault()
  }
}

function InputPassword({ placeholder, value, onChange, error }) {
  const [ver, setVer] = useState(false)
  return (
    <div className={styles.campo}>
      <div className={styles.passWrap}>
        <input
          type={ver ? 'text' : 'password'}
          placeholder={placeholder}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className={[styles.input, error ? styles.inputError : ''].join(' ')}
          autoComplete="current-password"
        />
        <button type="button" className={styles.ojoBtn} onClick={() => setVer(!ver)}>
          {ver ? <OjoCerrado /> : <OjoAbierto />}
        </button>
      </div>
      {error && <span className={styles.errorMsg}>⚠ {error}</span>}
    </div>
  )
}

function Input({ type = 'text', placeholder, value, onChange, error, className = '' }) {
  return (
    <div className={styles.campo}>
      <input
        type={type}
        placeholder={placeholder}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className={[styles.input, error ? styles.inputError : '', className].join(' ')}
        autoComplete={type === 'password' ? 'current-password' : undefined}
      />
      {error && <span className={styles.errorMsg}>⚠ {error}</span>}
    </div>
  )
}

export default function Login() {
  const navigate  = useNavigate()
  const canvasRef = useRef(null)

  const [tab,       setTab]       = useState('login')
  const [loading,   setLoading]   = useState(false)
  const [serverErr, setServerErr] = useState('')

  const lForm = useValidation()
  const rForm = useValidation()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    const mk = () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 2.5 + 0.8,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.12),
      a:  Math.random() * 0.75 + 0.15,
      c:  `hsl(${Math.random() * 28 + 8},100%,${Math.random() * 28 + 50}%)`,
    })
    let pts = Array.from({ length: 180 }, mk)
    let id
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.a -= 0.0004
        if (p.a <= 0 || p.y < -10) pts[i] = mk()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle   = p.c
        ctx.globalAlpha = p.a
        ctx.fill()
      })
      ctx.globalAlpha = 1
      id = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])

  const cambiarTab = (t) => {
    setTab(t); setServerErr('')
    lForm.reset(); rForm.reset()
  }

  const handleLogin = async () => {
    if (!lForm.submit(['lEmail', 'lPass'])) return
    setLoading(true); setServerErr('')
    try {
      const res = await api.login(lForm.values.lEmail, lForm.values.lPass)
      if (res.error) { setServerErr(res.error); setLoading(false); return }
      setSession(res)
      const r = localStorage.getItem('calcol_redirect')
      if (r === 'checkout') {
        localStorage.removeItem('calcol_redirect')
        navigate('/checkout')
      } else {
        navigate('/bienvenido')
      }
    } catch { setServerErr('Error de conexión con el servidor') }
    setLoading(false)
  }

  const handleRegistro = async () => {
    if (!rForm.submit(['nombre', 'telefono', 'email', 'password', 'confirmar'])) return
    setLoading(true); setServerErr('')
    try {
      const res = await api.registro({
        nombre:   rForm.values.nombre.trim(),
        email:    rForm.values.email.trim().toLowerCase(),
        password: rForm.values.password,
        telefono: '+56' + rForm.values.telefono,
      })
      if (res.error) { setServerErr(res.error); setLoading(false); return }
      setSession(res)
      navigate('/bienvenido')
    } catch { setServerErr('Error de conexión con el servidor') }
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <Link to="/" className={styles.backBtn}>
        <img src="/assets/Login/flecha-izquierda.png" alt="←" width="14" />
        Inicio
      </Link>

      <div className={styles.card}>

        <div className={styles.imgCol}>
          <img src="/assets/Login/login-doki-piensa.jpeg" alt="Calcol" />
        </div>

        <div className={styles.formCol}>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'login' ? styles.tabActivo : ''}`}
              onClick={() => cambiarTab('login')}
            >
              Iniciar sesión
            </button>
            <button
              className={`${styles.tab} ${tab === 'registro' ? styles.tabActivo : ''}`}
              onClick={() => cambiarTab('registro')}
            >
              Registrarse
            </button>
          </div>

          {serverErr && (
            <div className={styles.serverError}>⚠ {serverErr}</div>
          )}

          {tab === 'login' && (
            <>
              <p className={styles.titulo}>Inicia sesión en tu cuenta</p>

              <Input
                type="email"
                placeholder="Correo electrónico"
                value={lForm.values.lEmail}
                onChange={v => lForm.set('lEmail', v)}
                error={lForm.errors.lEmail}
              />

              <InputPassword
                placeholder="Contraseña"
                value={lForm.values.lPass}
                onChange={v => lForm.set('lPass', v)}
                error={lForm.errors.lPass}
              />

              <div className={styles.forgot}>
                <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className={styles.btn}
              >
                {loading ? 'Ingresando...' : (
                  <>
                    Iniciar sesión
                    <img src="/assets/Carrito/flecha.png" alt="→" className={styles.btnFlecha} />
                  </>
                )}
              </button>
            </>
          )}

          {tab === 'registro' && (
            <>
              <p className={styles.titulo}>Crea tu cuenta</p>

              <div className={styles.campo}>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={rForm.values.nombre || ''}
                  onChange={e => rForm.set('nombre', e.target.value)}
                  onKeyDown={soloLetras}
                  onPaste={soloLetras}
                  className={[styles.input, rForm.errors.nombre ? styles.inputError : ''].join(' ')}
                />
                {rForm.errors.nombre && (
                  <span className={styles.errorMsg}>⚠ {rForm.errors.nombre}</span>
                )}
              </div>

              <div className={styles.campo}>
                <div className={styles.telRow}>
                  <span className={styles.prefijo}>+56</span>
                  <input
                    type="tel"
                    placeholder="9 1234 5678"
                    maxLength={9}
                    value={rForm.values.telefono || ''}
                    onChange={e => rForm.set('telefono', e.target.value.replace(/\D/g, ''))}
                    className={`${styles.input} ${styles.telInput} ${rForm.errors.telefono ? styles.inputError : ''}`}
                  />
                </div>
                {rForm.errors.telefono && (
                  <span className={styles.errorMsg}>⚠ {rForm.errors.telefono}</span>
                )}
              </div>

              <Input
                type="email"
                placeholder="Correo electrónico"
                value={rForm.values.email}
                onChange={v => rForm.set('email', v)}
                error={rForm.errors.email}
              />

              <InputPassword
                placeholder="Contraseña (mínimo 8 caracteres)"
                value={rForm.values.password}
                onChange={v => rForm.set('password', v)}
                error={rForm.errors.password}
              />

              <InputPassword
                placeholder="Confirmar contraseña"
                value={rForm.values.confirmar}
                onChange={v => rForm.set('confirmar', v)}
                error={rForm.errors.confirmar}
              />

              <button
                onClick={handleRegistro}
                disabled={loading}
                className={styles.btn}
              >
                {loading ? 'Creando cuenta...' : (
                  <>
                    Crear cuenta
                    <img src="/assets/Carrito/flecha.png" alt="→" className={styles.btnFlecha} />
                  </>
                )}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
const OjoAbierto = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const OjoCerrado = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)