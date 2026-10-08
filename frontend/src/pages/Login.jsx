import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navegar = useNavigate()

  function iniciarSesion(evento) {
    evento.preventDefault()
    // Por ahora no valida nada: solo entra al panel.
    navegar('/panel')
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
          <input id="usuario" type="text" placeholder="nombre@elmapache.mx" />

          <label htmlFor="clave">Contraseña</label>
          <input id="clave" type="password" placeholder="••••••••" />

          <button className="boton" type="submit">Iniciar Sesión</button>
          <a className="olvido" href="#">¿Olvidó su contraseña?</a>
        </form>
      </div>
    </div>
  )
}