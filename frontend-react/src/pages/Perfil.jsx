import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getSession, setSession, clearSession } from '../utils/auth'
import { formatTelefono } from '../utils/formatters'
import { api } from '../services/api'
import './Perfil.css'

export default function Perfil() {
  const navigate = useNavigate()
  const sesion   = getSession()

  if (!sesion) { navigate('/login'); return null }

  const [modalEditar, setModalEditar]   = useState(false)
  const [modalCerrar, setModalCerrar]   = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [nombre, setNombre]             = useState(sesion.nombre)
  const [tel, setTel]                   = useState((sesion.telefono || '').replace(/\D/g, '').slice(-9))
  const [errNombre, setErrNombre]       = useState('')
  const [errTel, setErrTel]             = useState('')
  const [datosActuales, setDatosActuales] = useState(sesion)

  const iniciales = datosActuales.nombre.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()

  const guardarEditar = async () => {
    setErrNombre(''); setErrTel('')
    if (!nombre) { setErrNombre('El nombre es obligatorio'); return }
    if (tel && tel.length !== 9) { setErrTel('El teléfono debe tener 9 dígitos'); return }
    const telefono = tel ? '+56 9' + tel : datosActuales.telefono
    const data = await api.editarPerfil({ nombre, telefono })
    if (data.error) { setErrNombre(data.error); return }
    const nuevo = { ...datosActuales, nombre, telefono }
    setSession(nuevo)
    setDatosActuales(nuevo)
    setModalEditar(false)
  }

  return (
    <>
      <Navbar />
      <div className="perfil-wrap">
        <div className="perfil-card">
          <div className="perfil-banner">
            <div className="avatar-wrap">
              <div className="avatar">{iniciales}</div>
              <div className="avatar-info">
                <h1>{datosActuales.nombre}</h1>
                {datosActuales.rol !== 'cliente' && (
                  <span className="badge-rol">{datosActuales.rol === 'admin' ? 'Administrador' : 'Empleado'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="perfil-contenido">
            <div className="seccion-titulo-wrap">
              <h2 className="seccion-titulo">Mis datos</h2>
              <button className="btn-editar-perfil" onClick={() => setModalEditar(true)}>✏️ Editar</button>
            </div>
            <div className="dato-item"><span className="dato-label">Nombre</span><span className="dato-valor">{datosActuales.nombre}</span></div>
            <div className="dato-item"><span className="dato-label">Correo</span><span className="dato-valor">{datosActuales.email}</span></div>
            <div className="dato-item"><span className="dato-label">Teléfono</span><span className="dato-valor">{formatTelefono(datosActuales.telefono)}</span></div>

            <div className="acciones-wrap">
              <button className="btn-cerrar" onClick={() => setModalCerrar(true)}>
                <img src="/assets/General/icono-perfil.png" alt="" width="18" />
                Cerrar sesión
              </button>
              <button className="btn-eliminar" onClick={() => setModalEliminar(true)}>
                <img src="/assets/Carrito/bote-de-basura.png" alt="" width="18" />
                Solicitar eliminación de cuenta
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalEditar && (
        <div className="modal-overlay visible" onClick={e => e.target.className.includes('modal-overlay') && setModalEditar(false)}>
          <div className="modal modal-editar">
            <h3>Editar información</h3>
            <div className="editar-campo">
              <label>Nombre completo</label>
              <input className="editar-input" type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
              {errNombre && <span className="editar-error">{errNombre}</span>}
            </div>
            <div className="editar-campo">
              <label>Teléfono</label>
              <div className="editar-tel-wrap">
                <span className="editar-prefijo">+56 9</span>
                <input className="editar-input" type="text" maxLength={9} value={tel} onChange={e => setTel(e.target.value.replace(/\D/g, ''))} />
              </div>
              {errTel && <span className="editar-error">{errTel}</span>}
            </div>
            <div className="modal-btns">
              <button className="btn-cancelar" onClick={() => setModalEditar(false)}>Cancelar</button>
              <button className="btn-guardar-editar" onClick={guardarEditar}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}

      {modalCerrar && (
        <div className="modal-overlay visible">
          <div className="modal">
            <h3>¿Cerrar sesión?</h3>
            <p>¿Estás seguro que deseas cerrar tu sesión?</p>
            <div className="modal-btns">
              <button className="btn-cancelar" onClick={() => setModalCerrar(false)}>Cancelar</button>
              <button className="btn-confirmar-eliminar" onClick={() => { clearSession(); navigate('/') }}>Sí, cerrar sesión</button>
            </div>
          </div>
        </div>
      )}

      {modalEliminar && (
        <div className="modal-overlay visible">
          <div className="modal">
            <h3>Eliminar cuenta</h3>
            <p>Para eliminar tu cuenta envíanos un correo a <strong>contacto@calcol.cl</strong> con el asunto <strong>"Solicitud de eliminación de cuenta"</strong>.</p>
            <div className="modal-btns">
              <button className="btn-guardar-editar" onClick={() => setModalEliminar(false)}>Entendido</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}