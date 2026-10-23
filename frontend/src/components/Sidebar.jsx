import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, Scissors, Users, Sparkles, Settings, LogOut } from 'lucide-react'
import { obtenerSesion, cerrarSesion } from '../services/sesion'
import { cerrarSesionApi } from '../services/api'

const opciones = [
  { ruta: '/panel', texto: 'Panel principal', icono: LayoutDashboard },
  { ruta: '/citas', texto: 'Citas', icono: Calendar },
  { ruta: '/barberos', texto: 'Barberos', icono: Scissors },
  { ruta: '/clientes', texto: 'Clientes', icono: Users },
  { ruta: '/servicios', texto: 'Servicios', icono: Sparkles },
  { ruta: '/configuracion', texto: 'Configuración', icono: Settings },
]

export default function Sidebar() {
  const navegar = useNavigate()
  const sesion = obtenerSesion()

  async function salir() {
    await cerrarSesionApi()
    cerrarSesion()
    navegar('/login')
  }

  return (
    <aside className="sidebar">
      <div className="marca">
        <div className="marca-logo">MB</div>
        <div>
          <div className="marca-nombre">El Mapache Bigotón</div>
          <div className="marca-sub">BARBERÍA CONTEMPORÁNEA</div>
        </div>
      </div>

      <nav className="menu">
        {opciones.map(({ ruta, texto, icono: Icono }) => (
          <NavLink key={ruta} to={ruta} className={({ isActive }) => (isActive ? 'activo' : '')}>
            <Icono size={18} />
            {texto}
          </NavLink>
        ))}
      </nav>

      <div className="usuario">
        <div className="avatar" />
        <div style={{ flex: 1 }}>
          {sesion?.nombre}
          <small>{sesion?.rol}</small>
        </div>
        <button className="boton-salir" onClick={salir} title="Cerrar sesión">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  )
}