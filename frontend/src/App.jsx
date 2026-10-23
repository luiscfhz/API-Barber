import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import RutaProtegida from './components/RutaProtegida'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Citas from './pages/Citas'
import NuevaCita from './pages/NuevaCita'
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

      {/* Todo lo que está aquí dentro exige haber iniciado sesión */}
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/panel" element={<Dashboard />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/citas/nueva" element={<NuevaCita />} />
          <Route path="/citas/:id/editar" element={<NuevaCita />} />
          <Route path="/barberos" element={<Barberos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/configuracion" element={<Pendiente titulo="Configuración" />} />
        </Route>
      </Route>
    </Routes>
  )
}