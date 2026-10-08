import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

// Pantalla temporal para las que aún no hacemos
function Pendiente({ titulo }) {
  return (
    <>
      <h1>{titulo}</h1>
      <p className="subtitulo">PENDIENTE</p>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/panel" element={<Dashboard />} />
        <Route path="/citas" element={<Pendiente titulo="Gestión de Citas" />} />
        <Route path="/barberos" element={<Pendiente titulo="Barberos" />} />
        <Route path="/clientes" element={<Pendiente titulo="Clientes" />} />
        <Route path="/servicios" element={<Pendiente titulo="Servicios" />} />
        <Route path="/configuracion" element={<Pendiente titulo="Configuración" />} />
      </Route>
    </Routes>
  )
}