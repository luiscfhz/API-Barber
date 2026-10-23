import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { iniciarSesionApi } from '../services/api'
import { guardarSesion, obtenerSesion } from '../services/sesion'

export default function Login() {
  const navegar = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  // Si ya hay sesión, no tiene caso mostrar el Login
  if (obtenerSesion()) return <Navigate to="/panel" replace />

  async function iniciarSesion(evento) {
    evento.preventDefault()
    setError('')
    setCargando(true)
    try {
      const sesion = await iniciarSesionApi(usuario.trim(), clave)
      guardarSesion(sesion)
      navegar('/panel')
    } catch (e) {
      const incorrectas = e.message === 'Error 401' || e.message === 'Credenciales incorrectas'
      setError(incorrectas ? 'Usuario o contraseña incorrectos.' : 'No se pudo conectar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login">
      <div className="login-izquierda">
        <h2>Cada cita, una experiencia impecable.</h2>
        <p>Organiza la agenda, el equipo y la atención de la barbería.</p>
      </div>

      <div className="login-derecha">
        <form className="login-tarjeta tarjeta" onSubmit={iniciarSesion}>
          <h1>El Mapache Bigotón — Sistema de Citas</h1>
          <p className="subtitulo">Ingrese sus datos para administrar la barbería.</p>

          <label htmlFor="usuario">Usuario</label>
          <input
            id="usuario"
            type="text"
            placeholder="Nombre de usuario"
            autoComplete="username"
            required
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <label htmlFor="clave">Contraseña</label>
          <input
            id="clave"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            value={clave}
            onChange={(e) => setClave(e.target.value)}
          />

          {error && <div className="login-error">{error}</div>}

          <button className="boton" type="submit" disabled={cargando}>
            {cargando ? 'Entrando…' : 'Iniciar Sesión'}
          </button>
          <a className="olvido" href="#">¿Olvidó su contraseña?</a>
        </form>
      </div>
    </div>
  )
}