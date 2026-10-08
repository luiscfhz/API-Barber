import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, Scissors, Users, Sparkles, Settings, LogOut } from 'lucide-react'

const opciones = [
  { ruta: '/panel', texto: 'Panel principal', icono: LayoutDashboard },
  { ruta: '/citas', texto: 'Citas', icono: Calendar },
  { ruta: '/barberos', texto: 'Barberos', icono: Scissors },
  { ruta: '/clientes', texto: 'Clientes', icono: Users },
  { ruta: '/servicios', texto: 'Servicios', icono: Sparkles },
  { ruta: '/configuracion', texto: 'Configuración', icono: Settings },
]

export default function Sidebar() {
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
          <NavLink
            key={ruta}
            to={ruta}
            className={({ isActive }) => (isActive ? 'activo' : '')}
          >
            <Icono size={18} />
            {texto}
          </NavLink>
        ))}
      </nav>

      <div className="usuario">
        <div className="avatar" />
        <div style={{ flex: 1 }}>
          Mariana López
          <small>Administradora</small>
        </div>
        <NavLink to="/login" style={{ color: '#cfcbbb' }}>
          <LogOut size={18} />
        </NavLink>
      </div>
    </aside>
  )
}