import { useState } from 'react'
import './ModalTarjeta.css'

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

function TarjetaPreview({ numero, nombre, vence, cvv, flip }) {
  const num = numero.replace(/\s/g, '')
  const tipo = num.startsWith('4') ? 'visa' : num.startsWith('5') ? 'mastercard' : null

  const bloques = [0,1,2,3].map(i => {
    const bloque = num.slice(i*4, i*4+4)
    return bloque ? bloque.padEnd(4, '·') : '····'
  })

  return (
    <div className={`tc-escena ${flip ? 'tc-flip' : ''}`}>
      <div className="tc-cara tc-frente">
        <div className="tc-brillo" />
        <div className="tc-chip">
          <div className="tc-chip-linea" />
          <div className="tc-chip-linea" />
          <div className="tc-chip-linea" />
        </div>
        {tipo === 'visa' && <img src="/assets/Carrito/icono-visa.png" alt="Visa" className="tc-logo" />}
        {tipo === 'mastercard' && <img src="/assets/Carrito/icono-mastercard.png" alt="Mastercard" className="tc-logo" />}
        {!tipo && <div className="tc-logo-placeholder">💳</div>}
        <div className="tc-numero">
          {bloques.map((b, i) => <span key={i}>{b}</span>)}
        </div>
        <div className="tc-inferior">
          <div className="tc-inferior-col">
            <span className="tc-etiqueta">Titular</span>
            <span className="tc-valor">{nombre || 'NOMBRE APELLIDO'}</span>
          </div>
          <div className="tc-inferior-col tc-inferior-col--right">
            <span className="tc-etiqueta">Vence</span>
            <span className="tc-valor">{vence || 'MM/AA'}</span>
          </div>
        </div>
      </div>

      <div className="tc-cara tc-reverso">
        <div className="tc-banda-magnetica" />
        <div className="tc-firma-wrap">
          <div className="tc-firma-fondo" />
          <span className="tc-cvv">{cvv || '•••'}</span>
        </div>
        <p className="tc-reverso-texto">Este número es confidencial</p>
      </div>
    </div>
  )
}

export default function ModalTarjeta({ tarjeta, onGuardar, onCerrar }) {
  const [numero,  setNumero]  = useState(tarjeta?.numero || '')
  const [nombre,  setNombre]  = useState(tarjeta?.nombre || '')
  const [vence,   setVence]   = useState(tarjeta?.vence || '')
  const [cvv,     setCvv]     = useState(tarjeta?.cvv || '')
  const [flip,    setFlip]    = useState(false)
  const [verCvv,  setVerCvv]  = useState(false)
  const [errores, setErrores] = useState({})

  const formatNumero = (v) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatVence = (v) => {
    const s = v.replace(/\D/g, '').slice(0, 4)
    return s.length > 2 ? s.slice(0,2) + '/' + s.slice(2) : s
  }

  const handleGuardar = () => {
    const errs = {}
    const num = numero.replace(/\s/g, '')
    if (num.length < 16)                errs.numero = 'Ingresa los 16 dígitos'
    if (!nombre.trim())                 errs.nombre = 'Ingresa el nombre del titular'
    if (!/^\d{2}\/\d{2}$/.test(vence)) errs.vence  = 'Formato MM/AA'
    if (cvv.length < 3)                 errs.cvv    = 'CVV debe tener 3 o 4 dígitos'
    if (Object.keys(errs).length) { setErrores(errs); return }
    const tipo = num.startsWith('4') ? 'visa' : num.startsWith('5') ? 'mastercard' : 'tarjeta'
    onGuardar({ numero, nombre, vence, cvv, tipo, ultimos: num.slice(-4) })
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="tc-modal" onClick={e => e.stopPropagation()}>

        <div className="tc-modal-header">
          <h3>{tarjeta ? 'Editar tarjeta' : 'Agregar tarjeta'}</h3>
          <button className="modal-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <div className="tc-preview-wrap">
          <TarjetaPreview numero={numero} nombre={nombre.toUpperCase()} vence={vence} cvv={cvv} flip={flip} />
        </div>

        <div className="tc-form">
          <div className="checkout-campo">
            <label className="checkout-label">Número de tarjeta</label>
            <input
              className={`checkout-input ${errores.numero ? 'tc-input-error' : ''}`}
              type="text"
              placeholder="1234 5678 9012 3456"
              value={numero}
              onChange={e => { setNumero(formatNumero(e.target.value)); setErrores(p => ({...p, numero: ''})) }}
              maxLength={19}
              onFocus={() => setFlip(false)}
            />
            {errores.numero && <span className="campo-error visible">{errores.numero}</span>}
          </div>

          <div className="checkout-campo">
            <label className="checkout-label">Nombre del titular</label>
            <input
              className={`checkout-input ${errores.nombre ? 'tc-input-error' : ''}`}
              type="text"
              placeholder="Como aparece en la tarjeta"
              value={nombre}
              onChange={e => { setNombre(e.target.value); setErrores(p => ({...p, nombre: ''})) }}
              onKeyDown={soloLetras}
              onPaste={soloLetras}
              onFocus={() => setFlip(false)}
            />
            {errores.nombre && <span className="campo-error visible">{errores.nombre}</span>}
          </div>

          <div className="tc-fila-dos">
            <div className="checkout-campo">
              <label className="checkout-label">Vence (MM/AA)</label>
              <input
                className={`checkout-input ${errores.vence ? 'tc-input-error' : ''}`}
                type="text"
                placeholder="MM/AA"
                value={vence}
                onChange={e => { setVence(formatVence(e.target.value)); setErrores(p => ({...p, vence: ''})) }}
                maxLength={5}
                onFocus={() => setFlip(false)}
              />
              {errores.vence && <span className="campo-error visible">{errores.vence}</span>}
            </div>

            <div className="checkout-campo">
              <label className="checkout-label">CVV</label>
              <div className="tc-cvv-wrap">
                <input
                  className={`checkout-input ${errores.cvv ? 'tc-input-error' : ''}`}
                  type={verCvv ? 'text' : 'password'}
                  placeholder="•••"
                  value={cvv}
                  onChange={e => { setCvv(e.target.value.replace(/\D/g, '').slice(0, 4)); setErrores(p => ({...p, cvv: ''})) }}
                  maxLength={4}
                  onFocus={() => setFlip(true)}
                  onBlur={() => setFlip(false)}
                />
                <button type="button" className="tc-ojo-btn" onClick={() => setVerCvv(!verCvv)}>
                  {verCvv ? <OjoCerrado /> : <OjoAbierto />}
                </button>
              </div>
              {errores.cvv && <span className="campo-error visible">{errores.cvv}</span>}
            </div>
          </div>

          <button className="btn-hacer-pedido" onClick={handleGuardar} style={{ marginTop: 8 }}>
            {tarjeta ? 'Guardar cambios' : 'Agregar tarjeta'}
          </button>
        </div>
      </div>
    </div>
  )
}