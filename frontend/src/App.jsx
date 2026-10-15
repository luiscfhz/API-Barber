import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Servicios from './pages/Servicios'
import Barberos from './pages/Barberos'
import Clientes from './pages/Clientes'

// Pantalla temporal para las que aún no hacemos
function Pendiente({ titulo }) {
  return (
    <>
      <h1>{titulo}</h1>
      <p className="subtitulo">Esta pantalla se construye en el siguiente paso.</p>
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
        <Route path="/barberos" element={<Barberos />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/configuracion" element={<Pendiente titulo="Configuración" />} />
      </Route>
    </Routes>
  )
}