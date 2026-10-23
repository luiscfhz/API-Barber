import { Navigate, Outlet } from 'react-router-dom'
import { obtenerSesion } from '../services/sesion'

export default function RutaProtegida() {
  return obtenerSesion() ? <Outlet /> : <Navigate to="/login" replace />
}